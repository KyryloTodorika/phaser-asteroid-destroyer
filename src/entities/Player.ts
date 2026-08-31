import Phaser from 'phaser'

export class Player extends Phaser.Physics.Arcade.Sprite {
    private speed: number = 300
    private health: number = 100

    private cursors: {
        up: Phaser.Input.Keyboard.Key
        down: Phaser.Input.Keyboard.Key
        left: Phaser.Input.Keyboard.Key
        right: Phaser.Input.Keyboard.Key
    }

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number
    ) {
        super(scene, x, y, 'player')

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setDisplaySize(96, 96)
        this.body?.setSize(48, 108)
        this.setCollideWorldBounds(true)

        this.cursors = scene.input.keyboard!.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        }) as typeof this.cursors
    }

    update() {
        const direction = new Phaser.Math.Vector2(0, 0)

        if (this.cursors.left.isDown) {
            direction.x = -1
        }

        if (this.cursors.right.isDown) {
            direction.x = 1
        }

        if (this.cursors.up.isDown) {
            direction.y = -1
        }

        if (this.cursors.down.isDown) {
            direction.y = 1
        }

        direction.normalize()

        this.setVelocity(
            direction.x * this.speed,
            direction.y * this.speed
        )
    }

    takeDamage(amount: number) {
        this.health -= amount

        console.log(`Player Health: ${this.health}`)

        if (this.health <= 0) {
            this.health = 0
            this.destroy()
        }
    }

    getHealth(): number {
        return this.health
    }
}