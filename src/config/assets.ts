export const IMAGE_ASSETS = {
    background: '/assets/images/backgrounds/main_background.jpg',
    bossBackground: '/assets/images/backgrounds/boss_fight_background.png',

    player: '/assets/images/player/spaceship_animation_sheet.png',

    enemies: {
        standard: '/assets/images/enemies/alien_standard.png',
        fast: '/assets/images/enemies/alien_fast.png',
        fat: '/assets/images/enemies/alien_fat.png',
        shooter: '/assets/images/enemies/alien_shooter.png',
        boss: '/assets/images/enemies/boss_spaceship.png',
    },

    projectiles: {
        playerLaser: '/assets/images/projectiles/player_laser.png',
        enemyLaser: '/assets/images/projectiles/enemy_laser.png',
        laserBeamAnimation:
            '/assets/images/projectiles/supershots/laser_beam_animation_sheet.png',
    },

    boosters: {
        heal: '/assets/images/boosters/heal.png',
        shield: '/assets/images/boosters/shield.png',
        attackSpeed: '/assets/images/boosters/attack_speed.png',
        superShotCharger: '/assets/images/boosters/super_shot_charger.png',
    },

    asteroids: [
        '/assets/images/obstacles/asteroids/asteroid_1.png',
        '/assets/images/obstacles/asteroids/asteroid_2.png',
        '/assets/images/obstacles/asteroids/asteroid_3.png',
        '/assets/images/obstacles/asteroids/asteroid_4.png',
    ],

    blackholes: {
        blackHole: '/assets/images/obstacles/blackhole/blackhole.png',
    },

    destructionEffects: {
        asteroid: '/assets/images/effects/asteroid_destruction.png',
        alien: '/assets/images/effects/alien_destruction.png',
        boss: '/assets/images/effects/boss_destruction.png',
        player: '/assets/images/effects/player_destruction.png',
    }
}

export const AUDIO_ASSETS = {
    backgroundMusic: '/assets/audio/music/flower-man.mp3',
    soundEffects: {
        playerShoot: '/assets/audio/sfx/shoot.wav',
        laserBeam: '/assets/audio/sfx/laserbeam.mp3',
        destruction: '/assets/audio/sfx/explosion.mp3'
    }
} as const
