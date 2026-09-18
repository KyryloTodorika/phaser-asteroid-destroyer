import Phaser from 'phaser'

export type AlienType = 'standard' | 'fast' | 'fat' | 'shooter'

const ALIEN_STATS: Record<AlienType, { speed: number; health: number }> = {
    standard: { speed: 70, health: 30 },
    fast: { speed: 150, health: 20 },
    fat: { speed: 45, health: 100 },
    shooter: { speed: 80, health: 20 }
}

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
        this.speed = ALIEN_STATS[type].speed
        this.health = ALIEN_STATS[type].health

        this.setDisplaySize(type === 'fat' ? 110 : 80, type === 'fat' ? 80 : 80)

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
            const movement = distance < 280 ? -1 : distance > 420 ? 1 : 0

            this.setVelocity(
                direction.x * this.speed * movement,
                direction.y * this.speed * movement
            )

            if (time - this.lastShotAt >= 1400) {
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
