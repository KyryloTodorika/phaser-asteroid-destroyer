export const ASTEROID_CONFIG = {
    speed: 150,
    health: 30,
    contactDamage: 10,
    damageToAliens: 10,
    minDisplaySize: 80,
    maxDisplaySize: 140,
    hitboxRadiusScale: 0.4,
    minAngularVelocity: -40,
    maxAngularVelocity: 40,
    textureCount: 4,
    minSpawnDistanceFromPlayer: 180
} as const

export const BLACK_HOLE_CONFIG = {
    contactDamage: 30,
    displayWidth: 180,
    displayHeight: 125,
    hitboxRadius: 240,
    hitboxOffsetX: 121,
    hitboxOffsetY: 9,
    minSpawnDistanceFromPlayer: 250
} as const

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
