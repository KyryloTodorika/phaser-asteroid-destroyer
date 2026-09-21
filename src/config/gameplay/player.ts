/** Player movement, survivability, firing, and presentation settings. */
export const PLAYER_CONFIG = {
    maxHealth: 100,
    movement: {
        acceleration: 1000,
        maxSpeed: 400,
        drag: 700,
        rotationSpeed: 0.06,
        rotationVelocityThreshold: 5
    },
    damageInvulnerabilityMs: 500,
    shooting: {
        cooldownMs: 200,
        projectileSpawnOffset: 10
    },
    superShotCooldownMs: 8000,
    display: {
        width: 96,
        height: 96,
        hitboxWidth: 48,
        hitboxHeight: 108
    }
} as const
