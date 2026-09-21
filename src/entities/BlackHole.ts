import Phaser from 'phaser'
import { BLACK_HOLE_ANIMATION } from '../config/gameplay/obstacles'

export class BlackHole extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'black_hole_animation')

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setDisplaySize(180, 125)
        this.setImmovable(true)
        this.play(BLACK_HOLE_ANIMATION)

        const body = this.body as Phaser.Physics.Arcade.Body
        body.setCircle(240, 121, 9)
    }
}
