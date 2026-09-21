export type AlienType = 'standard' | 'fast' | 'fat' | 'shooter'

export const ALIEN_CONFIG = {
    standard: {
        speed: 70,
        health: 30,
        contactDamage: 20
    },
    fast: {
        speed: 150,
        health: 20,
        contactDamage: 20
    },
    fat: {
        speed: 45,
        health: 100,
        contactDamage: 20
    },
    shooter: {
        speed: 80,
        health: 20,
        contactDamage: 20,
        preferredDistanceMin: 280,
        preferredDistanceMax: 420,
        shootCooldownMs: 1400,
        projectileSpawnOffset: 35,
        projectileDamage: 12
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
    shootCooldownMs: 1000,
    projectileSpawnOffset: 150,
    projectileDamage: 12,
    movementSpeed: 100,
    finalMovementSpeed: 200,
    finalMovementHealthRatio: 0.25,
    spawnPatterns: {
        asteroid: { unlockHealthRatio: 0.9, intervalMs: 3000 },
        fast: { unlockHealthRatio: 0.75, intervalMs: 4500 },
        fat: { unlockHealthRatio: 0.65, intervalMs: 6000 },
        shooter: { unlockHealthRatio: 0.5, intervalMs: 5000 }
    },
    minSpawnDistanceFromPlayer: 250,
    minSpawnDistanceFromBoss: 220,
    spawnPositionAttempts: 30
} as const
