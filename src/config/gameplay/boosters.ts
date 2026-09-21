export type BoosterType = 'heal' | 'shield' | 'attackSpeed' | 'superShot'

export const BOOSTER_TYPES: BoosterType[] = [
    'heal',
    'shield',
    'attackSpeed',
    'superShot'
]

export const BOOSTER_CONFIG = {
    dropChance: 0.25,
    followSpeed: 180,
    effects: {
        healAmount: 40,
        shieldDurationMs: 3000,
        attackSpeedMultiplier: 1.5,
        superShotChargeDurationMs: 3000
    },
    textures: {
        heal: 'booster_heal',
        shield: 'booster_shield',
        attackSpeed: 'booster_attack_speed',
        superShot: 'booster_super_shot'
    } satisfies Record<BoosterType, string>
} as const
