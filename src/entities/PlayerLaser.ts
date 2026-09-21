import Phaser from 'phaser'
import { PLAYER_PROJECTILE_CONFIG } from '../config/gameplay/weapons'

export class PlayerLaser extends Phaser.Physics.Arcade.Sprite {
    static readonly speed: number = PLAYER_PROJECTILE_CONFIG.speed

    private readonly damage: number = PLAYER_PROJECTILE_CONFIG.damage

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        rotation: number
    ) {
        super(scene, x, y, 'player_laser')

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setDisplaySize(8, 20)
        this.setRotation(rotation)

        const body = this.body as Phaser.Physics.Arcade.Body

        body.enable = true
    }

    getDamage(): number {
        return this.damage
    }
}
