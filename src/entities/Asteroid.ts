import Phaser from 'phaser'

export class Asteroid extends Phaser.Physics.Arcade.Sprite {
    private speed: number

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        speed: number = 100
    ) {
        super(scene, x, y, texture)

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.speed = speed

        this.setVelocity(
            Phaser.Math.Between(-1, 1) * this.speed,
            Phaser.Math.Between(-1, 1) * this.speed
        )

        this.setBounce(1, 1)
        this.setCollideWorldBounds(true)

        this.setCircle(this.width * 0.4)
    }
}