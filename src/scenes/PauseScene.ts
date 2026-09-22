import Phaser from 'phaser'
import {
    createActionButton,
    titleStyle,
    UI
} from '../ui/theme'

type PausableScene = 'GameScene' | 'BossScene'

export class PauseScene extends Phaser.Scene {
    private sourceScene: PausableScene = 'GameScene'

    constructor() {
        super('PauseScene')
    }

    init(data: { sourceScene?: PausableScene }) {
        this.sourceScene = data.sourceScene ?? 'GameScene'
    }

    create() {
        const { width, height } = this.scale

        this.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            0x020611,
            0.78
        ).setInteractive()

        this.add.rectangle(width / 2, height / 2, 520, 360, UI.panel, 0.96)
            .setStrokeStyle(2, UI.cyan, 0.55)

        this.add.text(width / 2, 238, 'GAME PAUSED', {
            ...titleStyle,
            fontSize: '52px',
            letterSpacing: 4
        }).setOrigin(0.5)

        createActionButton(
            this,
            width / 2,
            346,
            'RESUME',
            () => this.resumeGame(),
            300
        )

        createActionButton(
            this,
            width / 2,
            430,
            'RETURN TO MENU',
            () => this.returnToMenu(),
            300
        )

        this.add.text(width / 2, 508, 'PRESS ESC OR P TO RESUME', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '11px',
            color: '#7188a5',
            letterSpacing: 3
        }).setOrigin(0.5)

        this.input.keyboard?.once('keydown-ESC', () => this.resumeGame())
        this.input.keyboard?.once('keydown-P', () => this.resumeGame())
    }

    private resumeGame() {
        this.scene.resume(this.sourceScene)
        this.scene.stop()
    }

    private returnToMenu() {
        this.scene.stop(this.sourceScene)
        this.scene.start('MenuScene')
    }
}
