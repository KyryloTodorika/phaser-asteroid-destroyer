import Phaser from 'phaser'

export const UI = {
    ink: 0x050817,
    panel: 0x0b1228,
    cyan: 0x54e7ff,
    violet: 0xa76cff,
    white: '#f5fbff',
    muted: '#8ea4bd',
    danger: 0xff557f
} as const

export const titleStyle: Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: 'Trebuchet MS, Arial, sans-serif',
    fontStyle: 'bold',
    color: UI.white,
    stroke: '#14264a',
    strokeThickness: 8
}

export function addScreenTreatment(
    scene: Phaser.Scene,
    overlayAlpha = 0.32
) {
    const { width, height } = scene.scale

    scene.add.rectangle(
        width / 2,
        height / 2,
        width,
        height,
        UI.ink,
        overlayAlpha
    )

    const graphics = scene.add.graphics()
    graphics.fillStyle(0x000000, 0.42)
    graphics.fillRect(0, 0, width, 38)
    graphics.fillRect(0, height - 38, width, 38)
    graphics.lineStyle(1, UI.cyan, 0.18)
    graphics.lineBetween(0, 38, width, 38)
    graphics.lineBetween(0, height - 38, width, height - 38)

    for (let i = 0; i < 42; i++) {
        const x = Phaser.Math.Between(20, width - 20)
        const y = Phaser.Math.Between(48, height - 48)
        const radius = Phaser.Math.FloatBetween(0.5, 1.6)
        const star = scene.add.circle(x, y, radius, 0xbbeeff, 0.25)
        scene.tweens.add({
            targets: star,
            alpha: { from: 0.12, to: 0.68 },
            duration: Phaser.Math.Between(900, 2200),
            yoyo: true,
            repeat: -1,
            delay: Phaser.Math.Between(0, 1200)
        })
    }
}

export function createActionButton(
    scene: Phaser.Scene,
    x: number,
    y: number,
    label: string,
    onPress: () => void,
    width = 260
) {
    const glow = scene.add.rectangle(x, y + 6, width, 62, UI.cyan, 0.12)
        .setStrokeStyle(1, UI.cyan, 0.2)
    const plate = scene.add.rectangle(x, y, width, 62, UI.panel, 0.96)
        .setStrokeStyle(2, UI.cyan, 0.75)
    const text = scene.add.text(x, y, label, {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '21px',
        fontStyle: 'bold',
        color: UI.white,
        letterSpacing: 2
    }).setOrigin(0.5)

    plate.setInteractive({ useHandCursor: true })
    plate.on('pointerover', () => {
        plate.setFillStyle(0x132650, 1)
        plate.setStrokeStyle(3, UI.cyan, 1)
        text.setColor('#54e7ff')
        scene.tweens.add({ targets: [plate, text], scaleX: 1.035, scaleY: 1.035, duration: 110 })
    })
    plate.on('pointerout', () => {
        plate.setFillStyle(UI.panel, 0.96)
        plate.setStrokeStyle(2, UI.cyan, 0.75)
        text.setColor(UI.white)
        scene.tweens.add({ targets: [plate, text], scaleX: 1, scaleY: 1, duration: 110 })
    })
    plate.on('pointerdown', onPress)

    return { plate, text, glow }
}

export function addEyebrow(scene: Phaser.Scene, y: number, label: string) {
    const { width } = scene.scale
    scene.add.rectangle(width / 2, y, 152, 2, UI.cyan, 0.5)
    return scene.add.text(width / 2, y - 17, label, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '13px',
        fontStyle: 'bold',
        color: '#54e7ff',
        letterSpacing: 4
    }).setOrigin(0.5)
}
