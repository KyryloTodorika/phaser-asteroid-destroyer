export type AlienType = 'standard' | 'fast' | 'fat' | 'shooter'

export const ALIEN_CONFIG = {
    standard: {
        speed: 80,
        health: 30,
        contactDamage: 20
    },
    fast: {
        speed: 200,
        health: 10,
        contactDamage: 15
    },
    fat: {
        speed: 40,
        health: 150,
        contactDamage: 30
    },
    shooter: {
        speed: 70,
        health: 20,
        contactDamage: 10,
        preferredDistanceMin: 280,
        preferredDistanceMax: 420,
        shootCooldownMs: 1800,
        projectileSpawnOffset: 35,
        projectileDamage: 9
    }
} as const satisfies Record<AlienType, {
    speed: number
    health: number
    contactDamage: number
    preferredDistanceMin?: number
    preferredDistanceMax?: number
    shootCooldownMs?: number
    projectileSpawnOffset?: number
    projectileDamage?: number
}>

export const ENEMY_PROJECTILE_CONFIG = {
    speed: 350,
    lifetimeMs: 2500
} as const

export const ALIEN_SPAWN_CONFIG = {
    minDistanceFromPlayer: 250
} as const

export const BOSS_CONFIG = {
    maxHealth: 1500,
    contactDamage: 20,
    shootCooldownMs: 1500,
    projectileSpawnOffset: 150,
    projectileDamage: 12,
    movementSpeed: 100,
    finalMovementSpeed: 150,
    finalMovementHealthRatio: 0.2,
    spawnQueueIntervalMs: 450,
    spawnPatterns: {
        asteroid: { unlockHealthRatio: 0.9, intervalMs: 7000 },
        fast: { unlockHealthRatio: 0.75, intervalMs: 5000 },
        fat: { unlockHealthRatio: 0.65, intervalMs: 9000 },
        shooter: { unlockHealthRatio: 0.5, intervalMs: 9000 }
    },
    minSpawnDistanceFromPlayer: 250,
    minSpawnDistanceFromBoss: 220,
    spawnPositionAttempts: 30
} as const
