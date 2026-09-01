export interface WaveConfig {
    wave: number

    aliens: {
        standard: number
    }

    asteroids: {
        count: number
    }
}

export const WAVE_CONFIGS: WaveConfig[] = [
    {
        wave: 1,

        aliens: {
            standard: 3
        },

        asteroids: {
            count: 1
        }
    },

    {
        wave: 2,

        aliens: {
            standard: 5
        },

        asteroids: {
            count: 2
        }
    },

    {
        wave: 3,

        aliens: {
            standard: 6
        },

        asteroids: {
            count: 3
        }
    }
]