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
        // RESET STATE
        // =========================================

        this.aliens = []
        this.currentWave = 1

        // =========================================
        // BACKGROUND
        // =========================================

        this.add
            .image(640, 360, 'background')
            .setDisplaySize(1280, 720)

        // =========================================
        // PHYSICS GROUPS
        // =========================================

        this.playerLasers = this.physics.add.group({
            runChildUpdate: true
        })

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

        // =========================================
        // INITIAL UI
        // =========================================

        this.updateHealthUI()
    }

    // =====================================================
    // UI
    // =====================================================

    private createUI() {
        // Health
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

        // Wave
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
        if (
            !this.player ||
            !this.player.active
        ) {
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
        switch (this.currentWave) {
            case 1:
                this.createWave1()
                break
        }
    }

    // =====================================================
    // WAVE 1
    // =====================================================

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

        // =========================================
        // ASTEROID -> PLAYER
        // =========================================

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

        this.createAlien(
            150,
            150
        )

        this.createAlien(
            1100,
            150
        )

        this.createAlien(
            1100,
            550
        )

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

                const alien =
                    alienObject as Alien

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

                const laser =
                    laserObject as PlayerLaser

                const alien =
                    alienObject as Alien

                // Make sure both still exist
                if (
                    !laser.active ||
                    !alien.active
                ) {
                    return
                }

                // Get damage first
                const damage =
                    laser.getDamage()

                // Destroy laser
                laser.destroy()

                // Damage alien
                if (alien.active) {
                    alien.takeDamage(damage)
                }
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

        // Add to array
        this.aliens.push(alien)

        // Add to physics group
        this.alienGroup.add(alien)
    }

    // =====================================================
    // UPDATE
    // =====================================================

    update() {

        // =========================================
        // PLAYER DEAD
        // =========================================

        if (!this.player.active) {

            this.scene.start(
                'GameOverScene',
                {
                    wave: this.currentWave
                }
            )

            return
        }

        // =========================================
        // PLAYER
        // =========================================

        this.player.update()

        // =========================================
        // ALIENS
        // =========================================

        this.aliens.forEach(
            (alien) => {

                if (alien.active) {
                    alien.update(
                        this.player
                    )
                }
            }
        )

        // =========================================
        // CLEAN DESTROYED ALIENS
        // =========================================

        this.aliens =
            this.aliens.filter(
                (alien) =>
                    alien.active
            )

        // =========================================
        // UI
        // =========================================

        this.updateHealthUI()
    }
}