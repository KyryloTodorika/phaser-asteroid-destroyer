import Phaser from 'phaser'

import { Player } from '../entities/Player'
import { PlayerLaser } from '../entities/PlayerLaser'
import { Asteroid } from '../entities/Asteroid'
import { Alien } from '../entities/Alien'

export class GameScene extends Phaser.Scene {
    private player!: Player

    private aliens: Alien[] = []
    private alienGroup!: Phaser.Physics.Arcade.Group

    private playerLasers!: Phaser.Physics.Arcade.Group

    private healthText!: Phaser.GameObjects.Text
    private waveText!: Phaser.GameObjects.Text

    private currentWave: number = 1

    constructor() {
        super('GameScene')
    }

    create() {
        // =========================================
        // BACKGROUND
        // =========================================

        this.add
            .image(640, 360, 'background')
            .setDisplaySize(1280, 720)

        // =========================================
        // PHYSICS GROUPS
        // =========================================

        this.playerLasers = this.physics.add.group()
        this.alienGroup = this.physics.add.group()

        // =========================================
        // UI
        // =========================================

        this.createUI()

        // =========================================
        // PLAYER
        // =========================================

        this.player = new Player(
            this,
            640,
            360,
            this.playerLasers
        )

        // =========================================
        // WAVE
        // =========================================

        this.createWave()

        this.updateHealthUI()
    }

    // =====================================================
    // UI
    // =====================================================

    private createUI() {
        this.healthText = this.add.text(
            30,
            25,
            'HEALTH: 100',
            {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#ffffff'
            }
        )

        this.waveText = this.add.text(
            640,
            25,
            `WAVE: ${this.currentWave}`,
            {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#ffffff'
            }
        ).setOrigin(0.5, 0)
    }

    private updateHealthUI() {
        if (!this.player || !this.player.active) {
            return
        }

        this.healthText.setText(
            `HEALTH: ${this.player.getHealth()}`
        )
    }

    // =====================================================
    // WAVES
    // =====================================================

    private createWave() {
        if (this.currentWave === 1) {
            this.createWave1()
        }
    }

    private createWave1() {
        // =========================================
        // ASTEROID
        // =========================================

        const asteroid = new Asteroid(
            this,
            300,
            200,
            'asteroid_1',
            100
        )

        this.physics.add.collider(
            this.player,
            asteroid,
            () => {
                if (this.player.active) {
                    this.player.takeDamage(10)
                }
            }
        )

        // =========================================
        // ALIENS
        // =========================================

        this.createAlien(150, 150)
        this.createAlien(1100, 150)
        this.createAlien(1100, 550)

        // =========================================
        // PLAYER -> ALIENS
        // =========================================

        this.physics.add.collider(
            this.player,
            this.alienGroup,
            () => {
                if (this.player.active) {
                    this.player.takeDamage(20)
                }
            }
        )

        // =========================================
        // ASTEROID -> ALIENS
        // =========================================

        this.physics.add.collider(
            asteroid,
            this.alienGroup,
            (
                asteroidObject,
                alienObject
            ) => {
                const alien = alienObject as Alien

                if (alien.active) {
                    alien.takeDamage(10)
                }
            }
        )

        // =========================================
        // PLAYER LASER -> ALIEN
        // =========================================

        this.physics.add.overlap(
            this.playerLasers,
            this.alienGroup,
            (
                laserObject,
                alienObject
            ) => {
                const laser = laserObject as PlayerLaser
                const alien = alienObject as Alien

                if (!laser.active || !alien.active) {
                    return
                }

                // Get damage before destroying anything
                const damage = laser.getDamage()

                // Destroy laser
                laser.destroy()

                // Damage alien
                alien.takeDamage(damage)
            }
        )
    }

    // =====================================================
    // CREATE ALIEN
    // =====================================================

    private createAlien(
        x: number,
        y: number
    ) {
        const alien = new Alien(
            this,
            x,
            y,
            'alien_standard',
            70
        )

        this.aliens.push(alien)

        // Add the actual Alien object to the physics group
        this.alienGroup.add(alien)
    }

    // =====================================================
    // UPDATE
    // =====================================================

    update() {
        if (!this.player.active) {
            return
        }

        // Player
        this.player.update()

        // Aliens
        this.aliens.forEach((alien) => {
            if (alien.active) {
                alien.update(this.player)
            }
        })

        // Remove destroyed aliens from array
        this.aliens = this.aliens.filter(
            (alien) => alien.active
        )

        // UI
        this.updateHealthUI()
    }
}