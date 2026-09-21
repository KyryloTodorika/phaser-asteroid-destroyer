import Phaser from 'phaser'
import { BLACK_HOLE_CONFIG } from '../config/gameplay/obstacles'

export class BlackHole extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'black_hole')

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setDisplaySize(
            BLACK_HOLE_CONFIG.displayWidth,
            BLACK_HOLE_CONFIG.displayHeight
        )
        this.setImmovable(true)

        const body = this.body as Phaser.Physics.Arcade.Body
        body.setCircle(
            BLACK_HOLE_CONFIG.hitboxRadius,
            BLACK_HOLE_CONFIG.hitboxOffsetX,
            BLACK_HOLE_CONFIG.hitboxOffsetY
        )
    }
}
