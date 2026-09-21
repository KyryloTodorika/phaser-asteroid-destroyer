import type { AlienType } from './enemies'

export const SCORE_VALUES = {
    asteroid: 50,
    alien: {
        standard: 100,
        fast: 150,
        shooter: 200,
        fat: 250
    } satisfies Record<AlienType, number>,
    waveComplete: 500,
    boss: 5000
} as const
