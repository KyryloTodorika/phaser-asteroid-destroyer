import Phaser from 'phaser'
import { addEyebrow, addScreenTreatment, createActionButton, titleStyle, UI } from '../ui/theme'

export class GameOverScene extends Phaser.Scene {
    private reachedWave = 1

    constructor() {
        super('GameOverScene')
    }

    init(data: { wave?: number }) {
        this.reachedWave = data.wave ?? 1
    }

    create() {
        this.add.image(640, 360, 'background').setDisplaySize(1280, 720)
        addScreenTreatment(this, 0.74)

        this.add.rectangle(640, 352, 610, 474, UI.panel, 0.82)
            .setStrokeStyle(1, UI.danger, 0.35)

        addEyebrow(this, 150, 'MISSION REPORT')

        this.add.text(640, 220, 'SIGNAL LOST', {
            ...titleStyle, fontSize: '58px', stroke: '#3b1025', strokeThickness: 8, letterSpacing: 4
        }).setOrigin(0.5)

        this.add.text(640, 276, 'Your ship was lost to the void', {
            fontFamily: 'Arial, sans-serif', fontSize: '16px', color: '#8ea4bd'
        }).setOrigin(0.5)

        this.add.rectangle(640, 360, 360, 84, 0x071020, 0.9)
            .setStrokeStyle(1, 0x627595, 0.35)
        this.add.text(560, 344, 'WAVE REACHED', {
            fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#7188a5', letterSpacing: 2
        }).setOrigin(0.5)
        this.add.text(720, 359, String(this.reachedWave).padStart(2, '0'), {
            fontFamily: 'Trebuchet MS, Arial, sans-serif', fontSize: '42px', fontStyle: 'bold', color: '#f5fbff'
        }).setOrigin(0.5)

        const restart = () => this.scene.start('GameScene')
        createActionButton(this, 640, 470, 'RETRY MISSION', restart, 292)
        this.add.text(640, 524, 'PRESS ENTER', {
            fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#7188a5', letterSpacing: 3
        }).setOrigin(0.5)

        this.input.keyboard?.once('keydown-ENTER', restart)
    }
}
