import Phaser from 'phaser'
import type { Player } from './Player'

export class LaserBeam extends Phaser.Physics.Arcade.Sprite {
    private readonly damage: number = 80
    private readonly hitTargets = new Set<Phaser.GameObjects.GameObject>()
    private readonly player: Player
    private readonly direction = new Phaser.Math.Vector2(0, -1)
    private readonly beamOffset: number = 340
    private readonly activeTime: number = 1000 // in ms (1000 = 1 second)

    constructor(
        scene: Phaser.Scene,
        player: Player
    ) {
        super(scene, player.x, player.y, 'laser_beam')

        this.player = player

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setDisplaySize(740, 175)
        this.setDepth(20)

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
}
