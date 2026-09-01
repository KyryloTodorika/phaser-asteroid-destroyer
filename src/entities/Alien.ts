import Phaser from 'phaser'

export class Alien extends Phaser.Physics.Arcade.Sprite {
    private speed: number
    private health: number = 30

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        speed: number = 70
    ) {
        super(scene, x, y, texture)

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setDisplaySize(80, 80)

        this.speed = speed

        this.setCollideWorldBounds(true)
    }

    update(player: Phaser.Physics.Arcade.Sprite) {
        if (!this.active || !player.active) {
            return
        }

        const direction = new Phaser.Math.Vector2(
            player.x - this.x,
            player.y - this.y
        )

        if (direction.length() > 0) {
            direction.normalize()
        }

        this.setVelocity(
            direction.x * this.speed,
            direction.y * this.speed
        )
    }

    takeDamage(amount: number) {
        if (!this.active) {
            return
        }

        this.health -= amount

        console.log(
            `Alien hit! Health: ${this.health}`
        )

        if (this.health <= 0) {
            this.health = 0
            this.destroy()
        }
    }

    getHealth(): number {
        return this.health
    }
}