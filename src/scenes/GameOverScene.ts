import Phaser from 'phaser'

export class GameOverScene extends Phaser.Scene {
    private reachedWave: number = 1

    constructor() {
        super('GameOverScene')
    }

    init(data: { wave?: number }) {
        this.reachedWave = data.wave ?? 1
    }

    create() {
        // =========================================
        // BACKGROUND
        // =========================================

        this.add
            .image(640, 360, 'background')
            .setDisplaySize(1280, 720)

        // Dark overlay
        this.add.rectangle(
            640,
            360,
            1280,
            720,
            0x000000,
            0.75
        )

        // =========================================
        // GAME OVER
        // =========================================

        this.add.text(
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
        // WAVE
        // =========================================

        this.add.text(
            640,
            330,
            `WAVE REACHED: ${this.reachedWave}`,
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

        // Hover
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

        // Restart
        restartButton.on(
            'pointerdown',
            () => {
                this.scene.start('GameScene')
            }
        )
    }
}