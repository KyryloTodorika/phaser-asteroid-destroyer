import Phaser from 'phaser'
import { titleStyle, UI } from './theme'

export class GameUI {
    private healthText!: Phaser.GameObjects.Text
    private waveText!: Phaser.GameObjects.Text
    private healthFill!: Phaser.GameObjects.Rectangle
    private superFill!: Phaser.GameObjects.Rectangle
    private superText!: Phaser.GameObjects.Text
    private readonly scene: Phaser.Scene

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    create(wave: number) {
        const panel = this.scene.add.graphics().setDepth(900)
        panel.fillStyle(UI.ink, 0.82)
        panel.fillRoundedRect(22, 18, 300, 74, 10)
        panel.fillRoundedRect(490, 18, 300, 58, 10)
        panel.fillRoundedRect(958, 18, 300, 74, 10)
        panel.lineStyle(1, UI.cyan, 0.32)
        panel.strokeRoundedRect(22, 18, 300, 74, 10)
        panel.strokeRoundedRect(490, 18, 300, 58, 10)
        panel.strokeRoundedRect(958, 18, 300, 74, 10)

        this.scene.add.text(42, 32, 'HULL INTEGRITY', {
            fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#8ea4bd', letterSpacing: 2
        }).setDepth(901)
        this.healthText = this.scene.add.text(288, 29, '100%', {
            fontFamily: 'Trebuchet MS, Arial, sans-serif', fontSize: '16px', fontStyle: 'bold', color: UI.white
        }).setOrigin(1, 0).setDepth(901)
        this.scene.add.rectangle(42, 64, 246, 8, 0x24314b, 1).setOrigin(0, 0.5).setDepth(901)
        this.healthFill = this.scene.add.rectangle(42, 64, 246, 8, UI.cyan, 1)
            .setOrigin(0, 0.5).setDepth(902)

        this.waveText = this.scene.add.text(640, 30, `WAVE ${String(wave).padStart(2, '0')}`, {
            fontFamily: 'Trebuchet MS, Arial, sans-serif', fontSize: '20px', fontStyle: 'bold', color: UI.white,
            letterSpacing: 4
        }).setOrigin(0.5, 0).setDepth(901)

        this.scene.add.text(978, 32, 'SUPER SHOT', {
            fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#8ea4bd', letterSpacing: 2
        }).setDepth(901)
        this.superText = this.scene.add.text(1230, 29, 'E  UNARMED', {
            fontFamily: 'Trebuchet MS, Arial, sans-serif', fontSize: '15px', fontStyle: 'bold', color: '#8ea4bd'
        }).setOrigin(1, 0).setDepth(901)
        this.scene.add.rectangle(978, 64, 252, 8, 0x24314b, 1).setOrigin(0, 0.5).setDepth(901)
        this.superFill = this.scene.add.rectangle(978, 64, 0, 8, UI.violet, 1)
            .setOrigin(0, 0.5).setDepth(902)

        this.scene.add.text(640, 692, 'WASD  MOVE     •     MOUSE  FIRE     •     E  SUPER SHOT', {
            fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#6f86a2', letterSpacing: 2
        }).setOrigin(0.5).setDepth(901)
    }

    updateHealth(health: number) {
        const value = Phaser.Math.Clamp(health, 0, 100)
        this.healthText.setText(`${value}%`)
        this.healthFill.width = 246 * (value / 100)
        const color = value <= 30 ? UI.danger : value <= 60 ? 0xffb84d : UI.cyan
        this.healthFill.setFillStyle(color)
        this.healthText.setColor(value <= 30 ? '#ff557f' : UI.white)
    }

    updateWave(wave: number) {
        this.waveText.setText(`WAVE ${String(wave).padStart(2, '0')}`)
    }

    updateSuperShot(progress: number, armed: boolean) {
        const clamped = Phaser.Math.Clamp(progress, 0, 1)
        this.superFill.width = 252 * clamped
        this.superText.setText(armed ? (clamped >= 1 ? 'E  READY' : 'E  CHARGING') : 'E  UNARMED')
        this.superText.setColor(armed && clamped >= 1 ? '#caa8ff' : '#8ea4bd')
    }

    showWaveComplete(wave: number, onComplete: () => void) {
        const veil = this.scene.add.rectangle(640, 360, 1280, 720, UI.ink, 0.34).setDepth(1000)
        const panel = this.scene.add.rectangle(640, 330, 520, 172, UI.panel, 0.96)
            .setStrokeStyle(2, UI.cyan, 0.65).setDepth(1001)
        const eyebrow = this.scene.add.text(640, 286, 'SECTOR SECURED', {
            fontFamily: 'Arial, sans-serif', fontSize: '12px', fontStyle: 'bold', color: '#54e7ff', letterSpacing: 4
        }).setOrigin(0.5).setDepth(1002)
        const text = this.scene.add.text(640, 335, `WAVE ${String(wave).padStart(2, '0')} COMPLETE`, {
            ...titleStyle, fontSize: '34px', strokeThickness: 4, letterSpacing: 2
        }).setOrigin(0.5).setDepth(1002)
        const hint = this.scene.add.text(640, 382, 'Preparing tactical upgrade…', {
            fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#8ea4bd'
        }).setOrigin(0.5).setDepth(1002)

        this.scene.tweens.add({
            targets: [panel, eyebrow, text, hint], alpha: { from: 0, to: 1 }, y: '-=10',
            duration: 320, ease: 'Cubic.Out'
        })
        this.scene.time.delayedCall(1500, () => {
            ;[veil, panel, eyebrow, text, hint].forEach(object => object.active && object.destroy())
            onComplete()
        })
    }
}
