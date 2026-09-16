import Phaser from 'phaser'

export class BossHealthBar {
    private readonly height: number = 500
    private readonly fill: Phaser.GameObjects.Rectangle
    private readonly valueText: Phaser.GameObjects.Text

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number
    ) {
        scene.add.text(x, y - 34, 'BOSS', {
            fontFamily: 'Trebuchet MS, Arial, sans-serif',
            fontSize: '15px',
            fontStyle: 'bold',
            color: '#ff557f',
            letterSpacing: 2
        }).setOrigin(0.5)
         .setDepth(100)

        scene.add.rectangle(
            x,
            y + this.height / 2,
            34,
            this.height + 10,
            0x071020,
            0.94
        )
        .setStrokeStyle(2, 0xff557f, 0.85)
        .setDepth(100)

        this.fill = scene.add.rectangle(
            x,
            y + this.height,
            22,
            this.height,
            0xff315f,
            1
        )
        .setOrigin(0.5, 1)
        .setDepth(101)

        this.valueText = scene.add.text(x, y + this.height + 24, '100%', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            fontStyle: 'bold',
            color: '#f5fbff'
        })
        .setOrigin(0.5)
        .setDepth(100)
    }

    update(health: number, maxHealth: number) {
        const ratio = Phaser.Math.Clamp(
            health / maxHealth,
            0,
            1
        )

        this.fill.displayHeight = this.height * ratio
        this.fill.setFillStyle(
            ratio > 0.5
                ? 0xff315f
                : ratio > 0.25
                    ? 0xff9f43
                    : 0xffd43b
        )

        this.valueText.setText(
            `${Math.ceil(ratio * 100)}%`
        )
    }
}
