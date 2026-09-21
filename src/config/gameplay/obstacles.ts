export const ASTEROID_CONFIG = {
    speed: 150,
    health: 30,
    contactDamage: 15,
    damageToAliens: 15,
    minAngularVelocity: -40,
    maxAngularVelocity: 40,
    inwardSpreadRadians: Math.PI / 3,
    textureCount: 4,
    minSpawnDistanceFromPlayer: 180
} as const

export const BLACK_HOLE_CONFIG = {
    contactDamage: 45,
    minSpawnDistanceFromPlayer: 250,
    animationFrameRate: 6
} as const

export const BLACK_HOLE_ANIMATION = 'black_hole_spin'

export const SPAWN_AREA_CONFIG = {
    minX: 100,
    maxX: 1180,
    minY: 100,
    maxY: 620,
    blackHoleMinX: 140,
    blackHoleMaxX: 1140,
    blackHoleMinY: 140,
    blackHoleMaxY: 580
} as const
