import Phaser from 'phaser'
import { IMAGE_ASSETS } from '../config/assets'

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene')
    }

    preload() {
        this.load.image('background', IMAGE_ASSETS.background)
        this.load.image('player', IMAGE_ASSETS.player)

        this.load.image(
            'alien_standard',
            IMAGE_ASSETS.enemies.standard
        )

        this.load.image(
            'player_laser',
            IMAGE_ASSETS.projectiles.playerLaser
        )

        this.load.image(
            'enemy_laser',
            IMAGE_ASSETS.projectiles.enemyLaser
        )

        IMAGE_ASSETS.asteroids.forEach((path, index) => {
            this.load.image(`asteroid_${index + 1}`, path)
        })
    }

    create() {
        this.scene.start('MenuScene')
    }
}