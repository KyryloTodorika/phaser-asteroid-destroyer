import Phaser from 'phaser'
import { IMAGE_ASSETS } from '../config/assets'
import {
    PLAYER_COAST_ANIMATION,
    PLAYER_CONFIG,
    PLAYER_THRUST_ANIMATION
} from '../config/gameplay/player'
import {
    LASER_BEAM_ANIMATION,
    SUPER_SHOT_CONFIG
} from '../config/gameplay/weapons'

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene')
    }

    preload() {
        this.load.image('background', IMAGE_ASSETS.background)
        this.load.image('boss_background', IMAGE_ASSETS.bossBackground)
        this.load.spritesheet('player', IMAGE_ASSETS.player, {
            frameWidth: 720,
            frameHeight: 720
        })

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

        this.load.image('booster_heal', IMAGE_ASSETS.boosters.heal)
        this.load.image('booster_shield', IMAGE_ASSETS.boosters.shield)
        this.load.image('booster_attack_speed', IMAGE_ASSETS.boosters.attackSpeed)
        this.load.image('booster_super_shot', IMAGE_ASSETS.boosters.superShotCharger)

        this.load.image(
            'explosion_shot',
            'assets/images/projectiles/supershots/explosion_shot.png'
        )

        this.load.spritesheet(
            'laser_beam',
            IMAGE_ASSETS.projectiles.laserBeamAnimation,
            {
                frameWidth: 1480,
                frameHeight: 350
            }
        )

        IMAGE_ASSETS.asteroids.forEach((path, index) => {
            this.load.image(`asteroid_${index + 1}`, path)
        })

        this.load.image('black_hole', IMAGE_ASSETS.blackholes.blackHole)
        this.load.image(
            'asteroid_destruction',
            IMAGE_ASSETS.destructionEffects.asteroid
        )
        this.load.image(
            'alien_destruction',
            IMAGE_ASSETS.destructionEffects.alien
        )
        this.load.image(
            'boss_destruction',
            IMAGE_ASSETS.destructionEffects.boss
        )
    }

    create() {
        this.anims.create({
            key: PLAYER_THRUST_ANIMATION,
            frames: this.anims.generateFrameNumbers('player', {
                start: 2,
                end: 3
            }),
            frameRate: PLAYER_CONFIG.animationFrameRate,
            repeat: -1
        })

        this.anims.create({
            key: PLAYER_COAST_ANIMATION,
            frames: this.anims.generateFrameNumbers('player', {
                frames: [0, 1, 4, 5]
            }),
            frameRate: PLAYER_CONFIG.animationFrameRate,
            repeat: -1
        })

        this.anims.create({
            key: LASER_BEAM_ANIMATION,
            frames: this.anims.generateFrameNumbers('laser_beam', {
                start: 0,
                end: 3
            }),
            frameRate: SUPER_SHOT_CONFIG.laser.animationFrameRate,
            repeat: -1
        })

        this.scene.start('MenuScene')
    }
}
