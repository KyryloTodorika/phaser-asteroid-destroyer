import Phaser from 'phaser'
import { PlayerLaser } from './PlayerLaser'
import type { SuperShotType } from './SuperShot'

export class Player extends Phaser.Physics.Arcade.Sprite {
    private health: number = 100

    // =========================================
    // MOVEMENT
    // =========================================

    private acceleration: number = 1000
    private maxSpeed: number = 400
    private drag: number = 700

    // =========================================
    // ROTATION
    // =========================================

    private rotationSpeed: number = 0.06

    // =========================================
    // DAMAGE
    // =========================================

    private canTakeDamage: boolean = true
    private damageCooldown: number = 500

    // =========================================
    // NORMAL SHOOTING
    // =========================================

    private canShoot: boolean = true
    private shootCooldown: number = 200

    // =========================================
    // SUPERSHOT
    // =========================================

    private superShot: SuperShotType | null = null

    private canUseSuperShot: boolean = true

    private superShotCooldown: number = 5000

    private superShotCooldownStartedAt: number = 0

    private superShotCooldownTimer?:
        Phaser.Time.TimerEvent

    // =========================================
    // PHYSICS GROUP
    // =========================================

    private laserGroup:
        Phaser.Physics.Arcade.Group

    // =========================================
    // INPUT
    // =========================================

    private cursors: {
        up: Phaser.Input.Keyboard.Key
        down: Phaser.Input.Keyboard.Key
        left: Phaser.Input.Keyboard.Key
        right: Phaser.Input.Keyboard.Key
        superShotKey: Phaser.Input.Keyboard.Key
    }

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        laserGroup: Phaser.Physics.Arcade.Group
    ) {
        super(
            scene,
            x,
            y,
            'player'
        )

        this.laserGroup =
            laserGroup

        scene.add.existing(this)

        scene.physics.add.existing(this)

        // =========================================
        // PLAYER SIZE
        // =========================================

        this.setDisplaySize(
            96,
            96
        )

        // Player hitbox
        this.body?.setSize(
            48,
            108
        )

        // =========================================
        // PHYSICS
        // =========================================

        this.setCollideWorldBounds(
            true
        )

        this.setDrag(
            this.drag,
            this.drag
        )

        this.setMaxVelocity(
            this.maxSpeed
        )

        // =========================================
        // KEYBOARD
        // =========================================

        this.cursors =
            scene.input.keyboard!.addKeys({
                up:
                    Phaser.Input.Keyboard.KeyCodes.W,

                down:
                    Phaser.Input.Keyboard.KeyCodes.S,

                left:
                    Phaser.Input.Keyboard.KeyCodes.A,

                right:
                    Phaser.Input.Keyboard.KeyCodes.D,

                superShotKey:
                    Phaser.Input.Keyboard.KeyCodes.E

            }) as typeof this.cursors

        // =========================================
        // MOUSE SHOOTING
        // =========================================

        scene.input.on(
            'pointerdown',
            (
                pointer:
                    Phaser.Input.Pointer
            ) => {

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
            new Phaser.Math.Vector2(
                0,
                0
            )

        if (
            this.cursors.left.isDown
        ) {
            direction.x = -1
        }

        if (
            this.cursors.right.isDown
        ) {
            direction.x = 1
        }

        if (
            this.cursors.up.isDown
        ) {
            direction.y = -1
        }

        if (
            this.cursors.down.isDown
        ) {
            direction.y = 1
        }

        if (
            direction.length() > 0
        ) {
            direction.normalize()

            this.setAcceleration(
                direction.x *
                    this.acceleration,

                direction.y *
                    this.acceleration
            )
        } else {
            this.setAcceleration(
                0,
                0
            )
        }

        // =========================================
        // ROTATION
        // =========================================

        const velocity =
            this.body?.velocity

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
                ) +
                Math.PI / 2

            this.rotation =
                Phaser.Math.Angle.RotateTo(
                    this.rotation,
                    targetRotation,
                    this.rotationSpeed
                )
        }

        // =========================================
        // SUPERSHOT INPUT
        // =========================================

        if (
            Phaser.Input.Keyboard.JustDown(
                this.cursors.superShotKey
            )
        ) {
            this.useSuperShot()
        }
    }

    // =====================================================
    // NORMAL SHOOT
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

        if (
            direction.length() === 0
        ) {
            return
        }

        direction.normalize()

        // =========================================
        // LASER START POSITION
        // =========================================

        const offset = 10

        const laserX =
            this.x +
            direction.x *
                offset

        const laserY =
            this.y +
            direction.y *
                offset

        // =========================================
        // LASER ROTATION
        // =========================================

        const laserRotation =
            Phaser.Math.Angle.Between(
                0,
                0,
                direction.x,
                direction.y
            ) +
            Math.PI / 2

        // =========================================
        // CREATE LASER
        // =========================================

        const laser =
            new PlayerLaser(
                this.scene,
                laserX,
                laserY,
                laserRotation
            )

        // =========================================
        // ADD TO GROUP
        // =========================================

        this.laserGroup.add(
            laser
        )

        // =========================================
        // VELOCITY
        // =========================================

        laser.setVelocity(
            direction.x * 600,
            direction.y * 600
        )

        // =========================================
        // COOLDOWN
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
    // SUPERSHOT
    // =====================================================

    private useSuperShot() {
        if (
            !this.active ||
            !this.superShot ||
            !this.canUseSuperShot
        ) {
            return
        }

        console.log(
            'Using supershot:',
            this.superShot
        )

        // =========================================
        // START COOLDOWN
        // =========================================

        this.canUseSuperShot =
            false

        this.superShotCooldownStartedAt =
            this.scene.time.now

        this.superShotCooldownTimer =
            this.scene.time.delayedCall(
                this.superShotCooldown,
                () => {

                    this.canUseSuperShot =
                        true

                    this.superShotCooldownStartedAt =
                        0
                }
            )

        // =========================================
        // TEMPORARY ABILITY EVENT
        // =========================================

        this.emit(
            'supershot',
            this.superShot,
            this.x,
            this.y,
            this.rotation
        )
    }

    // =====================================================
    // SET SUPERSHOT
    // =====================================================

    setSuperShot(
        ability: SuperShotType
    ) {
        this.superShot =
            ability

        this.canUseSuperShot =
            true

        this.superShotCooldownStartedAt =
            0

        if (
            this.superShotCooldownTimer
        ) {
            this.superShotCooldownTimer.remove()

            this.superShotCooldownTimer =
                undefined
        }

        console.log(
            'Player supershot:',
            ability
        )
    }

    // =====================================================
    // GET SUPERSHOT
    // =====================================================

    getSuperShot():
        SuperShotType | null {
        return this.superShot
    }

    // =====================================================
    // CHECK READY
    // =====================================================

    isSuperShotReady(): boolean {
        return this.canUseSuperShot
    }

    // =====================================================
    // COOLDOWN PROGRESS
    //
    // 0 = just fired
    // 1 = ready
    // =====================================================

    getSuperShotCooldownProgress():
        number {

        if (
            this.canUseSuperShot
        ) {
            return 1
        }

        const elapsed =
            this.scene.time.now -
            this.superShotCooldownStartedAt

        return Phaser.Math.Clamp(
            elapsed /
                this.superShotCooldown,
            0,
            1
        )
    }

    // =====================================================
    // DAMAGE
    // =====================================================

    takeDamage(
        amount: number
    ) {
        if (
            !this.active ||
            !this.canTakeDamage
        ) {
            return
        }

        this.health -=
            amount

        console.log(
            `Player Health: ${this.health}`
        )

        this.canTakeDamage =
            false

        this.scene.time.delayedCall(
            this.damageCooldown,
            () => {
                this.canTakeDamage =
                    true
            }
        )

        if (
            this.health <= 0
        ) {
            this.health = 0

            this.destroy()
        }
    }

    // =====================================================
    // HEALTH
    // =====================================================

    getHealth(): number {
        return this.health
    }
}