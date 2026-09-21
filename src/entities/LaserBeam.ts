import Phaser from 'phaser'
import type { Player } from './Player'
import {
    LASER_BEAM_ANIMATION,
    SUPER_SHOT_CONFIG
} from '../config/gameplay/weapons'
import { LASER_BEAM_SFX_CONFIG } from '../config/gameplay/audio'

export class LaserBeam extends Phaser.Physics.Arcade.Sprite {
    private readonly damage: number = SUPER_SHOT_CONFIG.laser.damage
    private readonly hitTargets = new Set<Phaser.GameObjects.GameObject>()
    private readonly player: Player
    private readonly direction = new Phaser.Math.Vector2(0, -1)
    private readonly beamOffset: number = SUPER_SHOT_CONFIG.laser.offsetFromPlayer
    private readonly activeTime: number = SUPER_SHOT_CONFIG.laser.activeTimeMs
    private beamSound?: Phaser.Sound.BaseSound

    constructor(
        scene: Phaser.Scene,
        player: Player
    ) {
        super(scene, player.x, player.y, 'laser_beam')

        this.player = player

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setDisplaySize(740, 175)
        this.setDepth(player.depth - 1)
        this.play(LASER_BEAM_ANIMATION)

        this.beamSound = scene.sound.add(LASER_BEAM_SFX_CONFIG.key, {
            volume: LASER_BEAM_SFX_CONFIG.volume
        })
        this.beamSound.play()

        const body = this.body as Phaser.Physics.Arcade.Body

        body.setSize(940, 87)

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
        this.direction.set(
            Math.sin(this.player.rotation),
            -Math.cos(this.player.rotation)
        )

        this.setPosition(
            this.player.x + this.direction.x * this.beamOffset,
            this.player.y + this.direction.y * this.beamOffset
        )
        this.setRotation(this.direction.angle())

        const body = this.body as Phaser.Physics.Arcade.Body
        const cosine = Math.abs(this.direction.x)
        const sine = Math.abs(this.direction.y)

        body.setSize(
            940 * cosine + 87 * sine,
            940 * sine + 87 * cosine
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

    destroy(fromScene?: boolean) {
        this.beamSound?.stop()
        this.beamSound?.destroy()
        this.beamSound = undefined

        super.destroy(fromScene)
    }
}
