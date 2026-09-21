export const BACKGROUND_MUSIC_CONFIG = {
    key: 'background_music',
    volume: 0.2,
    loop: true
} as const

export const PLAYER_SHOOT_SFX_CONFIG = {
    key: 'player_shoot',
    volume: 0.3
} as const

export const LASER_BEAM_SFX_CONFIG = {
    key: 'laser_beam_sound',
    volume: 0.45
} as const

export const DESTRUCTION_SFX_CONFIG = {
    key: 'destruction',
    volume: {
        asteroid: 0.4,
        alien: 0.4,
        boss: 0.5,
        player: 0.5
    }
} as const
