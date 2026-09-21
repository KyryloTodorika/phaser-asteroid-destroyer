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

export const WAVE_SPAWN_CONFIG = {
    intervalMs: 450
} as const

export const WAVE_CONFIGS: WaveConfig[] = [
    {
        wave: 1,

        aliens: {
            standard: 2,
            fast: 0,
            fat: 0,
            shooter: 0
        },

        asteroids: {
            count: 1
        },

        blackHoles: {
            count: 0
        }
    },

    {
        wave: 2,

        aliens: {
            standard: 2,
            fast: 1,
            fat: 0,
            shooter: 0
        },

        asteroids: {
            count: 2
        },

        blackHoles: {
            count: 0
        }
    },

    {
        wave: 3,

        aliens: {
            standard: 3,
            fast: 1,
            fat: 1,
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
        wave: 4,

        aliens: {
            standard: 3,
            fast: 2,
            fat: 0,
            shooter: 1
        },

        asteroids: {
            count: 3
        },

        blackHoles: {
            count: 1
        }
    },

    {
        wave: 5,

        aliens: {
            standard: 3,
            fast: 2,
            fat: 1,
            shooter: 1
        },

        asteroids: {
            count: 3
        },

        blackHoles: {
            count: 1
        }
    },

    {
        wave: 6,

        aliens: {
            standard: 4,
            fast: 2,
            fat: 1,
            shooter: 2
        },

        asteroids: {
            count: 4
        },

        blackHoles: {
            count: 1
        }
    },

    {
        wave: 7,

        aliens: {
            standard: 4,
            fast: 3,
            fat: 2,
            shooter: 1
        },

        asteroids: {
            count: 4
        },

        blackHoles: {
            count: 2
        }
    },

    {
        wave: 8,

        aliens: {
            standard: 4,
            fast: 3,
            fat: 2,
            shooter: 3
        },

        asteroids: {
            count: 5
        },

        blackHoles: {
            count: 2
        }
    },

    {
        wave: 9,

        aliens: {
            standard: 5,
            fast: 4,
            fat: 2,
            shooter: 3
        },

        asteroids: {
            count: 5
        },

        blackHoles: {
            count: 2
        }
    }
]
