import Phaser from 'phaser'
import { GameScene } from './GameScene'

export class SuperShotSelectScene extends Phaser.Scene {

    private currentWave: number = 1

    constructor() {
        super('SuperShotSelectScene')
    }

    init(data: { wave?: number }) {

        this.currentWave =
            data.wave ?? 1
    }

    create() {

        // =========================================
        // BACKGROUND
        // =========================================

        this.add
            .image(
                640,
                360,
                'background'
            )
            .setDisplaySize(
                1280,
                720
            )

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
        // TITLE
        // =========================================

        this.add.text(
            640,
            100,
            'CHOOSE YOUR SUPERSHOT',
            {
                fontFamily: 'Arial',
                fontSize: '48px',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        )
        .setOrigin(0.5)

        // =========================================
        // SUBTITLE
        // =========================================

        this.add.text(
            640,
            165,
            `WAVE ${this.currentWave} COMPLETE`,
            {
                fontFamily: 'Arial',
                fontSize: '22px',
                color: '#aaaaaa'
            }
        )
        .setOrigin(0.5)

        // =========================================
        // EXPLOSION SHOT
        // =========================================

        this.createAbilityCard(
            400,
            400,
            'explosion_shot',
            'EXPLOSION SHOT',
            'Creates a powerful explosion\nwhen the projectile hits.',
            () => {
                this.chooseAbility(
                    'explosion'
                )
            }
        )

        // =========================================
        // LASER BEAM
        // =========================================

        this.createAbilityCard(
            880,
            400,
            'laser_beam',
            'LASER BEAM',
            'Fires a powerful beam\nin the shooting direction.',
            () => {
                this.chooseAbility(
                    'laser'
                )
            }
        )
    }

    private createAbilityCard(
        x: number,
        y: number,
        texture: string,
        title: string,
        description: string,
        callback: () => void
    ) {

        // =========================================
        // CARD
        // =========================================

        const card =
            this.add.rectangle(
                x,
                y,
                350,
                400,
                0x111827,
                1
            )

        card.setStrokeStyle(
            2,
            0xffffff,
            0.3
        )

        // =========================================
        // SPRITE
        // =========================================

        const image =
            this.add.image(
                x,
                y - 90,
                texture
            )

        image.setDisplaySize(
            120,
            120
        )

        // =========================================
        // TITLE
        // =========================================

        this.add.text(
            x,
            y + 10,
            title,
            {
                fontFamily: 'Arial',
                fontSize: '28px',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        )
        .setOrigin(0.5)

        // =========================================
        // DESCRIPTION
        // =========================================

        this.add.text(
            x,
            y + 65,
            description,
            {
                fontFamily: 'Arial',
                fontSize: '17px',
                color: '#bbbbbb',
                align: 'center'
            }
        )
        .setOrigin(0.5)

        // =========================================
        // SELECT BUTTON
        // =========================================

        const button =
            this.add.text(
                x,
                y + 145,
                'SELECT',
                {
                    fontFamily: 'Arial',
                    fontSize: '22px',
                    color: '#ffffff',
                    backgroundColor: '#222222',
                    padding: {
                        left: 25,
                        right: 25,
                        top: 12,
                        bottom: 12
                    }
                }
            )
            .setOrigin(0.5)
            .setInteractive({
                useHandCursor: true
            })

        // =========================================
        // HOVER
        // =========================================

        button.on(
            'pointerover',
            () => {

                card.setStrokeStyle(
                    3,
                    0xffffff,
                    1
                )

                button.setStyle({
                    color: '#ffff00'
                })
            }
        )

        button.on(
            'pointerout',
            () => {

                card.setStrokeStyle(
                    2,
                    0xffffff,
                    0.3
                )

                button.setStyle({
                    color: '#ffffff'
                })
            }
        )

        // =========================================
        // CLICK
        // =========================================

        button.on(
            'pointerdown',
            callback
        )
    }

    private chooseAbility(
        ability: string
    ) {
        console.log(
            'Selected supershot:',
            ability
        )

        this.registry.set(
            'selectedSuperShot',
            ability
        )

        const gameScene =
            this.scene.get('GameScene') as GameScene

        // Stop the selection scene
        this.scene.stop()

        // Resume the existing game
        this.scene.resume('GameScene')

        // Start the next wave
        gameScene.startNextWave()
    }
}