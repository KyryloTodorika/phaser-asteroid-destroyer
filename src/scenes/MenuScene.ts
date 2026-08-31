import Phaser from 'phaser'

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene')
    }

    create() {
        const { width, height } = this.scale

        this.add
            .image(width / 2, height / 2, 'background')
            .setDisplaySize(width, height)

        this.add
            .text(width / 2, 180, 'ASTEROID DESTROYER', {
                fontFamily: 'Arial',
                fontSize: '56px',
                color: '#ffffff',
                fontStyle: 'bold'
            })
            .setOrigin(0.5)

        const startButton = this.add
            .text(width / 2, 400, 'START GAME', {
                fontFamily: 'Arial',
                fontSize: '32px',
                color: '#ffffff',
                backgroundColor: '#222222',
                padding: {
                    x: 30,
                    y: 15
                }
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })

        startButton.on('pointerover', () => {
            startButton.setStyle({
                color: '#ff00ff'
            })
        })

        startButton.on('pointerout', () => {
            startButton.setStyle({
                color: '#ffffff'
            })
        })

        startButton.on('pointerdown', () => {
            this.scene.start('GameScene')
        })
    }
}