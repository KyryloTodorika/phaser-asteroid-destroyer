import Phaser from 'phaser'
import type { Player } from './Player'
import { SUPER_SHOT_CONFIG } from '../config/gameplay/weapons'

export class LaserBeam extends Phaser.Physics.Arcade.Sprite {
    private readonly damage: number = SUPER_SHOT_CONFIG.laser.damage
    private readonly hitTargets = new Set<Phaser.GameObjects.GameObject>()
    private readonly player: Player
    private readonly direction = new Phaser.Math.Vector2(0, -1)
    private readonly beamOffset: number = SUPER_SHOT_CONFIG.laser.offsetFromPlayer
    private readonly activeTime: number = SUPER_SHOT_CONFIG.laser.activeTimeMs

    constructor(
        scene: Phaser.Scene,
        player: Player
    ) {
        super(scene, player.x, player.y, 'laser_beam')

        this.player = player

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setDisplaySize(
            SUPER_SHOT_CONFIG.laser.displayWidth,
            SUPER_SHOT_CONFIG.laser.displayHeight
        )
        this.setDepth(20)

        const body = this.body as Phaser.Physics.Arcade.Body

        body.setSize(
            SUPER_SHOT_CONFIG.laser.hitboxLength,
            SUPER_SHOT_CONFIG.laser.hitboxThickness
        )

        this.followPlayer()

        scene.time.delayedCall(this.activeTime, () => {
            if (this.active) {
                this.destroy()
            }
        })
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta)

        if (!this.player.active) {
            this.destroy()
            return
        }

        this.followPlayer()
    }

    private followPlayer() {
        this.direction.copy(this.player.getMovementDirection())

        this.setPosition(
            this.player.x + this.direction.x * this.beamOffset,
            this.player.y + this.direction.y * this.beamOffset
        )
        this.setRotation(this.direction.angle())

        const body = this.body as Phaser.Physics.Arcade.Body
        const cosine = Math.abs(this.direction.x)
        const sine = Math.abs(this.direction.y)

        body.setSize(
            SUPER_SHOT_CONFIG.laser.hitboxLength * cosine +
                SUPER_SHOT_CONFIG.laser.hitboxThickness * sine,
            SUPER_SHOT_CONFIG.laser.hitboxLength * sine +
                SUPER_SHOT_CONFIG.laser.hitboxThickness * cosine
        )
        body.updateFromGameObject()
    }

    hit(target: Phaser.GameObjects.GameObject): number {
        if (this.hitTargets.has(target)) {
            return 0
        }

        this.hitTargets.add(target)

        return this.damage
    }
}
