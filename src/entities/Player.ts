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

        // Player hitbox
        this.body?.setSize(48, 108)

        this.setCollideWorldBounds(true)

        this.setDrag(
            this.drag,
            this.drag
        )

        this.setMaxVelocity(
            this.maxSpeed
        )

        // Movement keys
        this.cursors =
            scene.input.keyboard!.addKeys({
                up: Phaser.Input.Keyboard.KeyCodes.W,
                down: Phaser.Input.Keyboard.KeyCodes.S,
                left: Phaser.Input.Keyboard.KeyCodes.A,
                right: Phaser.Input.Keyboard.KeyCodes.D
            }) as typeof this.cursors

        // =========================================
        // MOUSE SHOOTING
        // =========================================

        scene.input.on(
            'pointerdown',
            (pointer: Phaser.Input.Pointer) => {
                if (
                    pointer.leftButtonDown() &&
                    this.active
                ) {
                    this.shoot(
                        pointer.worldX,
                        pointer.worldY
                    )
                }
            }
        )
    }

    update() {
        if (!this.active) {
            return
        }

        // =========================================
        // MOVEMENT
        // =========================================

        const direction =
            new Phaser.Math.Vector2(0, 0)

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

        // =========================================
        // ROTATION
        // =========================================

        const velocity = this.body?.velocity

        if (
            velocity &&
            velocity.length() > 5
        ) {
            const targetRotation =
                Phaser.Math.Angle.Between(
                    0,
                    0,
                    velocity.x,
                    velocity.y
                ) + Math.PI / 2

            this.rotation =
                Phaser.Math.Angle.RotateTo(
                    this.rotation,
                    targetRotation,
                    this.rotationSpeed
                )
        }
    }

    // =====================================================
    // SHOOT
    // =====================================================

    private shoot(
        targetX: number,
        targetY: number
    ) {
        if (
            !this.canShoot ||
            !this.active
        ) {
            return
        }

        // =========================================
        // DIRECTION TO MOUSE
        // =========================================

        const direction =
            new Phaser.Math.Vector2(
                targetX - this.x,
                targetY - this.y
            )

        if (direction.length() === 0) {
            return
        }

        direction.normalize()

        // =========================================
        // LASER START POSITION
        // =========================================

        const offset = 10

        const laserX =
            this.x + direction.x * offset

        const laserY =
            this.y + direction.y * offset

        // =========================================
        // LASER ROTATION
        // =========================================

        const laserRotation =
            Phaser.Math.Angle.Between(
                0,
                0,
                direction.x,
                direction.y
            ) + Math.PI / 2

        // =========================================
        // CREATE LASER
        // =========================================

        const laser = new PlayerLaser(
            this.scene,
            laserX,
            laserY,
            laserRotation
        )

        // Add to physics group
        this.laserGroup.add(laser)

        // =========================================
        // LASER VELOCITY
        // =========================================

        laser.setVelocity(
            direction.x * 600,
            direction.y * 600
        )

        // =========================================
        // SHOOT COOLDOWN
        // =========================================

        this.canShoot = false

        this.scene.time.delayedCall(
            this.shootCooldown,
            () => {
                this.canShoot = true
            }
        )
    }

    // =====================================================
    // DAMAGE
    // =====================================================

    takeDamage(amount: number) {
        if (
            !this.active ||
            !this.canTakeDamage
        ) {
            return
        }

        this.health -= amount

        console.log(
            `Player Health: ${this.health}`
        )

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