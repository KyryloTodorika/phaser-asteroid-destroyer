import Phaser from 'phaser'
import { IMAGE_ASSETS } from '../config/assets'

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene')
    }

    preload() {
        this.load.image('background', IMAGE_ASSETS.background)
        this.load.image('player', IMAGE_ASSETS.player)
    }

    create() {
        this.scene.start('GameScene')
    }
}