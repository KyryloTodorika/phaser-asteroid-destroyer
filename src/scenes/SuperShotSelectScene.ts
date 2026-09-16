import Phaser from 'phaser'
import { GameScene } from './GameScene'
import type { SuperShotType } from '../entities/SuperShot'
import { addEyebrow, addScreenTreatment, titleStyle, UI } from '../ui/theme'

export class SuperShotSelectScene extends Phaser.Scene {
    private currentWave = 1

    constructor() {
        super('SuperShotSelectScene')
    }

    init(data: { wave?: number }) {
        this.currentWave = data.wave ?? 1
    }

    create() {
        this.add.image(640, 360, 'background').setDisplaySize(1280, 720)
        addScreenTreatment(this, 0.72)
        addEyebrow(this, 76, `WAVE ${String(this.currentWave).padStart(2, '0')} COMPLETE`)

        this.add.text(640, 128, 'CHOOSE YOUR SUPERSHOT', {
            ...titleStyle, fontSize: '42px', strokeThickness: 5, letterSpacing: 3
        }).setOrigin(0.5)
        this.add.text(640, 178, 'Your selection is armed for the next wave', {
            fontFamily: 'Arial, sans-serif', fontSize: '15px', color: '#8ea4bd'
        }).setOrigin(0.5)

        this.createAbilityCard(230, '1', 'explosion_shot', 'EXPLOSION', 'AREA DAMAGE',
            'Detonates on impact and\ndamages everything nearby.', 'explosion')
        this.createAbilityCard(640, '2', 'laser_beam', 'LASER BEAM', 'PIERCING DAMAGE',
            'Cuts a high-power path\nthrough clustered enemies.', 'laser')
        this.createAbilityCard(1050, '3', 'player', 'ROUND SHOT', '360° COVERAGE',
            'Spins the ship and fires\nin every direction.', 'round')

        this.add.text(640, 675, 'CLICK A CARD  •  OR PRESS 1 / 2 / 3', {
            fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#7188a5', letterSpacing: 3
        }).setOrigin(0.5)

        this.input.keyboard?.once('keydown-ONE', () => this.chooseAbility('explosion'))
        this.input.keyboard?.once('keydown-TWO', () => this.chooseAbility('laser'))
        this.input.keyboard?.once('keydown-THREE', () => this.chooseAbility('round'))
    }

    private createAbilityCard(
        x: number,
        key: string,
        texture: string,
        title: string,
        tag: string,
        description: string,
        ability: SuperShotType
    ) {
        const y = 414
        const glow = this.add.rectangle(x, y + 8, 338, 392, UI.violet, 0.08)
        const card = this.add.rectangle(x, y, 338, 392, UI.panel, 0.95)
            .setStrokeStyle(2, 0x5f7294, 0.55)
            .setInteractive({ useHandCursor: true })

        this.add.text(x - 142, y - 166, key.padStart(2, '0'), {
            fontFamily: 'Trebuchet MS, Arial, sans-serif', fontSize: '14px', fontStyle: 'bold', color: '#54e7ff'
        }).setOrigin(0.5)
        this.add.text(x + 136, y - 166, 'MK II', {
            fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#617691', letterSpacing: 2
        }).setOrigin(0.5)

        const image = this.add.image(x, y - 78, texture).setDisplaySize(112, 112)
        this.add.circle(x, y - 78, 74, UI.cyan, 0.04).setStrokeStyle(1, UI.cyan, 0.18)

        const titleText = this.add.text(x, y + 16, title, {
            fontFamily: 'Trebuchet MS, Arial, sans-serif', fontSize: '25px', fontStyle: 'bold',
            color: UI.white, letterSpacing: 1
        }).setOrigin(0.5)
        this.add.text(x, y + 52, tag, {
            fontFamily: 'Arial, sans-serif', fontSize: '10px', fontStyle: 'bold', color: '#a76cff', letterSpacing: 3
        }).setOrigin(0.5)
        this.add.text(x, y + 102, description, {
            fontFamily: 'Arial, sans-serif', fontSize: '15px', color: '#9aabc0', align: 'center', lineSpacing: 6
        }).setOrigin(0.5)
        const selectText = this.add.text(x, y + 162, 'SELECT  →', {
            fontFamily: 'Trebuchet MS, Arial, sans-serif', fontSize: '14px', fontStyle: 'bold', color: '#7188a5', letterSpacing: 2
        }).setOrigin(0.5)

        card.on('pointerover', () => {
            card.setStrokeStyle(3, UI.cyan, 1).setFillStyle(0x101d3b, 1)
            glow.setFillStyle(UI.cyan, 0.18)
            titleText.setColor('#54e7ff')
            selectText.setColor('#f5fbff')
            this.tweens.add({ targets: [card, glow, image], y: '-=6', duration: 130, ease: 'Cubic.Out' })
        })
        card.on('pointerout', () => {
            card.setStrokeStyle(2, 0x5f7294, 0.55).setFillStyle(UI.panel, 0.95)
            glow.setFillStyle(UI.violet, 0.08)
            titleText.setColor(UI.white)
            selectText.setColor('#7188a5')
            this.tweens.add({ targets: [card, glow, image], y: '+=6', duration: 130, ease: 'Cubic.Out' })
        })
        card.on('pointerdown', () => this.chooseAbility(ability))
    }

    private chooseAbility(ability: SuperShotType) {
        this.registry.set('selectedSuperShot', ability)
        const gameScene = this.scene.get('GameScene') as GameScene
        this.scene.stop()
        this.scene.resume('GameScene')
        gameScene.startNextWave()
    }
}
