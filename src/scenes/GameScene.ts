import Phaser from 'phaser'
import { Player } from '../entities/Player'
import { Asteroid } from '../entities/Asteroid'

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

        this.createAsteroids()
    }

    private createAsteroids() {
        const asteroid1 = new Asteroid(
            this,
            200,
            150,
            'asteroid_1',
            80
        )

        const asteroid2 = new Asteroid(
            this,
            1000,
            150,
            'asteroid_2',
            120
        )

        const asteroid3 = new Asteroid(
            this,
            300,
            550,
            'asteroid_3',
            100
        )

        const asteroid4 = new Asteroid(
            this,
            1050,
            500,
            'asteroid_4',
            140
        )

        this.physics.add.collider(
            this.player,
            asteroid1,
            () => this.player.takeDamage(10)
        )

        this.physics.add.collider(
            this.player,
            asteroid2,
            () => this.player.takeDamage(10)
        )

        this.physics.add.collider(
            this.player,
            asteroid3,
            () => this.player.takeDamage(10)
        )

        this.physics.add.collider(
            this.player,
            asteroid4,
            () => this.player.takeDamage(10)
        )
    }

    update() {
        if (!this.player.active) {
            return
        }

        this.player.update()
    }
}