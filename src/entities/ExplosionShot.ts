import Phaser from 'phaser'
import { PlayerLaser } from './PlayerLaser'

export class ExplosionShot extends Phaser.Physics.Arcade.Sprite {
    static readonly speed: number = PlayerLaser.speed
    static readonly blastRadius: number = 180
    static readonly blastDamage: number = 70

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

        this.setDisplaySize(120, 43)
        this.setRotation(direction.angle())
        this.setDepth(20)

        const body = this.body as Phaser.Physics.Arcade.Body

        body.setSize(360, 110)

        scene.time.delayedCall(2500, () => {
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
