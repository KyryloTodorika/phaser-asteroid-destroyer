import Phaser from 'phaser'

export class Boss extends Phaser.Physics.Arcade.Sprite {
    static readonly maxHealth: number = 1500
    static readonly shootCooldown: number = 1000

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
        this.setImmovable(true)
        this.setDepth(10)

        const body = this.body as Phaser.Physics.Arcade.Body
        body.setAllowGravity(false)
        body.setSize(1000, 1000)
    }

    update(player: Phaser.Physics.Arcade.Sprite, time: number): boolean {
        if (!this.active || !player.active) {
            return false
        }

        if (time - this.lastShotAt < Boss.shootCooldown) {
            return false
        }

        this.lastShotAt = time
        return true
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
