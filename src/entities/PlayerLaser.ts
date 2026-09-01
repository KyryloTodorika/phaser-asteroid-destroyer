import Phaser from 'phaser'

export class PlayerLaser extends Phaser.Physics.Arcade.Sprite {
    private readonly damage: number = 10

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        rotation: number
    ) {
        super(scene, x, y, 'player_laser')

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setDisplaySize(8, 20)
        this.setRotation(rotation)

        const body = this.body as Phaser.Physics.Arcade.Body

        body.enable = true
    }

    getDamage(): number {
        return this.damage
    }
}