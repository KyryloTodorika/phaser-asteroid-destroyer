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
        lifetimeMs: 3000,
        effectDisplaySize: 360,
        effectDurationMs: 420
    },
    laser: {
        damage: 100,
        activeTimeMs: 1000,
        offsetFromPlayer: 340,
        animationFrameRate: 12
    },
    round: {
        durationMs: 2000,
        intervalMs: 400,
        projectileCount: 12,
        rotationDegreesPerSecond: 600,
        projectileSpawnOffset: 55
    }
} as const
