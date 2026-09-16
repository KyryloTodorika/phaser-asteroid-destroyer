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

        this.load.image('alien_fast', IMAGE_ASSETS.enemies.fast)
        this.load.image('alien_fat', IMAGE_ASSETS.enemies.fat)
        this.load.image('alien_shooter', IMAGE_ASSETS.enemies.shooter)
        this.load.image('boss_spaceship', IMAGE_ASSETS.enemies.boss)

        this.load.image(
            'player_laser',
            IMAGE_ASSETS.projectiles.playerLaser
        )

        this.load.image(
            'enemy_laser',
            IMAGE_ASSETS.projectiles.enemyLaser
        )

        this.load.image(
            'explosion_shot',
            'assets/images/projectiles/supershots/explosion_shot.png'
        )

        this.load.image(
            'laser_beam',
            'assets/images/projectiles/supershots/laser_beam.png'
        )

        IMAGE_ASSETS.asteroids.forEach((path, index) => {
            this.load.image(`asteroid_${index + 1}`, path)
        })

        this.load.image('black_hole', IMAGE_ASSETS.blackholes.blackHole)
    }

    create() {
        this.scene.start('MenuScene')
    }
}
