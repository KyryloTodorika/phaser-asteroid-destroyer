import Phaser from 'phaser'

export class Alien extends Phaser.Physics.Arcade.Sprite {
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

        this.setDisplaySize(80, 80)

        this.setCollideWorldBounds(true)
    }

    update(player: Phaser.Physics.Arcade.Sprite) {
        const direction = new Phaser.Math.Vector2(
            player.x - this.x,
            player.y - this.y
        )

        direction.normalize()

        this.setVelocity(
            direction.x * this.speed,
            direction.y * this.speed
        )
    }
}