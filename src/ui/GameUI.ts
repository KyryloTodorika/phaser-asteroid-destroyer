import Phaser from 'phaser'

export class GameUI {
    private healthText!: Phaser.GameObjects.Text
    private waveText!: Phaser.GameObjects.Text
    private readonly scene: Phaser.Scene

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    create(wave: number) {
        this.healthText =
            this.scene.add.text(
                30,
                25,
                'HEALTH: 100',
                {
                    fontFamily: 'Arial',
                    fontSize: '24px',
                    color: '#ffffff'
                }
            )

        this.waveText =
            this.scene.add.text(
                640,
                25,
                `WAVE: ${wave}`,
                {
                    fontFamily: 'Arial',
                    fontSize: '24px',
                    color: '#ffffff'
                }
            )
            .setOrigin(0.5, 0)
    }

    updateHealth(health: number) {
        this.healthText.setText(
            `HEALTH: ${health}`
        )
    }

    updateWave(wave: number) {
        this.waveText.setText(
            `WAVE: ${wave}`
        )
    }

    showWaveComplete(
        wave: number,
        onComplete: () => void
    ) {
        const text =
            this.scene.add.text(
                640,
                300,
                `WAVE ${wave} COMPLETE`,
                {
                    fontFamily: 'Arial',
                    fontSize: '48px',
                    color: '#ffffff',
                    fontStyle: 'bold'
                }
            )
            .setOrigin(0.5)
            .setDepth(1000)

        this.scene.time.delayedCall(
            1500,
            () => {
                if (text.active) {
                    text.destroy()
                }

                onComplete()
            }
        )
    }
}
