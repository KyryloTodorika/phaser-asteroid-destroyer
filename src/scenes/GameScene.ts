import Phaser from 'phaser'
import { Player } from '../entities/Player'
import { Asteroid } from '../entities/Asteroid'
import { Alien } from '../entities/Alien'

export class GameScene extends Phaser.Scene {
    private player!: Player

    private aliens: Alien[] = []

    private healthText!: Phaser.GameObjects.Text
    private waveText!: Phaser.GameObjects.Text

    private currentWave: number = 1

    constructor() {
        super('GameScene')
    }

    create() {
        this.add
            .image(640, 360, 'background')
            .setDisplaySize(1280, 720)

        this.createUI()

        this.player = new Player(
            this,
            640,
            360
        )

        this.createWave()

        this.updateHealthUI()
    }

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
        this.healthText.setText(
            `HEALTH: ${this.player.getHealth()}`
        )
    }

    private createWave() {
        if (this.currentWave === 1) {
            this.createWave1()
        }
    }

    private createWave1() {
        // -------------------------
        // Aliens
        // -------------------------

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

        // Player ↔ Aliens
        this.aliens.forEach((alien) => {
            this.physics.add.collider(
                this.player,
                alien,
                () => this.player.takeDamage(20)
            )
        })

        // -------------------------
        // Asteroid
        // -------------------------

        const asteroid = new Asteroid(
            this,
            300,
            200,
            'asteroid_1',
            80
        )

        // Player ↔ Asteroid
        this.physics.add.collider(
            this.player,
            asteroid,
            () => this.player.takeDamage(10)
        )
    }

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