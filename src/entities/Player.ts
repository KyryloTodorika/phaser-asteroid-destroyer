import Phaser from 'phaser'
import { PlayerLaser } from './PlayerLaser'
import type { SuperShotType } from './SuperShot'
import { BOOSTER_CONFIG } from '../config/gameplay/boosters'
import {
    PLAYER_COAST_ANIMATION,
    PLAYER_CONFIG,
    PLAYER_THRUST_ANIMATION
} from '../config/gameplay/player'

export class Player extends Phaser.Physics.Arcade.Sprite {
    private health: number = PLAYER_CONFIG.maxHealth

    // =========================================
    // MOVEMENT
    // =========================================

    private acceleration: number = PLAYER_CONFIG.movement.acceleration
    private maxSpeed: number = PLAYER_CONFIG.movement.maxSpeed
    private drag: number = PLAYER_CONFIG.movement.drag

    // =========================================
    // ROTATION
    // =========================================

    private rotationSpeed: number = PLAYER_CONFIG.movement.rotationSpeed
    private rotationLocked: boolean = false

    // =========================================
    // DAMAGE
    // =========================================

    private canTakeDamage: boolean = true
    private damageCooldown: number = PLAYER_CONFIG.damageInvulnerabilityMs

    // =========================================
    // NORMAL SHOOTING
    // =========================================

    private canShoot: boolean = true
    private shootCooldown: number = PLAYER_CONFIG.shooting.cooldownMs
    private attackSpeedBoosted: boolean = false

    // =========================================
    // SUPERSHOT
    // =========================================

    private superShot: SuperShotType | null = null

    private canUseSuperShot: boolean = true

    private superShotCooldown: number = PLAYER_CONFIG.superShotCooldownMs

    private superShotCooldownStartedAt: number = 0

    private superShotCooldownTimer?:
        Phaser.Time.TimerEvent

    private superShotChargeActive: boolean = false
    private superShotChargeTimer?: Phaser.Time.TimerEvent

    private shieldActive: boolean = false
    private shieldTimer?: Phaser.Time.TimerEvent

    private movementDirection = new Phaser.Math.Vector2(0, -1)

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
        this.setDepth(20)

        // Player hitbox
        this.body?.setSize(
            this.width * (48 / 256),
            this.height * (108 / 256)
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

            this.play(PLAYER_THRUST_ANIMATION, true)

            this.movementDirection.copy(direction)

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

            const speed = this.body?.velocity.length() ?? 0

            if (speed > PLAYER_CONFIG.movement.rotationVelocityThreshold) {
                this.play(PLAYER_COAST_ANIMATION, true)
            } else {
                this.anims.stop()
                this.setFrame(0)
            }
        }

        // =========================================
        // ROTATION
        // =========================================

        const velocity =
            this.body?.velocity

        if (
            !this.rotationLocked &&
            velocity &&
            velocity.length() > PLAYER_CONFIG.movement.rotationVelocityThreshold
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

        const offset = PLAYER_CONFIG.shooting.projectileSpawnOffset

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
            direction.x * PlayerLaser.speed,
            direction.y * PlayerLaser.speed
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
            (!this.canUseSuperShot && !this.superShotChargeActive)
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

        if (!this.superShotChargeActive) {
            this.startSuperShotCooldown()
        }

        // =========================================
        // TEMPORARY ABILITY EVENT
        // =========================================

        const pointer = this.scene.input.activePointer
        const aimDirection = new Phaser.Math.Vector2(
            pointer.worldX - this.x,
            pointer.worldY - this.y
        )

        if (aimDirection.lengthSq() === 0) {
            aimDirection.copy(this.movementDirection)
        } else {
            aimDirection.normalize()
        }

        this.emit(
            'supershot',
            this.superShot,
            aimDirection.x,
            aimDirection.y
        )
    }

    setRotationLocked(locked: boolean) {
        this.rotationLocked = locked
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
        return this.canUseSuperShot || this.superShotChargeActive
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
            this.canUseSuperShot ||
            this.superShotChargeActive
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
            this.shieldActive ||
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

    heal(amount: number) {
        if (!this.active) {
            return
        }

        this.health = Math.min(
            PLAYER_CONFIG.maxHealth,
            this.health + amount
        )
    }

    activateAttackSpeedBoost() {
        if (this.attackSpeedBoosted) {
            return
        }

        this.attackSpeedBoosted = true
        this.shootCooldown = Math.round(
            PLAYER_CONFIG.shooting.cooldownMs /
                BOOSTER_CONFIG.effects.attackSpeedMultiplier
        )
    }

    activateShield(duration: number = BOOSTER_CONFIG.effects.shieldDurationMs) {
        this.shieldActive = true
        this.setTint(0x54e7ff)
        this.shieldTimer?.remove()

        this.shieldTimer = this.scene.time.delayedCall(
            duration,
            () => {
                this.shieldActive = false
                this.clearTint()
                this.shieldTimer = undefined
            }
        )
    }

    activateSuperShotCharge(
        duration: number = BOOSTER_CONFIG.effects.superShotChargeDurationMs
    ) {
        this.superShotCooldownTimer?.remove()
        this.superShotCooldownTimer = undefined
        this.superShotCooldownStartedAt = 0
        this.canUseSuperShot = true
        this.superShotChargeActive = true
        this.superShotChargeTimer?.remove()

        this.superShotChargeTimer = this.scene.time.delayedCall(
            duration,
            () => {
                this.superShotChargeActive = false
                this.superShotChargeTimer = undefined
                this.startSuperShotCooldown()
            }
        )
    }

    resetBoosterEffects() {
        this.attackSpeedBoosted = false
        this.shootCooldown = PLAYER_CONFIG.shooting.cooldownMs
        this.canShoot = true

        this.shieldTimer?.remove()
        this.shieldTimer = undefined
        this.shieldActive = false
        this.clearTint()

        this.superShotChargeTimer?.remove()
        this.superShotChargeTimer = undefined
        this.superShotChargeActive = false

        this.superShotCooldownTimer?.remove()
        this.superShotCooldownTimer = undefined
        this.superShotCooldownStartedAt = 0
        this.canUseSuperShot = true
    }

    private startSuperShotCooldown() {
        this.canUseSuperShot = false
        this.superShotCooldownStartedAt = this.scene.time.now
        this.superShotCooldownTimer?.remove()

        this.superShotCooldownTimer = this.scene.time.delayedCall(
            this.superShotCooldown,
            () => {
                this.canUseSuperShot = true
                this.superShotCooldownStartedAt = 0
                this.superShotCooldownTimer = undefined
            }
        )
    }
}
