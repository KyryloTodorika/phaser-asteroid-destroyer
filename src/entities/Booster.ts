import Phaser from 'phaser'
import type { Player } from './Player'

export type BoosterType =
    | 'heal'
    | 'shield'
    | 'attackSpeed'
    | 'superShot'

export const BOOSTER_TYPES: BoosterType[] = [
    'heal',
    'shield',
    'attackSpeed',
    'superShot'
]

const BOOSTER_TEXTURES: Record<BoosterType, string> = {
    heal: 'booster_heal',
    shield: 'booster_shield',
    attackSpeed: 'booster_attack_speed',
    superShot: 'booster_super_shot'
}

export class Booster extends Phaser.Physics.Arcade.Sprite {
    static readonly followSpeed: number = 180

    private readonly boosterType: BoosterType

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        type: BoosterType
    ) {
        super(scene, x, y, BOOSTER_TEXTURES[type])

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
            direction.x * Booster.followSpeed,
            direction.y * Booster.followSpeed
        )
    }

    getType(): BoosterType {
        return this.boosterType
    }
}
