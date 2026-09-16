import Phaser from 'phaser'
import { addEyebrow, addScreenTreatment, createActionButton, titleStyle, UI } from '../ui/theme'

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene')
    }

    create() {
        const { width, height } = this.scale

        this.add
            .image(width / 2, height / 2, 'background')
            .setDisplaySize(width, height)

        addScreenTreatment(this, 0.42)

        this.add.rectangle(width / 2, 356, 720, 452, UI.panel, 0.58)
            .setStrokeStyle(1, UI.cyan, 0.22)

        addEyebrow(this, 140, 'DEEP SPACE DEFENSE')

        const title = this.add
            .text(width / 2, 218, 'ASTEROID\nDESTROYER', {
                ...titleStyle,
                fontSize: '64px',
                align: 'center',
                lineSpacing: -10,
                letterSpacing: 4
            })
            .setOrigin(0.5)

        this.tweens.add({
            targets: title,
            alpha: { from: 0.82, to: 1 },
            duration: 1500,
            yoyo: true,
            repeat: -1
        })

        this.add.text(width / 2, 330, 'Survive the swarm. Master the void.', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            color: '#a9bad0',
            letterSpacing: 1
        }).setOrigin(0.5)

        const start = () => this.scene.start('GameScene')
        createActionButton(this, width / 2, 418, 'LAUNCH MISSION', start, 300)

        this.add.text(width / 2, 474, 'PRESS ENTER', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            color: '#7289a5',
            letterSpacing: 3
        }).setOrigin(0.5)

        const controls = [
            ['W A S D', 'MOVE'],
            ['MOUSE', 'AIM & FIRE'],
            ['E', 'SUPER SHOT']
        ]

        controls.forEach(([key, action], index) => {
            const x = width / 2 - 220 + index * 220
            this.add.text(x, 566, key, {
                fontFamily: 'Trebuchet MS, Arial, sans-serif',
                fontSize: '15px',
                fontStyle: 'bold',
                color: '#54e7ff'
            }).setOrigin(0.5)
            this.add.text(x, 592, action, {
                fontFamily: 'Arial, sans-serif',
                fontSize: '11px',
                color: '#8ea4bd',
                letterSpacing: 2
            }).setOrigin(0.5)
        })

        this.input.keyboard?.once('keydown-ENTER', start)
    }
}
