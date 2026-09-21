import Phaser from 'phaser'
import { ASTEROID_CONFIG } from '../config/gameplay/obstacles'

export class Asteroid extends Phaser.Physics.Arcade.Sprite {
    private speed: number
    private health: number

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        speed: number = ASTEROID_CONFIG.speed,
        health: number = ASTEROID_CONFIG.health
    ) {
        super(scene, x, y, texture)

        this.speed = speed
        this.health = health

        // =========================================
        // ADD TO SCENE
        // =========================================

        scene.add.existing(this)

        // Physics body is created when added
        // to asteroidGroup in GameScene.
    }

    startMovement(direction?: Phaser.Math.Vector2) {

        const body =
            this.body as Phaser.Physics.Arcade.Body

        if (!body) {
            console.error(
                'Asteroid has no physics body!'
            )

            return
        }

        // =========================================
        // CIRCULAR HITBOX
        // =========================================

        body.setCircle(
            this.width * 0.4
        )

        // =========================================
        // RANDOM DIRECTION
        // =========================================

        const angle = direction
            ? direction.angle()
            : Phaser.Math.FloatBetween(0, Math.PI * 2)

        body.setVelocity(
            Math.cos(angle) * this.speed,
            Math.sin(angle) * this.speed
        )

        // =========================================
        // BOUNCE FROM WORLD
        // =========================================

        body.setBounce(
            1,
            1
        )

        body.setCollideWorldBounds(
            true
        )

        // =========================================
        // ROTATION
        // =========================================

        body.setAngularVelocity(
            Phaser.Math.Between(
                ASTEROID_CONFIG.minAngularVelocity,
                ASTEROID_CONFIG.maxAngularVelocity
            )
        )
    }

    // =========================================
    // DAMAGE
    // =========================================

    takeDamage(
        amount: number
    ): boolean {

        if (!this.active) {
            return false
        }

        this.health -= amount

        console.log(
            `Asteroid Health: ${this.health}`
        )

        if (this.health <= 0) {

            this.health = 0

            this.destroy()
            return true
        }

        return false
    }

    // =========================================
    // HEALTH
    // =========================================

    getHealth(): number {
        return this.health
    }
}
