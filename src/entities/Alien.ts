import Phaser from 'phaser'
import { ALIEN_CONFIG } from '../config/gameplay/enemies'
import type { AlienType } from '../config/gameplay/enemies'

export type { AlienType } from '../config/gameplay/enemies'

export class Alien extends Phaser.Physics.Arcade.Sprite {
    private speed: number
    private health: number
    private readonly alienType: AlienType
    private lastShotAt: number = 0

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        type: AlienType
    ) {
        super(scene, x, y, `alien_${type}`)

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.alienType = type
        const config = ALIEN_CONFIG[type]
        this.speed = config.speed
        this.health = config.health

        this.setDisplaySize(config.displayWidth, config.displayHeight)

        this.setCollideWorldBounds(true)
    }

    update(player: Phaser.Physics.Arcade.Sprite, time: number): boolean {
        if (!this.active || !player.active) {
            return false
        }

        const direction = new Phaser.Math.Vector2(
            player.x - this.x,
            player.y - this.y
        )

        const distance = direction.length()

        if (distance > 0) {
            direction.normalize()
        }

        if (this.alienType === 'shooter') {
            const config = ALIEN_CONFIG.shooter
            const movement = distance < config.preferredDistanceMin
                ? -1
                : distance > config.preferredDistanceMax ? 1 : 0

            this.setVelocity(
                direction.x * this.speed * movement,
                direction.y * this.speed * movement
            )

            if (time - this.lastShotAt >= config.shootCooldownMs) {
                this.lastShotAt = time
                return true
            }

            return false
        }

        this.setVelocity(
            direction.x * this.speed,
            direction.y * this.speed
        )

        return false
    }

    takeDamage(amount: number): boolean {
        if (!this.active) {
            return false
        }

        this.health -= amount

        console.log(
            `Alien hit! Health: ${this.health}`
        )

        if (this.health <= 0) {
            this.health = 0
            this.destroy()
            return true
        }

        return false
    }

    getHealth(): number {
        return this.health
    }

    getType(): AlienType {
        return this.alienType
    }
}
