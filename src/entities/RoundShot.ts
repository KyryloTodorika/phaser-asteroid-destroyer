import Phaser from 'phaser'
import type { Player } from './Player'
import { PlayerLaser } from './PlayerLaser'

export class RoundShot {
    private static readonly duration: number = 10000
    private static readonly interval: number = 100
    private static readonly projectileCount: number = 8
    private static readonly rotationSpeed: number =
        Phaser.Math.DegToRad(600)

    private readonly scene: Phaser.Scene
    private readonly player: Player
    private readonly laserGroup: Phaser.Physics.Arcade.Group

    private volleyTimer?: Phaser.Time.TimerEvent
    private stopTimer?: Phaser.Time.TimerEvent
    private active: boolean = true

    constructor(
        scene: Phaser.Scene,
        player: Player,
        laserGroup: Phaser.Physics.Arcade.Group
    ) {
        this.scene = scene
        this.player = player
        this.laserGroup = laserGroup

        this.player.setRotationLocked(true)

        this.fireVolley()

        this.volleyTimer = scene.time.addEvent({
            delay: RoundShot.interval,
            repeat:
                Math.floor(
                    RoundShot.duration /
                    RoundShot.interval
                ) - 2,
            callback: this.fireVolley,
            callbackScope: this
        })

        this.stopTimer = scene.time.delayedCall(
            RoundShot.duration,
            () => this.destroy()
        )
    }

    update(delta: number) {
        if (!this.active) {
            return
        }

        if (!this.player.active) {
            this.destroy()
            return
        }

        this.player.rotation +=
            RoundShot.rotationSpeed *
            delta /
            1000
    }

    isActive(): boolean {
        return this.active
    }

    destroy() {
        if (!this.active) {
            return
        }

        this.active = false
        this.player.setRotationLocked(false)

        this.volleyTimer?.remove()
        this.stopTimer?.remove()

        this.volleyTimer = undefined
        this.stopTimer = undefined
    }

    private fireVolley() {
        if (!this.active || !this.player.active) {
            this.destroy()
            return
        }

        const angleStep =
            (Math.PI * 2) /
            RoundShot.projectileCount

        for (
            let index = 0;
            index < RoundShot.projectileCount;
            index++
        ) {
            const angle =
                this.player.rotation +
                index * angleStep

            const direction =
                new Phaser.Math.Vector2(
                    Math.cos(angle),
                    Math.sin(angle)
                )

            const shot = new PlayerLaser(
                this.scene,
                this.player.x + direction.x * 55,
                this.player.y + direction.y * 55,
                angle + Math.PI / 2
            )

            this.laserGroup.add(shot)
            shot.setVelocity(
                direction.x * PlayerLaser.speed,
                direction.y * PlayerLaser.speed
            )

            this.scene.time.delayedCall(2500, () => {
                if (shot.active) {
                    shot.destroy()
                }
            })
        }
    }
}
