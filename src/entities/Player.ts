import Phaser from 'phaser'
import { PlayerLaser } from './PlayerLaser'

export class Player extends Phaser.Physics.Arcade.Sprite {
    private health: number = 100

    // Movement
    private acceleration: number = 1000
    private maxSpeed: number = 400
    private drag: number = 700

    // Rotation
    private rotationSpeed: number = 0.06

    // Damage
    private canTakeDamage: boolean = true
    private damageCooldown: number = 500

    // Shooting
    private canShoot: boolean = true
    private shootCooldown: number = 200

    private laserGroup: Phaser.Physics.Arcade.Group

    private cursors: {
        up: Phaser.Input.Keyboard.Key
        down: Phaser.Input.Keyboard.Key
        left: Phaser.Input.Keyboard.Key
        right: Phaser.Input.Keyboard.Key
        shootKey: Phaser.Input.Keyboard.Key
    }

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        laserGroup: Phaser.Physics.Arcade.Group
    ) {
        super(scene, x, y, 'player')

        this.laserGroup = laserGroup

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setDisplaySize(96, 96)

        // ORIGINAL PLAYER HITBOX
        this.body?.setSize(48, 108)

        this.setCollideWorldBounds(true)

        this.setDrag(this.drag, this.drag)
        this.setMaxVelocity(this.maxSpeed)

        this.cursors = scene.input.keyboard!.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            shootKey: Phaser.Input.Keyboard.KeyCodes.SPACE
        }) as typeof this.cursors
    }

    update() {
        if (!this.active) {
            return
        }

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

        if (direction.length() > 0) {
            direction.normalize()

            this.setAcceleration(
                direction.x * this.acceleration,
                direction.y * this.acceleration
            )
        } else {
            this.setAcceleration(0, 0)
        }

        // Rotate towards actual movement direction
        const velocity = this.body?.velocity

        if (velocity && velocity.length() > 5) {
            const targetRotation =
                Phaser.Math.Angle.Between(
                    0,
                    0,
                    velocity.x,
                    velocity.y
                ) + Math.PI / 2

            this.rotation = Phaser.Math.Angle.RotateTo(
                this.rotation,
                targetRotation,
                this.rotationSpeed
            )
        }

        // Shoot
        if (Phaser.Input.Keyboard.JustDown(this.cursors.shootKey)) {
            this.shoot()
        }
    }

    private shoot() {
        if (!this.canShoot || !this.active) {
            return
        }

        const direction = new Phaser.Math.Vector2(
            Math.sin(this.rotation),
            -Math.cos(this.rotation)
        )

        const offset = 55

        const laserX = this.x + direction.x * offset
        const laserY = this.y + direction.y * offset

        const laser = new PlayerLaser(
            this.scene,
            laserX,
            laserY,
            this.rotation
        )

        // Add to physics group
        this.laserGroup.add(laser)

        // Set velocity AFTER adding to group
        laser.setVelocity(
            direction.x * 600,
            direction.y * 600
        )

        this.canShoot = false

        this.scene.time.delayedCall(
            this.shootCooldown,
            () => {
                this.canShoot = true
            }
        )
    }

    takeDamage(amount: number) {
        if (!this.active || !this.canTakeDamage) {
            return
        }

        this.health -= amount

        console.log(`Player Health: ${this.health}`)

        this.canTakeDamage = false

        this.scene.time.delayedCall(
            this.damageCooldown,
            () => {
                this.canTakeDamage = true
            }
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