import Phaser from 'phaser'

import { Player } from '../entities/Player'
import { PlayerLaser } from '../entities/PlayerLaser'
import { Asteroid } from '../entities/Asteroid'
import { Alien } from '../entities/Alien'
import type { AlienType } from '../entities/Alien'
import { EnemyLaser } from '../entities/EnemyLaser'
import { BlackHole } from '../entities/BlackHole'
import { LaserBeam } from '../entities/LaserBeam'
import type { SuperShotType } from '../entities/SuperShot'

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
    private blackHoleGroup!: Phaser.Physics.Arcade.Group

    // =====================================================
    // PROJECTILES
    // =====================================================

    private playerLasers!: Phaser.Physics.Arcade.Group
    private enemyLasers!: Phaser.Physics.Arcade.Group
    private superShots!: Phaser.Physics.Arcade.Group

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

        this.enemyLasers =
            this.physics.add.group()

        this.superShots =
            this.physics.add.group()

        this.alienGroup =
            this.physics.add.group()

        this.asteroidGroup =
            this.physics.add.group()

        this.blackHoleGroup =
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

        this.player.on(
            'supershot',
            (
                type: SuperShotType,
                x: number,
                y: number,
                directionX: number,
                directionY: number
            ) => {
                this.fireSuperShot(
                    type,
                    x,
                    y,
                    directionX,
                    directionY
                )
            }
        )

        // =========================================
        // WAVE MANAGER
        // =========================================

        this.waveManager =
            new WaveManager()

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

        for (let i = 0; i < config.blackHoles.count; i++) {
            this.createBlackHole()
        }

        // =========================================
        // ALIENS
        // =========================================

        for (
            let i = 0;
            i < config.aliens.standard;
            i++
        ) {

            this.createAlien('standard')
        }

        for (const type of ['fast', 'fat', 'shooter'] as AlienType[]) {
            for (let i = 0; i < config.aliens[type]; i++) {
                this.createAlien(type)
            }
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

    private createAlien(type: AlienType) {

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
                type
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
    // CREATE BLACK HOLE
    // =====================================================

    private createBlackHole() {
        let x: number
        let y: number

        do {
            x = Phaser.Math.Between(140, 1140)
            y = Phaser.Math.Between(140, 580)
        } while (
            Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y) < 250
        )

        const blackHole = new BlackHole(this, x, y)
        this.blackHoleGroup.add(blackHole)
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

        // =========================================
        // PLAYER <-> BLACK HOLES
        // =========================================

        this.physics.add.overlap(
            this.player,
            this.blackHoleGroup,
            () => {
                if (!this.player.active || this.waveComplete) {
                    return
                }

                this.player.takeDamage(30)
            }
        )

        // =========================================
        // LASERS -> BLACK HOLES
        // =========================================

        this.physics.add.overlap(
            this.playerLasers,
            this.blackHoleGroup,
            (laserObject) => {
                const laser = laserObject as PlayerLaser

                if (laser.active) {
                    laser.destroy()
                }
            }
        )

        this.physics.add.overlap(
            this.enemyLasers,
            this.blackHoleGroup,
            (laserObject) => {
                const laser = laserObject as EnemyLaser

                if (laser.active) {
                    laser.destroy()
                }
            }
        )

        // =========================================
        // SUPER SHOTS
        // =========================================

        this.physics.add.overlap(
            this.superShots,
            this.blackHoleGroup,
            (shotObject) => {
                const shot = shotObject as LaserBeam

                if (shot.active) {
                    shot.destroy()
                }
            }
        )

        this.physics.add.overlap(
            this.superShots,
            this.asteroidGroup,
            (shotObject, asteroidObject) => {
                const shot = shotObject as LaserBeam
                const asteroid = asteroidObject as Asteroid

                if (!shot.active || !asteroid.active) {
                    return
                }

                const damage = shot.hit(asteroid)

                if (damage > 0) {
                    asteroid.takeDamage(damage)
                }
            }
        )

        this.physics.add.overlap(
            this.superShots,
            this.alienGroup,
            (shotObject, alienObject) => {
                const shot = shotObject as LaserBeam
                const alien = alienObject as Alien

                if (!shot.active || !alien.active || this.waveComplete) {
                    return
                }

                const damage = shot.hit(alien)

                if (damage > 0) {
                    alien.takeDamage(damage)
                }
            }
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
        // ENEMY LASER -> PLAYER
        // =========================================

        this.physics.add.overlap(
            this.enemyLasers,
            this.player,
            (laserObject) => {
                const laser = laserObject as EnemyLaser

                if (!laser.active || !this.player.active || this.waveComplete) {
                    return
                }

                laser.destroy()
                this.player.takeDamage(12)
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

        this.blackHoleGroup.clear(
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

        this.enemyLasers.clear(true, true)
        this.superShots.clear(true, true)

        this.aliens = []

        const selectedSuperShot =
            this.registry.get('selectedSuperShot') as SuperShotType | undefined

        if (selectedSuperShot) {
            this.player.setSuperShot(selectedSuperShot)
        }

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

                    const shouldShoot = alien.update(this.player, this.time.now)

                    if (shouldShoot) {
                        this.createEnemyLaser(alien)
                    }
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

    private fireSuperShot(
        type: SuperShotType,
        x: number,
        y: number,
        directionX: number,
        directionY: number
    ) {
        if (type !== 'laser') {
            return
        }

        const direction = new Phaser.Math.Vector2(
            directionX,
            directionY
        ).normalize()

        const shot = new LaserBeam(
            this,
            x + direction.x * 90,
            y + direction.y * 90,
            direction
        )

        this.superShots.add(shot)
    }

    private createEnemyLaser(alien: Alien) {
        const direction = new Phaser.Math.Vector2(
            this.player.x - alien.x,
            this.player.y - alien.y
        ).normalize()

        const laser = new EnemyLaser(
            this,
            alien.x + direction.x * 35,
            alien.y + direction.y * 35,
            Phaser.Math.Angle.Between(0, 0, direction.x, direction.y) + Math.PI / 2
        )

        this.enemyLasers.add(laser)
        laser.setVelocity(direction.x * 350, direction.y * 350)
    }
}
