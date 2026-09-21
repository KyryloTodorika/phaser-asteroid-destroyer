import Phaser from 'phaser'
import { ENEMY_PROJECTILE_CONFIG } from '../config/gameplay/enemies'

export class EnemyLaser extends Phaser.Physics.Arcade.Sprite {
    private readonly damage: number

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        rotation: number,
        damage: number
    ) {
        super(scene, x, y, 'enemy_laser')

        this.damage = damage

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setDisplaySize(8, 20)
        this.setRotation(rotation)

        scene.time.delayedCall(ENEMY_PROJECTILE_CONFIG.lifetimeMs, () => {
            if (this.active) {
                this.destroy()
            }
        })
    }

    getDamage(): number {
        return this.damage
    }
}
