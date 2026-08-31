import Phaser from 'phaser'

import { Player } from '../entities/Player'
import { PlayerLaser } from '../entities/PlayerLaser'
import { Asteroid } from '../entities/Asteroid'
import { Alien } from '../entities/Alien'

export class GameScene extends Phaser.Scene {
    private player!: Player

    private aliens: Alien[] = []

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
        // PLAYER LASERS
        // =========================================

        this.playerLasers = this.physics.add.group()

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
        // ONE ASTEROID
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
                this.player.takeDamage(10)
            }
        )

        // =========================================
        // THREE ALIENS
        // =========================================

        const alien1 = new Alien(
            this,
            150,
            150,
            'alien_standard',
            70
        )

        const alien2 = new Alien(
            this,
            1100,
            150,
            'alien_standard',
            70
        )

        const alien3 = new Alien(
            this,
            1100,
            550,
            'alien_standard',
            70
        )

        this.aliens.push(
            alien1,
            alien2,
            alien3
        )

        // =========================================
        // COLLISIONS
        // =========================================

        this.aliens.forEach((alien) => {

            // Alien -> Player
            this.physics.add.collider(
                this.player,
                alien,
                () => {
                    this.player.takeDamage(20)
                }
            )

            // Asteroid -> Alien
            this.physics.add.collider(
                asteroid,
                alien,
                () => {
                    alien.takeDamage(10)
                }
            )
        })

        // =========================================
        // PLAYER LASER -> ALIEN
        // =========================================

        this.physics.add.overlap(
            this.playerLasers,
            this.aliens,
            (
                laserObject,
                alienObject
            ) => {
                const laser = laserObject as PlayerLaser
                const alien = alienObject as Alien

                if (!laser.active || !alien.active) {
                    return
                }

                alien.takeDamage(
                    laser.getDamage()
                )

                laser.destroy()
            }
        )
    }

    // =====================================================
    // UPDATE
    // =====================================================

    update() {
        if (!this.player.active) {
            return
        }

        this.player.update()

        this.aliens.forEach((alien) => {
            if (alien.active) {
                alien.update(this.player)
            }
        })

        this.updateHealthUI()
    }
}