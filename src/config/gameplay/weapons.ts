export const PLAYER_PROJECTILE_CONFIG = {
    speed: 600,
    damage: 10,
    displayWidth: 8,
    displayHeight: 20,
    lifetimeMs: 2500
} as const

export const SUPER_SHOT_CONFIG = {
    commonSpawnOffset: 55,
    explosion: {
        speed: PLAYER_PROJECTILE_CONFIG.speed,
        blastRadius: 180,
        damage: 70,
        lifetimeMs: 2500,
        displayWidth: 120,
        displayHeight: 43,
        hitboxWidth: 360,
        hitboxHeight: 110
    },
    laser: {
        damage: 80,
        activeTimeMs: 1000,
        offsetFromPlayer: 340,
        displayWidth: 740,
        displayHeight: 175,
        hitboxLength: 940,
        hitboxThickness: 87
    },
    round: {
        durationMs: 3000,
        intervalMs: 250,
        projectileCount: 12,
        rotationDegreesPerSecond: 600,
        projectileSpawnOffset: 55
    }
} as const
