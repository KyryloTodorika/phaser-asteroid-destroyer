import Phaser from 'phaser'

export class EnemyLaser extends Phaser.Physics.Arcade.Sprite {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        rotation: number
    ) {
        super(scene, x, y, 'enemy_laser')

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setDisplaySize(8, 20)
        this.setRotation(rotation)

        scene.time.delayedCall(2500, () => {
            if (this.active) {
                this.destroy()
            }
        })
    }
}
