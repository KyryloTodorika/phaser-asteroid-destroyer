import Phaser from 'phaser'

import { Alien } from '../entities/Alien'
import type { AlienType } from '../entities/Alien'
import { Asteroid } from '../entities/Asteroid'
import { Boss } from '../entities/Boss'
import { Booster, BOOSTER_TYPES } from '../entities/Booster'
import { EnemyLaser } from '../entities/EnemyLaser'
import { ExplosionShot } from '../entities/ExplosionShot'
import { LaserBeam } from '../entities/LaserBeam'
import { Player } from '../entities/Player'
import { PlayerLaser } from '../entities/PlayerLaser'
import { RoundShot } from '../entities/RoundShot'
import type { SuperShotType } from '../entities/SuperShot'
import { SCORE_VALUES } from '../config/score'
import { BossHealthBar } from '../ui/BossHealthBar'
import { GameUI } from '../ui/GameUI'
import { createActionButton, titleStyle } from '../ui/theme'

type BossSpawnPattern = 'asteroid' | 'fast' | 'fat' | 'shooter'

export class BossScene extends Phaser.Scene {
    private player!: Player
    private boss!: Boss
    private bossHealthBar!: BossHealthBar
    private ui!: GameUI

    private playerLasers!: Phaser.Physics.Arcade.Group
    private enemyLasers!: Phaser.Physics.Arcade.Group
    private laserBeams!: Phaser.Physics.Arcade.Group
    private bombShots!: Phaser.Physics.Arcade.Group
    private asteroidGroup!: Phaser.Physics.Arcade.Group
    private alienGroup!: Phaser.Physics.Arcade.Group
    private boosterGroup!: Phaser.Physics.Arcade.Group

    private aliens: Alien[] = []
    private unlockedSpawnPatterns = new Set<BossSpawnPattern>()
    private lastSpawnAt: Record<BossSpawnPattern, number> = {
        asteroid: 0,
        fast: 0,
        fat: 0,
        shooter: 0
    }
    private finalMovementStarted: boolean = false
    private score: number = 0

    private roundShot?: RoundShot
    private selectedSuperShot?: SuperShotType
    private fightComplete: boolean = false

    constructor() {
        super('BossScene')
    }

    init(data: { superShot?: SuperShotType; score?: number }) {
        this.selectedSuperShot = data.superShot
        this.score = data.score ?? 0
    }

    create() {
        this.fightComplete = false
        this.roundShot = undefined
        this.aliens = []
        this.unlockedSpawnPatterns.clear()
        this.lastSpawnAt = {
            asteroid: 0,
            fast: 0,
            fat: 0,
            shooter: 0
        }
        this.finalMovementStarted = false

        this.add.image(640, 360, 'boss_background')
            .setDisplaySize(1280, 720)

        this.add.rectangle(640, 360, 1280, 720, 0x020611, 0.24)

        this.playerLasers = this.physics.add.group()
        this.enemyLasers = this.physics.add.group()
        this.laserBeams = this.physics.add.group()
        this.bombShots = this.physics.add.group()
        this.asteroidGroup = this.physics.add.group()
        this.alienGroup = this.physics.add.group()
        this.boosterGroup = this.physics.add.group()

        this.player = new Player(
            this,
            180,
            360,
            this.playerLasers
        )

        if (this.selectedSuperShot) {
            this.player.setSuperShot(this.selectedSuperShot)
        }

        this.ui = new GameUI(this)
        this.ui.create(10)
        this.ui.updateHealth(this.player.getHealth())
        this.ui.updateScore(this.score)
        this.ui.updateSuperShot(
            this.player.getSuperShotCooldownProgress(),
            Boolean(this.selectedSuperShot)
        )

        this.player.on(
            'supershot',
            (
                type: SuperShotType,
                directionX: number,
                directionY: number
            ) => this.fireSuperShot(type, directionX, directionY)
        )

        this.boss = new Boss(this, 990, 360)
        this.bossHealthBar = new BossHealthBar(this, 1240, 130)
        this.bossHealthBar.update(Boss.maxHealth, Boss.maxHealth)

        this.createCollisions()
    }

    update(time: number, delta: number) {
        if (this.fightComplete) {
            return
        }

        if (!this.player.active) {
            this.scene.start('GameOverScene', {
                wave: 10,
                score: this.score
            })
            return
        }

        this.player.update()

        this.boosterGroup.getChildren().forEach(boosterObject => {
            (boosterObject as Booster).update(this.player)
        })

        if (this.boss.update(this.player, time)) {
            this.fireBossLaser()
        }

        this.updateBossPhases(time)

        this.aliens.forEach(alien => {
            if (alien.active && alien.update(this.player, time)) {
                this.fireEnemyLaser(alien, 35)
            }
        })

        this.aliens = this.aliens.filter(alien => alien.active)

        this.ui.updateHealth(this.player.getHealth())
        this.ui.updateSuperShot(
            this.player.getSuperShotCooldownProgress(),
            Boolean(this.selectedSuperShot)
        )

        this.roundShot?.update(delta)

        if (this.roundShot && !this.roundShot.isActive()) {
            this.roundShot = undefined
        }

        this.bombShots.getChildren().forEach(shotObject => {
            const shot = shotObject as ExplosionShot
            const body = shot.body as Phaser.Physics.Arcade.Body

            if (
                shot.active &&
                (
                    body.blocked.left ||
                    body.blocked.right ||
                    body.blocked.up ||
                    body.blocked.down
                )
            ) {
                this.detonateExplosionShot(shot)
            }
        })
    }

    private createCollisions() {
        this.physics.add.collider(this.player, this.boss)
        this.physics.add.overlap(
            this.player,
            this.boosterGroup,
            (_playerObject, boosterObject) => {
                this.collectBooster(boosterObject as Booster)
            }
        )
        this.physics.add.collider(
            this.player,
            this.asteroidGroup,
            () => {
                if (this.player.active && !this.fightComplete) {
                    this.player.takeDamage(10)
                }
            }
        )
        this.physics.add.collider(
            this.player,
            this.alienGroup,
            () => {
                if (this.player.active && !this.fightComplete) {
                    this.player.takeDamage(20)
                }
            }
        )
        this.physics.add.collider(this.asteroidGroup, this.asteroidGroup)
        this.physics.add.collider(this.boss, this.asteroidGroup)
        this.physics.add.collider(this.boss, this.alienGroup)

        this.physics.add.overlap(
            this.player,
            this.enemyLasers,
            (_playerObject, laserObject) => {
                const laser = laserObject as EnemyLaser

                if (
                    !laser.active ||
                    !this.player.active ||
                    this.fightComplete
                ) {
                    return
                }

                laser.destroy()
                this.player.takeDamage(laser.getDamage())
            }
        )

        this.physics.add.overlap(
            this.boss,
            this.playerLasers,
            (_bossObject, laserObject) => {
                const laser = laserObject as PlayerLaser

                if (!laser.active || !this.boss.active) {
                    return
                }

                const damage = laser.getDamage()
                laser.destroy()
                this.damageBoss(damage)
            }
        )

        this.physics.add.overlap(
            this.boss,
            this.laserBeams,
            (_bossObject, beamObject) => {
                const beam = beamObject as LaserBeam

                if (!beam.active || !this.boss.active) {
                    return
                }

                const damage = beam.hit(this.boss)

                if (damage > 0) {
                    this.damageBoss(damage)
                }
            }
        )

        this.physics.add.overlap(
            this.boss,
            this.bombShots,
            (_bossObject, shotObject) => {
                this.detonateExplosionShot(
                    shotObject as ExplosionShot
                )
            }
        )

        this.physics.add.overlap(
            this.playerLasers,
            this.asteroidGroup,
            (laserObject, asteroidObject) => {
                const laser = laserObject as PlayerLaser
                const asteroid = asteroidObject as Asteroid

                if (!laser.active || !asteroid.active) {
                    return
                }

                const damage = laser.getDamage()
                laser.destroy()
                this.damageAsteroid(asteroid, damage)
            }
        )

        this.physics.add.overlap(
            this.playerLasers,
            this.alienGroup,
            (laserObject, alienObject) => {
                const laser = laserObject as PlayerLaser
                const alien = alienObject as Alien

                if (!laser.active || !alien.active) {
                    return
                }

                const damage = laser.getDamage()
                laser.destroy()
                this.damageAlien(alien, damage)
            }
        )

        this.physics.add.overlap(
            this.laserBeams,
            this.asteroidGroup,
            (beamObject, asteroidObject) => {
                const beam = beamObject as LaserBeam
                const asteroid = asteroidObject as Asteroid

                if (!beam.active || !asteroid.active) {
                    return
                }

                const damage = beam.hit(asteroid)

                if (damage > 0) {
                    this.damageAsteroid(asteroid, damage)
                }
            }
        )

        this.physics.add.overlap(
            this.laserBeams,
            this.alienGroup,
            (beamObject, alienObject) => {
                const beam = beamObject as LaserBeam
                const alien = alienObject as Alien

                if (!beam.active || !alien.active) {
                    return
                }

                const damage = beam.hit(alien)

                if (damage > 0) {
                    this.damageAlien(alien, damage)
                }
            }
        )

        this.physics.add.overlap(
            this.bombShots,
            this.asteroidGroup,
            shotObject => {
                this.detonateExplosionShot(shotObject as ExplosionShot)
            }
        )

        this.physics.add.overlap(
            this.bombShots,
            this.alienGroup,
            shotObject => {
                this.detonateExplosionShot(shotObject as ExplosionShot)
            }
        )
    }

    private updateBossPhases(time: number) {
        const healthRatio = this.boss.getHealth() / Boss.maxHealth

        this.updateSpawnPattern(
            'asteroid',
            healthRatio,
            0.9,
            3000,
            time,
            () => this.spawnAsteroid()
        )
        this.updateSpawnPattern(
            'fast',
            healthRatio,
            0.75,
            4500,
            time,
            () => this.spawnAlien('fast')
        )
        this.updateSpawnPattern(
            'fat',
            healthRatio,
            0.65,
            6000,
            time,
            () => this.spawnAlien('fat')
        )
        this.updateSpawnPattern(
            'shooter',
            healthRatio,
            0.5,
            5000,
            time,
            () => this.spawnAlien('shooter')
        )

        if (healthRatio < 0.25 && !this.finalMovementStarted) {
            this.finalMovementStarted = true
            this.boss.startArenaMovement()
        }
    }

    private updateSpawnPattern(
        pattern: BossSpawnPattern,
        healthRatio: number,
        threshold: number,
        interval: number,
        time: number,
        spawn: () => void
    ) {
        if (healthRatio >= threshold) {
            return
        }

        if (!this.unlockedSpawnPatterns.has(pattern)) {
            this.unlockedSpawnPatterns.add(pattern)
            this.lastSpawnAt[pattern] = time
            spawn()
            return
        }

        if (time - this.lastSpawnAt[pattern] >= interval) {
            this.lastSpawnAt[pattern] = time
            spawn()
        }
    }

    private spawnAsteroid() {
        const position = this.getSpawnPosition()
        const texture = `asteroid_${Phaser.Math.Between(1, 4)}`
        const asteroid = new Asteroid(
            this,
            position.x,
            position.y,
            texture,
            150
        )

        const size = Phaser.Math.Between(80, 140)
        asteroid.setDisplaySize(size, size)
        this.asteroidGroup.add(asteroid)
        asteroid.startMovement()
    }

    private spawnAlien(type: Exclude<AlienType, 'standard'>) {
        const position = this.getSpawnPosition()
        const alien = new Alien(this, position.x, position.y, type)

        this.aliens.push(alien)
        this.alienGroup.add(alien)
    }

    private getSpawnPosition(): Phaser.Math.Vector2 {
        const position = new Phaser.Math.Vector2()

        for (let attempt = 0; attempt < 30; attempt++) {
            position.set(
                Phaser.Math.Between(100, 1180),
                Phaser.Math.Between(100, 620)
            )

            const farFromPlayer = Phaser.Math.Distance.Between(
                position.x,
                position.y,
                this.player.x,
                this.player.y
            ) >= 250
            const farFromBoss = Phaser.Math.Distance.Between(
                position.x,
                position.y,
                this.boss.x,
                this.boss.y
            ) >= 220

            if (farFromPlayer && farFromBoss) {
                break
            }
        }

        return position
    }

    private fireBossLaser() {
        this.fireEnemyLaser(this.boss, 150)
    }

    private fireEnemyLaser(
        shooter: Phaser.Physics.Arcade.Sprite,
        offset: number
    ) {
        const direction = new Phaser.Math.Vector2(
            this.player.x - shooter.x,
            this.player.y - shooter.y
        )

        if (direction.lengthSq() === 0) {
            return
        }

        direction.normalize()

        const laser = new EnemyLaser(
            this,
            shooter.x + direction.x * offset,
            shooter.y + direction.y * offset,
            Phaser.Math.Angle.Between(
                0,
                0,
                direction.x,
                direction.y
            ) + Math.PI / 2
        )

        this.enemyLasers.add(laser)
        laser.setVelocity(direction.x * 350, direction.y * 350)
    }

    private fireSuperShot(
        type: SuperShotType,
        directionX: number,
        directionY: number
    ) {
        if (type === 'laser') {
            this.laserBeams.add(
                new LaserBeam(this, this.player)
            )
            return
        }

        if (type === 'round') {
            this.stopRoundShot()
            this.roundShot = new RoundShot(
                this,
                this.player,
                this.playerLasers
            )
            return
        }

        const direction = new Phaser.Math.Vector2(
            directionX,
            directionY
        ).normalize()

        const shot = new ExplosionShot(
            this,
            this.player.x + direction.x * 55,
            this.player.y + direction.y * 55,
            direction
        )

        this.bombShots.add(shot)
        shot.launch(direction)
    }

    private detonateExplosionShot(shot: ExplosionShot) {
        if (!shot.active) {
            return
        }

        const explosionX = shot.x
        const explosionY = shot.y

        if (!shot.detonate()) {
            return
        }

        this.damageObjectsInBlast(
            this.asteroidGroup,
            explosionX,
            explosionY,
            target => this.damageAsteroid(
                target as Asteroid,
                ExplosionShot.blastDamage
            )
        )

        this.damageObjectsInBlast(
            this.alienGroup,
            explosionX,
            explosionY,
            target => this.damageAlien(
                target as Alien,
                ExplosionShot.blastDamage
            )
        )

        if (this.boss.active) {
            const bossRadius = Math.max(
                this.boss.displayWidth,
                this.boss.displayHeight
            ) * 0.35

            const distance = Phaser.Math.Distance.Between(
                explosionX,
                explosionY,
                this.boss.x,
                this.boss.y
            )

            if (distance <= ExplosionShot.blastRadius + bossRadius) {
                this.damageBoss(ExplosionShot.blastDamage)
            }
        }

        const blast = this.add.circle(
            explosionX,
            explosionY,
            ExplosionShot.blastRadius,
            0xff8a00,
            0.35
        )
        .setStrokeStyle(6, 0xffffaa, 0.9)
        .setScale(0.15)
        .setDepth(30)

        this.tweens.add({
            targets: blast,
            scale: 1,
            alpha: 0,
            duration: 320,
            ease: 'Quad.Out',
            onComplete: () => blast.destroy()
        })
    }

    private damageObjectsInBlast(
        group: Phaser.Physics.Arcade.Group,
        explosionX: number,
        explosionY: number,
        applyDamage: (target: Phaser.GameObjects.GameObject) => void
    ) {
        group.getChildren().forEach(target => {
            if (!target.active) {
                return
            }

            const object = target as Phaser.GameObjects.Sprite
            const targetRadius = Math.max(
                object.displayWidth,
                object.displayHeight
            ) * 0.35
            const distance = Phaser.Math.Distance.Between(
                explosionX,
                explosionY,
                object.x,
                object.y
            )

            if (distance <= ExplosionShot.blastRadius + targetRadius) {
                applyDamage(target)
            }
        })
    }

    private damageAlien(alien: Alien, amount: number) {
        const dropX = alien.x
        const dropY = alien.y

        if (alien.takeDamage(amount)) {
            this.addScore(SCORE_VALUES.alien[alien.getType()])
            this.tryDropBooster(dropX, dropY)
        }
    }

    private damageAsteroid(asteroid: Asteroid, amount: number) {
        const dropX = asteroid.x
        const dropY = asteroid.y

        if (asteroid.takeDamage(amount)) {
            this.addScore(SCORE_VALUES.asteroid)
            this.tryDropBooster(dropX, dropY)
        }
    }

    private tryDropBooster(x: number, y: number) {
        if (Math.random() >= 0.25) {
            return
        }

        const type = Phaser.Utils.Array.GetRandom(BOOSTER_TYPES)
        this.boosterGroup.add(new Booster(this, x, y, type))
    }

    private collectBooster(booster: Booster) {
        if (!booster.active || !this.player.active) {
            return
        }

        switch (booster.getType()) {
            case 'heal':
                this.player.heal(40)
                break
            case 'shield':
                this.player.activateShield(3000)
                break
            case 'attackSpeed':
                this.player.activateAttackSpeedBoost()
                break
            case 'superShot':
                this.player.activateSuperShotCharge(3000)
                break
        }

        booster.destroy()
    }

    private addScore(points: number) {
        this.score += points
        this.ui.updateScore(this.score)
    }

    private formatScore(): string {
        return `SCORE  ${String(this.score).padStart(6, '0')}`
    }

    private damageBoss(amount: number) {
        if (!this.boss.active || this.fightComplete) {
            return
        }

        this.boss.takeDamage(amount)
        this.bossHealthBar.update(
            this.boss.getHealth(),
            Boss.maxHealth
        )

        if (this.boss.getHealth() === 0) {
            this.addScore(SCORE_VALUES.boss)
            this.completeFight()
        }
    }

    private completeFight() {
        this.fightComplete = true
        this.stopRoundShot()
        this.player.setActive(false)
        this.physics.pause()

        this.add.rectangle(640, 360, 1280, 720, 0x020611, 0.72)
            .setDepth(200)

        this.add.text(640, 280, 'BOSS DESTROYED', {
            ...titleStyle,
            fontSize: '58px',
            letterSpacing: 4
        })
        .setOrigin(0.5)
        .setDepth(201)

        this.add.text(640, 355, `FINAL ${this.formatScore()}`, {
            fontFamily: 'Trebuchet MS, Arial, sans-serif',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#54e7ff',
            letterSpacing: 3
        })
        .setOrigin(0.5)
        .setDepth(201)

        createActionButton(
            this,
            640,
            440,
            'RETURN TO MENU',
            () => this.scene.start('MenuScene'),
            300
        )
    }

    private stopRoundShot() {
        this.roundShot?.destroy()
        this.roundShot = undefined
    }
}
