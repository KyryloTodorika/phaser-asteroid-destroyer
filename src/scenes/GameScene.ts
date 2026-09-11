import Phaser from 'phaser'

import { Player } from '../entities/Player'
import { PlayerLaser } from '../entities/PlayerLaser'
import { Asteroid } from '../entities/Asteroid'
import { Alien } from '../entities/Alien'

import { WaveManager } from '../systems/WaveManager'
import type { WaveConfig } from '../data/waves'
import { GameUI } from '../ui/GameUI'

export class GameScene extends Phaser.Scene {

    // =====================================================
    // PLAYER
    // =====================================================

    private player!: Player

    // =====================================================
    // ENEMIES
    // =====================================================

    private aliens: Alien[] = []

    private alienGroup!: Phaser.Physics.Arcade.Group

    // =====================================================
    // ASTEROIDS
    // =====================================================

    private asteroidGroup!: Phaser.Physics.Arcade.Group

    // =====================================================
    // PROJECTILES
    // =====================================================

    private playerLasers!: Phaser.Physics.Arcade.Group

    // =====================================================
    // UI
    // =====================================================

    private ui!: GameUI

    // =====================================================
    // WAVE SYSTEM
    // =====================================================

    private waveManager!: WaveManager

    private currentWave: number = 1

    private waveInProgress: boolean = false
    private waveComplete: boolean = false

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    constructor() {
        super('GameScene')
    }

    // =====================================================
    // CREATE
    // =====================================================

    create() {

        // =========================================
        // RESET
        // =========================================

        this.aliens = []

        this.waveInProgress = false
        this.waveComplete = false

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

        // =========================================
        // PHYSICS GROUPS
        // =========================================

        this.playerLasers =
            this.physics.add.group()

        this.alienGroup =
            this.physics.add.group()

        this.asteroidGroup =
            this.physics.add.group()

        // =========================================
        // UI
        // =========================================

        this.ui = new GameUI(this)
        this.ui.create(this.currentWave)

        // =========================================
        // PLAYER
        // =========================================

        this.player =
            new Player(
                this,
                640,
                360,
                this.playerLasers
            )

        // =========================================
        // WAVE MANAGER
        // =========================================

        this.waveManager =
            new WaveManager(this)

        this.currentWave =
            this.waveManager.getCurrentWave()

        // =========================================
        // COLLISIONS
        // =========================================

        this.createCollisions()

        // =========================================
        // FIRST WAVE
        // =========================================

        this.createWave()

        // =========================================
        // UI
        // =========================================

        this.updateHealthUI()
    }

    // =====================================================
    // UI
    // =====================================================

    private updateHealthUI() {

        if (
            !this.player ||
            !this.player.active
        ) {
            return
        }

        this.ui.updateHealth(
            this.player.getHealth()
        )
    }

    // =====================================================
    // CREATE WAVE
    // =====================================================

    private createWave() {

        const config:
            WaveConfig | undefined =
            this.waveManager
                .getCurrentConfig()

        if (!config) {

            console.log(
                'No configuration for wave:',
                this.currentWave
            )

            return
        }

        console.log(
            `Starting Wave ${config.wave}`
        )

        this.waveInProgress = true
        this.waveComplete = false

        this.currentWave =
            config.wave

        // =========================================
        // UPDATE WAVE UI
        // =========================================

        this.ui.updateWave(this.currentWave)

        // =========================================
        // ASTEROIDS
        // =========================================

        for (
            let i = 0;
            i < config.asteroids.count;
            i++
        ) {

            this.createAsteroid()
        }

        // =========================================
        // ALIENS
        // =========================================

        for (
            let i = 0;
            i < config.aliens.standard;
            i++
        ) {

            this.createAlien()
        }
    }

    // =====================================================
    // CREATE ASTEROID
    // =====================================================

    private createAsteroid() {

        const asteroidTypes = [
            'asteroid_1',
            'asteroid_2',
            'asteroid_3',
            'asteroid_4'
        ]

        const texture =
            Phaser.Utils.Array.GetRandom(
                asteroidTypes
            )

        const size =
            Phaser.Math.Between(
                80,
                140
            )

        let x: number
        let y: number

        do {
            x = Phaser.Math.Between(
                100,
                1180
            )

            y = Phaser.Math.Between(
                100,
                620
            )

        } while (
            Phaser.Math.Distance.Between(
                x,
                y,
                this.player.x,
                this.player.y
            ) < 180
        )

        // =========================================
        // CREATE ASTEROID
        // =========================================

        const asteroid =
            new Asteroid(
                this,
                x,
                y,
                texture,
                150
            )

        asteroid.setDisplaySize(
            size,
            size
        )

        // =========================================
        // ADD TO PHYSICS GROUP
        // =========================================

        this.asteroidGroup.add(
            asteroid
        )

        // =========================================
        // NOW START PHYSICS
        // =========================================

        asteroid.startMovement()

        return asteroid
    }

    // =====================================================
    // CREATE ALIEN
    // =====================================================

    private createAlien() {

        let x: number
        let y: number

        // =========================================
        // RANDOM SPAWN
        // =========================================

        do {

            x =
                Phaser.Math.Between(
                    100,
                    1180
                )

            y =
                Phaser.Math.Between(
                    100,
                    620
                )

        } while (
            Phaser.Math.Distance.Between(
                x,
                y,
                this.player.x,
                this.player.y
            ) < 250
        )

        // =========================================
        // CREATE
        // =========================================

        const alien =
            new Alien(
                this,
                x,
                y,
                'alien_standard',
                70
            )

        // =========================================
        // STORE
        // =========================================

        this.aliens.push(
            alien
        )

        this.alienGroup.add(
            alien
        )
    }

    // =====================================================
    // COLLISIONS
    // =====================================================

    private createCollisions() {

        // =========================================
        // PLAYER <-> ASTEROIDS
        // =========================================

        this.physics.add.collider(
            this.player,
            this.asteroidGroup,
            () => {

                if (
                    !this.player.active ||
                    this.waveComplete
                ) {
                    return
                }

                this.player.takeDamage(
                    10
                )
            }
        )

        // =========================================
        // PLAYER <-> ALIENS
        // =========================================

        this.physics.add.collider(
            this.player,
            this.alienGroup,
            () => {

                if (
                    !this.player.active ||
                    this.waveComplete
                ) {
                    return
                }

                this.player.takeDamage(
                    20
                )
            }
        )

        // =========================================
        // ASTEROIDS <-> ALIENS
        // =========================================

        this.physics.add.collider(
            this.asteroidGroup,
            this.alienGroup,
            (
                _asteroidObject,
                alienObject
            ) => {

                if (this.waveComplete) {
                    return
                }

                const alien =
                    alienObject as Alien

                if (alien.active) {
                    alien.takeDamage(10)
                }
            }
        )

        // =========================================
        // ASTEROID <-> ASTEROID
        // =========================================

        this.physics.add.collider(
            this.asteroidGroup,
            this.asteroidGroup
        )

        this.physics.add.overlap(
            this.playerLasers,
            this.asteroidGroup,
            (
                laserObject,
                asteroidObject
            ) => {

                const laser =
                    laserObject as PlayerLaser

                const asteroid =
                    asteroidObject as Asteroid

                if (
                    !laser.active ||
                    !asteroid.active
                ) {
                    return
                }

                const damage =
                    laser.getDamage()

                // Destroy laser
                laser.destroy()

                // Damage asteroid
                if (asteroid.active) {
                    asteroid.takeDamage(
                        damage
                    )
                }
            }
        )

        // =========================================
        // PLAYER LASER -> ALIEN
        // =========================================

        this.physics.add.overlap(
            this.playerLasers,
            this.alienGroup,
            (
                laserObject,
                alienObject
            ) => {

                if (
                    this.waveComplete
                ) {
                    return
                }

                const laser =
                    laserObject as PlayerLaser

                const alien =
                    alienObject as Alien

                if (
                    !laser.active ||
                    !alien.active
                ) {
                    return
                }

                // Get damage first
                const damage =
                    laser.getDamage()

                // Destroy laser
                laser.destroy()

                // Damage alien
                if (
                    alien.active
                ) {

                    alien.takeDamage(
                        damage
                    )
                }
            }
        )
    }

    // =====================================================
    // CHECK WAVE COMPLETE
    // =====================================================

    private checkWaveComplete() {

        if (
            !this.waveInProgress ||
            this.waveComplete
        ) {
            return
        }

        const livingAliens =
            this.aliens.filter(
                alien =>
                    alien.active
            )

        // =========================================
        // ENEMIES STILL ALIVE
        // =========================================

        if (
            livingAliens.length > 0
        ) {
            return
        }

        // =========================================
        // WAVE COMPLETE
        // =========================================

        this.waveComplete = true
        this.waveInProgress = false

        this.showWaveComplete()
    }

    // =====================================================
    // WAVE COMPLETE MESSAGE
    // =====================================================

    private showWaveComplete() {
        this.ui.showWaveComplete(
            this.currentWave,
            () => {
                // Pause the current game
                this.scene.pause()

                // Open ability selection
                this.scene.launch(
                    'SuperShotSelectScene',
                    {
                        wave:
                            this.currentWave
                    }
                )
            }
        )
    }

    // =====================================================
    // NEXT WAVE
    // =====================================================

    public startNextWave() {

        // =========================================
        // NO MORE WAVES
        // =========================================

        if (
            !this.waveManager
                .hasNextWave()
        ) {

            console.log(
                'ALL WAVES COMPLETED'
            )

            return
        }

        // =========================================
        // CLEAR OLD ASTEROIDS
        // =========================================

        this.asteroidGroup.clear(
            true,
            true
        )

        // =========================================
        // CLEAR OLD ALIENS
        // =========================================

        this.alienGroup.clear(
            true,
            true
        )

        this.aliens = []

        // =========================================
        // NEXT WAVE
        // =========================================

        this.waveManager.nextWave()

        this.currentWave =
            this.waveManager
                .getCurrentWave()

        // =========================================
        // CREATE
        // =========================================

        this.createWave()
    }

    // =====================================================
    // UPDATE
    // =====================================================

    update() {

        // =========================================
        // PLAYER DEAD
        // =========================================

        if (
            !this.player.active
        ) {

            this.scene.start(
                'GameOverScene',
                {
                    wave: this.currentWave
                }
            )

            return
        }

        // =========================================
        // PLAYER
        // =========================================

        this.player.update()

        // =========================================
        // ALIENS
        // =========================================

        this.aliens.forEach(
            alien => {

                if (
                    alien.active
                ) {

                    alien.update(
                        this.player
                    )
                }
            }
        )

        // =========================================
        // REMOVE DEAD ALIENS
        // =========================================

        this.aliens =
            this.aliens.filter(
                alien =>
                    alien.active
            )

        // =========================================
        // CHECK WAVE
        // =========================================

        this.checkWaveComplete()

        // =========================================
        // UI
        // =========================================

        this.updateHealthUI()
    }

    public getPlayer(): Player {
        return this.player
    }
}
