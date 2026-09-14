export interface WaveConfig {
    wave: number

    aliens: {
        standard: number
        fast: number
        fat: number
        shooter: number
    }

    asteroids: {
        count: number
    }

    blackHoles: {
        count: number
    }
}

export const WAVE_CONFIGS: WaveConfig[] = [
    {
        wave: 1,

        aliens: {
            standard: 1,
            fast: 0,
            fat: 0,
            shooter: 0
        },

        asteroids: {
            count: 1
        },

        blackHoles: {
            count: 1
        }
    },

    {
        wave: 2,

        aliens: {
            standard: 2,
            fast: 2,
            fat: 0,
            shooter: 0
        },

        asteroids: {
            count: 2
        },

        blackHoles: {
            count: 1
        }
    },

    {
        wave: 3,

        aliens: {
            standard: 5,
            fast: 3,
            fat: 2,
            shooter: 2
        },

        asteroids: {
            count: 3
        },

        blackHoles: {
            count: 2
        }
    }
]
