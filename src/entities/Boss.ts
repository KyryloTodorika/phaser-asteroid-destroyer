import Phaser from 'phaser'
import { BOSS_CONFIG } from '../config/gameplay/enemies'

export class Boss extends Phaser.Physics.Arcade.Sprite {
    static readonly maxHealth: number = BOSS_CONFIG.maxHealth

    private health: number = Boss.maxHealth
    private lastShotAt: number = 0

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number
    ) {
        super(scene, x, y, 'boss_spaceship')

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setDisplaySize(340, 340)
        this.setRotation(-Math.PI / 2)
        this.setImmovable(true)
        this.setCollideWorldBounds(true)
        this.setBounce(1)
        this.setVelocityY(BOSS_CONFIG.movementSpeed)
        this.setDepth(10)

        const body = this.body as Phaser.Physics.Arcade.Body
        body.setAllowGravity(false)
        body.setSize(1000, 1000)
    }

    update(player: Phaser.Physics.Arcade.Sprite, time: number): boolean {
        if (!this.active || !player.active) {
            return false
        }

        if (time - this.lastShotAt < BOSS_CONFIG.shootCooldownMs) {
            return false
        }

        this.lastShotAt = time
        return true
    }

    startArenaMovement() {
        const direction = new Phaser.Math.Vector2(1, 1)
            .normalize()
            .scale(BOSS_CONFIG.finalMovementSpeed)

        this.setVelocity(direction.x, direction.y)
    }

    takeDamage(amount: number) {
        if (!this.active) {
            return
        }

        this.health = Math.max(0, this.health - amount)

        if (this.health === 0) {
            this.destroy()
        }
    }

    getHealth(): number {
        return this.health
    }
}
