import Phaser from 'phaser'

import { Boss } from '../entities/Boss'
import { ExplosionShot } from '../entities/ExplosionShot'
import { LaserBeam } from '../entities/LaserBeam'
import { Player } from '../entities/Player'
import { PlayerLaser } from '../entities/PlayerLaser'
import { RoundShot } from '../entities/RoundShot'
import type { SuperShotType } from '../entities/SuperShot'
import { BossHealthBar } from '../ui/BossHealthBar'
import { createActionButton, titleStyle } from '../ui/theme'

export class BossScene extends Phaser.Scene {
    private player!: Player
    private boss!: Boss
    private bossHealthBar!: BossHealthBar

    private playerLasers!: Phaser.Physics.Arcade.Group
    private laserBeams!: Phaser.Physics.Arcade.Group
    private bombShots!: Phaser.Physics.Arcade.Group

    private roundShot?: RoundShot
    private selectedSuperShot?: SuperShotType
    private fightComplete: boolean = false

    constructor() {
        super('BossScene')
    }

    init(data: { superShot?: SuperShotType }) {
        this.selectedSuperShot = data.superShot
    }

    create() {
        this.fightComplete = false
        this.roundShot = undefined

        this.add.image(640, 360, 'boss_background')
            .setDisplaySize(1280, 720)

        this.add.rectangle(640, 360, 1280, 720, 0x020611, 0.24)

        this.add.text(36, 28, 'WAVE 10  //  BOSS FIGHT', {
            fontFamily: 'Trebuchet MS, Arial, sans-serif',
            fontSize: '19px',
            fontStyle: 'bold',
            color: '#f5fbff',
            letterSpacing: 2
        }).setDepth(100)

        this.playerLasers = this.physics.add.group()
        this.laserBeams = this.physics.add.group()
        this.bombShots = this.physics.add.group()

        this.player = new Player(
            this,
            180,
            360,
            this.playerLasers
        )

        if (this.selectedSuperShot) {
            this.player.setSuperShot(this.selectedSuperShot)
        }

        this.player.on(
            'supershot',
            (
                type: SuperShotType,
                directionX: number,
                directionY: number
            ) => this.fireSuperShot(type, directionX, directionY)
        )

        this.boss = new Boss(this, 990, 360)
        this.bossHealthBar = new BossHealthBar(this, 1240, 100)
        this.bossHealthBar.update(Boss.maxHealth, Boss.maxHealth)

        this.createCollisions()
    }

    update(_time: number, delta: number) {
        if (this.fightComplete) {
            return
        }

        if (!this.player.active) {
            this.scene.start('GameOverScene', { wave: 10 })
            return
        }

        this.player.update()
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

        createActionButton(
            this,
            640,
            410,
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
