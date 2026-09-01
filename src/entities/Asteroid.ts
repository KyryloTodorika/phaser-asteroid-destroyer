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

        this.speed = speed

        // Add display object only
        scene.add.existing(this)

        // IMPORTANT:
        // Physics body is added by asteroidGroup.add()
        // in GameScene.
    }

    startMovement() {
        const body =
            this.body as Phaser.Physics.Arcade.Body

        if (!body) {
            console.error(
                'Asteroid has no physics body!'
            )
            return
        }

        // =========================================
        // HITBOX
        // =========================================

        body.setCircle(
            this.width * 0.4
        )

        // =========================================
        // RANDOM DIRECTION
        // =========================================

        const angle =
            Phaser.Math.FloatBetween(
                0,
                Math.PI * 2
            )

        body.setVelocity(
            Math.cos(angle) * this.speed,
            Math.sin(angle) * this.speed
        )

        // =========================================
        // BOUNCE
        // =========================================

        body.setBounce(
            1,
            1
        )

        body.setCollideWorldBounds(
            true
        )

        console.log(
            'ASTEROID VELOCITY:',
            body.velocity.x,
            body.velocity.y
        )
    }

    takeDamage(amount: number) {
        if (!this.active) {
            return
        }

        // Add your health system here
    }
}