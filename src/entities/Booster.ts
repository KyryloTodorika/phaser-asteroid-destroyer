import Phaser from 'phaser'
import type { Player } from './Player'
import { BOOSTER_CONFIG } from '../config/gameplay/boosters'
import type { BoosterType } from '../config/gameplay/boosters'

export type { BoosterType } from '../config/gameplay/boosters'

export class Booster extends Phaser.Physics.Arcade.Sprite {
    private readonly boosterType: BoosterType

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        type: BoosterType
    ) {
        super(scene, x, y, BOOSTER_CONFIG.textures[type])

        this.boosterType = type

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setDisplaySize(52, 52)
        this.setDepth(15)

        const body = this.body as Phaser.Physics.Arcade.Body
        body.setAllowGravity(false)
        body.setCircle(this.width * 0.4)
    }

    update(player: Player) {
        if (!this.active || !player.active) {
            this.setVelocity(0, 0)
            return
        }

        const direction = new Phaser.Math.Vector2(
            player.x - this.x,
            player.y - this.y
        )

        if (direction.lengthSq() === 0) {
            this.setVelocity(0, 0)
            return
        }

        direction.normalize()
        this.setVelocity(
            direction.x * BOOSTER_CONFIG.followSpeed,
            direction.y * BOOSTER_CONFIG.followSpeed
        )
    }

    getType(): BoosterType {
        return this.boosterType
    }
}
