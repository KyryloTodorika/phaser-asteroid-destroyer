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

    private gameOverContainer!: Phaser.GameObjects.Container
    private gameOver: boolean = false

    constructor() {
        super('GameScene')
    }

    create() {
        // =========================================
        // RESET STATE
        // =========================================

        this.gameOver = false
        this.aliens = []

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

        // =========================================
        // INITIAL UI UPDATE
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
                if (
                    !this.gameOver &&
                    this.player.active
                ) {
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
        // ALIEN -> PLAYER
        // =========================================

        this.physics.add.collider(
            this.player,
            this.alienGroup,
            () => {
                if (
                    !this.gameOver &&
                    this.player.active
                ) {
                    this.player.takeDamage(20)
                }
            }
        )

        // =========================================
        // ASTEROID -> ALIEN
        // =========================================

        this.physics.add.collider(
            asteroid,
            this.alienGroup,
            (
                asteroidObject,
                alienObject
            ) => {
                if (this.gameOver) {
                    return
                }

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
                if (this.gameOver) {
                    return
                }

                const laser =
                    laserObject as PlayerLaser

                const alien =
                    alienObject as Alien

                if (
                    !laser.active ||
                    !alien.active
                ) {
                    return
                }

                // Store damage before destroying laser
                const damage = laser.getDamage()

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

        this.aliens.push(alien)

        this.alienGroup.add(alien)
    }

    // =====================================================
    // GAME OVER
    // =====================================================

    private showGameOver() {
        if (this.gameOver) {
            return
        }

        this.gameOver = true

        // =========================================
        // STOP PLAYER
        // =========================================

        if (this.player.active) {
            this.player.setVelocity(0, 0)
            this.player.setAcceleration(0, 0)
        }

        // =========================================
        // STOP ALIENS
        // =========================================

        this.aliens.forEach((alien) => {
            if (alien.active) {
                alien.setVelocity(0, 0)
            }
        })

        // =========================================
        // STOP LASERS
        // =========================================

        this.playerLasers.getChildren().forEach(
            (child) => {
                const laser =
                    child as PlayerLaser

                if (laser.active) {
                    laser.setVelocity(0, 0)
                }
            }
        )

        // =========================================
        // OVERLAY
        // =========================================

        const overlay = this.add.rectangle(
            640,
            360,
            1280,
            720,
            0x000000,
            0.75
        )

        // =========================================
        // TITLE
        // =========================================

        const title = this.add.text(
            640,
            250,
            'GAME OVER',
            {
                fontFamily: 'Arial',
                fontSize: '64px',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5)

        // =========================================
        // WAVE REACHED
        // =========================================

        const wave = this.add.text(
            640,
            330,
            `WAVE REACHED: ${this.currentWave}`,
            {
                fontFamily: 'Arial',
                fontSize: '26px',
                color: '#ffffff'
            }
        ).setOrigin(0.5)

        // =========================================
        // RESTART BUTTON
        // =========================================

        const restartButton = this.add.text(
            640,
            430,
            'RESTART',
            {
                fontFamily: 'Arial',
                fontSize: '30px',
                color: '#ffffff',
                backgroundColor: '#222222',
                padding: {
                    left: 30,
                    right: 30,
                    top: 15,
                    bottom: 15
                }
            }
        )
            .setOrigin(0.5)
            .setInteractive({
                useHandCursor: true
            })

        // =========================================
        // BUTTON HOVER
        // =========================================

        restartButton.on(
            'pointerover',
            () => {
                restartButton.setStyle({
                    color: '#ffff00'
                })
            }
        )

        restartButton.on(
            'pointerout',
            () => {
                restartButton.setStyle({
                    color: '#ffffff'
                })
            }
        )

        // =========================================
        // RESTART GAME
        // =========================================

        restartButton.on(
            'pointerdown',
            () => {
                this.scene.restart()
            }
        )

        // =========================================
        // CONTAINER
        // =========================================

        this.gameOverContainer =
            this.add.container(
                0,
                0,
                [
                    overlay,
                    title,
                    wave,
                    restartButton
                ]
            )

        this.gameOverContainer.setDepth(1000)
    }

    // =====================================================
    // UPDATE
    // =====================================================

    update() {
        // =========================================
        // GAME OVER
        // =========================================

        if (this.gameOver) {
            return
        }

        // =========================================
        // PLAYER DEAD
        // =========================================

        if (!this.player.active) {
            this.showGameOver()
            return
        }

        // =========================================
        // PLAYER
        // =========================================

        this.player.update()

        // =========================================
        // ALIENS
        // =========================================

        this.aliens.forEach((alien) => {
            if (alien.active) {
                alien.update(this.player)
            }
        })

        // =========================================
        // CLEAN DESTROYED ALIENS
        // =========================================

        this.aliens =
            this.aliens.filter(
                (alien) => alien.active
            )

        // =========================================
        // UI
        // =========================================

        this.updateHealthUI()
    }
}