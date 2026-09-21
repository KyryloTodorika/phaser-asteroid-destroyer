import Phaser from 'phaser'
import { SUPER_SHOT_CONFIG } from '../config/gameplay/weapons'

export class ExplosionShot extends Phaser.Physics.Arcade.Sprite {
    static readonly speed: number = SUPER_SHOT_CONFIG.explosion.speed
    static readonly blastRadius: number = SUPER_SHOT_CONFIG.explosion.blastRadius
    static readonly blastDamage: number = SUPER_SHOT_CONFIG.explosion.damage

    private detonated: boolean = false

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        direction: Phaser.Math.Vector2
    ) {
        super(scene, x, y, 'explosion_shot')

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setDisplaySize(
            SUPER_SHOT_CONFIG.explosion.displayWidth,
            SUPER_SHOT_CONFIG.explosion.displayHeight
        )
        this.setRotation(direction.angle())
        this.setDepth(20)

        const body = this.body as Phaser.Physics.Arcade.Body

        body.setSize(
            SUPER_SHOT_CONFIG.explosion.hitboxWidth,
            SUPER_SHOT_CONFIG.explosion.hitboxHeight
        )

        scene.time.delayedCall(SUPER_SHOT_CONFIG.explosion.lifetimeMs, () => {
            if (this.active) {
                this.destroy()
            }
        })
    }

    launch(direction: Phaser.Math.Vector2) {
        this.setCollideWorldBounds(true)
        this.setVelocity(
            direction.x * ExplosionShot.speed,
            direction.y * ExplosionShot.speed
        )
    }

    detonate(): boolean {
        if (!this.active || this.detonated) {
            return false
        }

        this.detonated = true
        this.destroy()

        return true
    }
}
