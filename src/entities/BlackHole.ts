import Phaser from 'phaser'

export class BlackHole extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'black_hole')

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setDisplaySize(180, 125)
        this.setImmovable(true)

        const body = this.body as Phaser.Physics.Arcade.Body
        body.setCircle(30, 60, 32)
    }
}
