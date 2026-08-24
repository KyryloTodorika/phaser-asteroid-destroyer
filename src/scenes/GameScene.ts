import Phaser from 'phaser'
import { Player } from '../entities/Player'

export class GameScene extends Phaser.Scene {
    private player!: Player

    constructor() {
        super('GameScene')
    }

    create() {
        this.add
            .image(640, 360, 'background')
            .setDisplaySize(1280, 720)

        this.player = new Player(
            this,
            640,
            360
        )
    }

    update() {
        this.player.update()
    }
}