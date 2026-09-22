export const LASER_BEAM_ANIMATION = 'laser_beam_pulse'

export const PLAYER_PROJECTILE_CONFIG = {
    speed: 600,
    damage: 10,
    lifetimeMs: 2500
} as const

export const SUPER_SHOT_CONFIG = {
    commonSpawnOffset: 55,
    explosion: {
        speed: PLAYER_PROJECTILE_CONFIG.speed,
        blastRadius: 180,
        damage: 150,
        lifetimeMs: 3000
    },
    laser: {
        damage: 100,
        activeTimeMs: 2000,
        offsetFromPlayer: 340,
        animationFrameRate: 12
    },
    round: {
        durationMs: 20500,
        intervalMs: 100,
        projectileCount: 20,
        rotationDegreesPerSecond: 600,
        projectileSpawnOffset: 55
    }
} as const
