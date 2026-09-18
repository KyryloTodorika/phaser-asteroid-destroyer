import Phaser from 'phaser'

import { Player } from '../entities/Player'
import { PlayerLaser } from '../entities/PlayerLaser'
import { Asteroid } from '../entities/Asteroid'
import { Alien } from '../entities/Alien'
import type { AlienType } from '../entities/Alien'
import { EnemyLaser } from '../entities/EnemyLaser'
import { BlackHole } from '../entities/BlackHole'
import { LaserBeam } from '../entities/LaserBeam'
import { ExplosionShot } from '../entities/ExplosionShot'
import { RoundShot } from '../entities/RoundShot'
import type { SuperShotType } from '../entities/SuperShot'
import { Booster, BOOSTER_TYPES } from '../entities/Booster'
import { SCORE_VALUES } from '../config/score'

import { WaveManager } from '../systems/WaveManager'
import type { WaveConfig } from '../data/waves'
import { GameUI } from '../ui/GameUI'

export class GameScene extends Phaser.Scene {

    // =====================================================
    // PLAYER
    // =====================================================

    private player!: Player

    // =====================================================
    // ENEMIES
    // =====================================================

    private aliens: Alien[] = []

    private alienGroup!: Phaser.Physics.Arcade.Group

    // =====================================================
    // ASTEROIDS
    // =====================================================

    private asteroidGroup!: Phaser.Physics.Arcade.Group
    private blackHoleGroup!: Phaser.Physics.Arcade.Group

    // =====================================================
    // PROJECTILES
    // =====================================================

    private playerLasers!: Phaser.Physics.Arcade.Group
    private enemyLasers!: Phaser.Physics.Arcade.Group
    private superShots!: Phaser.Physics.Arcade.Group
    private bombShots!: Phaser.Physics.Arcade.Group
    private boosterGroup!: Phaser.Physics.Arcade.Group

    private roundShot?: RoundShot

    // =====================================================
    // UI
    // =====================================================

    private ui!: GameUI

    // =====================================================
    // WAVE SYSTEM
    // =====================================================

    private waveManager!: WaveManager

    private currentWave: number = 1
    private score: number = 0

    private waveInProgress: boolean = false
    private waveComplete: boolean = false

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    constructor() {
        super('GameScene')
    }

    // =====================================================
    // CREATE
    // =====================================================

    create() {

        // =========================================
        // RESET
        // =========================================

        this.aliens = []

        this.waveInProgress = false
        this.waveComplete = false
        this.currentWave = 1
        this.score = 0
        this.registry.remove('selectedSuperShot')

        // =========================================
        // BACKGROUND
        // =========================================

        this.add
            .image(
                640,
                360,
                'background'
            )
            .setDisplaySize(
                1280,
                720
            )

        // =========================================
        // PHYSICS GROUPS
        // =========================================

        this.playerLasers =
            this.physics.add.group()

        this.enemyLasers =
            this.physics.add.group()

        this.superShots =
            this.physics.add.group()

        this.bombShots =
            this.physics.add.group()

        this.boosterGroup =
            this.physics.add.group()

        this.alienGroup =
            this.physics.add.group()

        this.asteroidGroup =
            this.physics.add.group()

        this.blackHoleGroup =
            this.physics.add.group()

        // =========================================
        // UI
        // =========================================

        this.ui = new GameUI(this)
        this.ui.create(this.currentWave)

        // =========================================
        // PLAYER
        // =========================================

        this.player =
            new Player(
                this,
                640,
                360,
                this.playerLasers
            )

        this.player.on(
            'supershot',
            (
                type: SuperShotType,
                directionX: number,
                directionY: number
            ) => {
                this.fireSuperShot(
                    type,
                    directionX,
                    directionY
                )
            }
        )

        // =========================================
        // WAVE MANAGER
        // =========================================

        this.waveManager =
            new WaveManager()

        this.currentWave =
            this.waveManager.getCurrentWave()

        // =========================================
        // COLLISIONS
        // =========================================

        this.createCollisions()

        // =========================================
        // FIRST WAVE
        // =========================================

        this.createWave()

        // =========================================
        // UI
        // =========================================

        this.updateHealthUI()
        this.ui.updateScore(this.score)
        this.ui.updateSuperShot(
            this.player.getSuperShotCooldownProgress(),
            Boolean(this.registry.get('selectedSuperShot'))
        )
    }

    // =====================================================
    // UI
    // =====================================================

    private updateHealthUI() {

        if (
            !this.player ||
            !this.player.active
        ) {
            return
        }

        this.ui.updateHealth(
            this.player.getHealth()
        )
    }

    // =====================================================
    // CREATE WAVE
    // =====================================================

    private createWave() {

        const config:
            WaveConfig | undefined =
            this.waveManager
                .getCurrentConfig()

        if (!config) {

            console.log(
                'No configuration for wave:',
                this.currentWave
            )

            return
        }

        console.log(
            `Starting Wave ${config.wave}`
        )

        this.waveInProgress = true
        this.waveComplete = false

        this.currentWave =
            config.wave

        // =========================================
        // UPDATE WAVE UI
        // =========================================

        this.ui.updateWave(this.currentWave)

        // =========================================
        // ASTEROIDS
        // =========================================

        for (
            let i = 0;
            i < config.asteroids.count;
            i++
        ) {

            this.createAsteroid()
        }

        for (let i = 0; i < config.blackHoles.count; i++) {
            this.createBlackHole()
        }

        // =========================================
        // ALIENS
        // =========================================

        for (
            let i = 0;
            i < config.aliens.standard;
            i++
        ) {

            this.createAlien('standard')
        }

        for (const type of ['fast', 'fat', 'shooter'] as AlienType[]) {
            for (let i = 0; i < config.aliens[type]; i++) {
                this.createAlien(type)
            }
        }
    }

    // =====================================================
    // CREATE ASTEROID
    // =====================================================

    private createAsteroid() {

        const asteroidTypes = [
            'asteroid_1',
            'asteroid_2',
            'asteroid_3',
            'asteroid_4'
        ]

        const texture =
            Phaser.Utils.Array.GetRandom(
                asteroidTypes
            )

        const size =
            Phaser.Math.Between(
                80,
                140
            )

        let x: number
        let y: number

        do {
            x = Phaser.Math.Between(
                100,
                1180
            )

            y = Phaser.Math.Between(
                100,
                620
            )

        } while (
            Phaser.Math.Distance.Between(
                x,
                y,
                this.player.x,
                this.player.y
            ) < 180
        )

        // =========================================
        // CREATE ASTEROID
        // =========================================

        const asteroid =
            new Asteroid(
                this,
                x,
                y,
                texture,
                150
            )

        asteroid.setDisplaySize(
            size,
            size
        )

        // =========================================
        // ADD TO PHYSICS GROUP
        // =========================================

        this.asteroidGroup.add(
            asteroid
        )

        // =========================================
        // NOW START PHYSICS
        // =========================================

        asteroid.startMovement()

        return asteroid
    }

    // =====================================================
    // CREATE ALIEN
    // =====================================================

    private createAlien(type: AlienType) {

        let x: number
        let y: number

        // =========================================
        // RANDOM SPAWN
        // =========================================

        do {

            x =
                Phaser.Math.Between(
                    100,
                    1180
                )

            y =
                Phaser.Math.Between(
                    100,
                    620
                )

        } while (
            Phaser.Math.Distance.Between(
                x,
                y,
                this.player.x,
                this.player.y
            ) < 250
        )

        // =========================================
        // CREATE
        // =========================================

        const alien =
            new Alien(
                this,
                x,
                y,
                type
            )

        // =========================================
        // STORE
        // =========================================

        this.aliens.push(
            alien
        )

        this.alienGroup.add(
            alien
        )
    }

    // =====================================================
    // CREATE BLACK HOLE
    // =====================================================

    private createBlackHole() {
        let x: number
        let y: number

        do {
            x = Phaser.Math.Between(140, 1140)
            y = Phaser.Math.Between(140, 580)
        } while (
            Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y) < 250
        )

        const blackHole = new BlackHole(this, x, y)
        this.blackHoleGroup.add(blackHole)
    }

    // =====================================================
    // COLLISIONS
    // =====================================================

    private createCollisions() {

        this.physics.add.overlap(
            this.player,
            this.boosterGroup,
            (_playerObject, boosterObject) => {
                this.collectBooster(boosterObject as Booster)
            }
        )

        // =========================================
        // PLAYER <-> ASTEROIDS
        // =========================================

        this.physics.add.collider(
            this.player,
            this.asteroidGroup,
            () => {

                if (
                    !this.player.active ||
                    this.waveComplete
                ) {
                    return
                }

                this.player.takeDamage(
                    10
                )
            }
        )

        // =========================================
        // PLAYER <-> ALIENS
        // =========================================

        this.physics.add.collider(
            this.player,
            this.alienGroup,
            () => {

                if (
                    !this.player.active ||
                    this.waveComplete
                ) {
                    return
                }

                this.player.takeDamage(
                    20
                )
            }
        )

        // =========================================
        // ASTEROIDS <-> ALIENS
        // =========================================

        this.physics.add.collider(
            this.asteroidGroup,
            this.alienGroup,
            (
                _asteroidObject,
                alienObject
            ) => {

                if (this.waveComplete) {
                    return
                }

                const alien =
                    alienObject as Alien

                if (alien.active) {
                    this.damageAlien(alien, 10)
                }
            }
        )

        // =========================================
        // ASTEROID <-> ASTEROID
        // =========================================

        this.physics.add.collider(
            this.asteroidGroup,
            this.asteroidGroup
        )

        // =========================================
        // PLAYER <-> BLACK HOLES
        // =========================================

        this.physics.add.overlap(
            this.player,
            this.blackHoleGroup,
            () => {
                if (!this.player.active || this.waveComplete) {
                    return
                }

                this.player.takeDamage(30)
            }
        )

        // =========================================
        // LASERS -> BLACK HOLES
        // =========================================

        this.physics.add.overlap(
            this.playerLasers,
            this.blackHoleGroup,
            (laserObject) => {
                const laser = laserObject as PlayerLaser

                if (laser.active) {
                    laser.destroy()
                }
            }
        )

        this.physics.add.overlap(
            this.enemyLasers,
            this.blackHoleGroup,
            (laserObject) => {
                const laser = laserObject as EnemyLaser

                if (laser.active) {
                    laser.destroy()
                }
            }
        )

        // =========================================
        // SUPER SHOTS
        // =========================================

        this.physics.add.overlap(
            this.superShots,
            this.blackHoleGroup,
            (shotObject) => {
                const shot = shotObject as LaserBeam

                if (shot.active) {
                    shot.destroy()
                }
            }
        )

        // =========================================
        // EXPLOSION SHOT
        // =========================================

        this.physics.add.overlap(
            this.bombShots,
            this.blackHoleGroup,
            (shotObject) => {
                this.detonateExplosionShot(
                    shotObject as ExplosionShot
                )
            }
        )

        this.physics.add.overlap(
            this.bombShots,
            this.asteroidGroup,
            (shotObject) => {
                this.detonateExplosionShot(
                    shotObject as ExplosionShot
                )
            }
        )

        this.physics.add.overlap(
            this.bombShots,
            this.alienGroup,
            (shotObject) => {
                if (!this.waveComplete) {
                    this.detonateExplosionShot(
                        shotObject as ExplosionShot
                    )
                }
            }
        )

        this.physics.add.overlap(
            this.superShots,
            this.asteroidGroup,
            (shotObject, asteroidObject) => {
                const shot = shotObject as LaserBeam
                const asteroid = asteroidObject as Asteroid

                if (!shot.active || !asteroid.active) {
                    return
                }

                const damage = shot.hit(asteroid)

                if (damage > 0) {
                    this.damageAsteroid(asteroid, damage)
                }
            }
        )

        this.physics.add.overlap(
            this.superShots,
            this.alienGroup,
            (shotObject, alienObject) => {
                const shot = shotObject as LaserBeam
                const alien = alienObject as Alien

                if (!shot.active || !alien.active || this.waveComplete) {
                    return
                }

                const damage = shot.hit(alien)

                if (damage > 0) {
                    this.damageAlien(alien, damage)
                }
            }
        )

        this.physics.add.overlap(
            this.playerLasers,
            this.asteroidGroup,
            (
                laserObject,
                asteroidObject
            ) => {

                const laser =
                    laserObject as PlayerLaser

                const asteroid =
                    asteroidObject as Asteroid

                if (
                    !laser.active ||
                    !asteroid.active
                ) {
                    return
                }

                const damage =
                    laser.getDamage()

                // Destroy laser
                laser.destroy()

                // Damage asteroid
                if (asteroid.active) {
                    this.damageAsteroid(asteroid, damage)
                }
            }
        )

        // =========================================
        // ENEMY LASER -> PLAYER
        // =========================================

        this.physics.add.overlap(
            this.player,
            this.enemyLasers,
            (_playerObject, laserObject) => {
                const laser = laserObject as EnemyLaser

                if (!laser.active || !this.player.active || this.waveComplete) {
                    return
                }

                laser.destroy()
                this.player.takeDamage(
                    laser.getDamage()
                )
            }
        )

        // =========================================
        // PLAYER LASER -> ALIEN
        // =========================================

        this.physics.add.overlap(
            this.playerLasers,
            this.alienGroup,
            (
                laserObject,
                alienObject
            ) => {

                if (
                    this.waveComplete
                ) {
                    return
                }

                const laser =
                    laserObject as PlayerLaser

                const alien =
                    alienObject as Alien

                if (
                    !laser.active ||
                    !alien.active
                ) {
                    return
                }

                // Get damage first
                const damage =
                    laser.getDamage()

                // Destroy laser
                laser.destroy()

                // Damage alien
                if (
                    alien.active
                ) {

                    this.damageAlien(alien, damage)
                }
            }
        )
    }

    // =====================================================
    // CHECK WAVE COMPLETE
    // =====================================================

    private checkWaveComplete() {

        if (
            !this.waveInProgress ||
            this.waveComplete
        ) {
            return
        }

        const livingAliens =
            this.aliens.filter(
                alien =>
                    alien.active
            )

        // =========================================
        // ENEMIES STILL ALIVE
        // =========================================

        if (
            livingAliens.length > 0
        ) {
            return
        }

        // =========================================
        // WAVE COMPLETE
        // =========================================

        this.waveComplete = true
        this.waveInProgress = false
        this.addScore(SCORE_VALUES.waveComplete)

        this.showWaveComplete()
    }

    // =====================================================
    // WAVE COMPLETE MESSAGE
    // =====================================================

    private showWaveComplete() {
        this.stopRoundShot()

        this.ui.showWaveComplete(
            this.currentWave,
            () => {
                // Pause the current game
                this.scene.pause()

                // Open ability selection
                this.scene.launch(
                    'SuperShotSelectScene',
                    {
                        wave:
                            this.currentWave
                    }
                )
            }
        )
    }

    // =====================================================
    // NEXT WAVE
    // =====================================================

    public startNextWave() {

        this.stopRoundShot()
        this.clearWaveObjects()
        this.player.resetBoosterEffects()

        const selectedSuperShot =
            this.registry.get('selectedSuperShot') as SuperShotType | undefined

        // =========================================
        // WAVE 10: BOSS FIGHT
        // =========================================

        if (
            !this.waveManager
                .hasNextWave()
        ) {

            this.scene.start('BossScene', {
                superShot: selectedSuperShot,
                score: this.score
            })

            return
        }

        if (selectedSuperShot) {
            this.player.setSuperShot(selectedSuperShot)
        }

        // =========================================
        // NEXT WAVE
        // =========================================

        this.waveManager.nextWave()

        this.currentWave =
            this.waveManager
                .getCurrentWave()

        // =========================================
        // CREATE
        // =========================================

        this.createWave()
    }

    private clearWaveObjects() {
        this.playerLasers.clear(true, true)
        this.enemyLasers.clear(true, true)
        this.superShots.clear(true, true)
        this.bombShots.clear(true, true)
        this.boosterGroup.clear(true, true)
        this.asteroidGroup.clear(true, true)
        this.blackHoleGroup.clear(true, true)
        this.alienGroup.clear(true, true)
        this.aliens = []
    }

    // =====================================================
    // UPDATE
    // =====================================================

    update(_time: number, delta: number) {

        // =========================================
        // PLAYER DEAD
        // =========================================

        if (
            !this.player.active
        ) {

            this.scene.start(
                'GameOverScene',
                {
                    wave: this.currentWave,
                    score: this.score
                }
            )

            return
        }

        // =========================================
        // PLAYER
        // =========================================

        this.player.update()

        this.boosterGroup.getChildren().forEach(boosterObject => {
            (boosterObject as Booster).update(this.player)
        })

        this.roundShot?.update(delta)

        if (
            this.roundShot &&
            !this.roundShot.isActive()
        ) {
            this.roundShot = undefined
        }

        // =========================================
        // EXPLOSION SHOT -> WORLD BOUNDS
        // =========================================

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

        // =========================================
        // ALIENS
        // =========================================

        this.aliens.forEach(
            alien => {

                if (
                    alien.active
                ) {

                    const shouldShoot = alien.update(this.player, this.time.now)

                    if (shouldShoot) {
                        this.createEnemyLaser(alien)
                    }
                }
            }
        )

        // =========================================
        // REMOVE DEAD ALIENS
        // =========================================

        this.aliens =
            this.aliens.filter(
                alien =>
                    alien.active
            )

        // =========================================
        // CHECK WAVE
        // =========================================

        this.checkWaveComplete()

        // =========================================
        // UI
        // =========================================

        this.updateHealthUI()
        this.ui.updateSuperShot(
            this.player.getSuperShotCooldownProgress(),
            Boolean(this.registry.get('selectedSuperShot'))
        )
    }

    public getPlayer(): Player {
        return this.player
    }

    private fireSuperShot(
        type: SuperShotType,
        directionX: number,
        directionY: number
    ) {
        if (type === 'laser') {
            const shot = new LaserBeam(
                this,
                this.player
            )

            this.superShots.add(shot)
            return
        }

        if (type === 'round') {
            this.startRoundShot()
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

    private startRoundShot() {
        this.stopRoundShot()

        this.roundShot = new RoundShot(
            this,
            this.player,
            this.playerLasers
        )
    }

    private stopRoundShot() {
        this.roundShot?.destroy()
        this.roundShot = undefined
    }

    private detonateExplosionShot(
        shot: ExplosionShot
    ) {
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
            (asteroid, damage) => {
                this.damageAsteroid(asteroid as Asteroid, damage)
            }
        )

        this.damageObjectsInBlast(
            this.alienGroup,
            explosionX,
            explosionY,
            (alien, damage) => {
                this.damageAlien(alien as Alien, damage)
            }
        )

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
        applyDamage: (
            target: Phaser.GameObjects.GameObject,
            damage: number
        ) => void
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
                applyDamage(target, ExplosionShot.blastDamage)
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

    private createEnemyLaser(alien: Alien) {
        const direction = new Phaser.Math.Vector2(
            this.player.x - alien.x,
            this.player.y - alien.y
        ).normalize()

        const laser = new EnemyLaser(
            this,
            alien.x + direction.x * 35,
            alien.y + direction.y * 35,
            Phaser.Math.Angle.Between(0, 0, direction.x, direction.y) + Math.PI / 2
        )

        this.enemyLasers.add(laser)
        laser.setVelocity(direction.x * 350, direction.y * 350)
    }
}
