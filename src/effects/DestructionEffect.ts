import Phaser from 'phaser'
import { DESTRUCTION_SFX_CONFIG } from '../config/gameplay/audio'

export type DestructionEffectType = 'asteroid' | 'alien' | 'boss' | 'player'

const EFFECT_SETTINGS = {
    asteroid: {
        texture: 'asteroid_destruction',
        displaySize: 180,
        durationMs: 480,
        shockwaveColor: 0xffa33a,
        depth: 30
    },
    alien: {
        texture: 'alien_destruction',
        displaySize: 190,
        durationMs: 560,
        shockwaveColor: 0x54e7ff,
        depth: 30
    },
    boss: {
        texture: 'boss_destruction',
        displaySize: 680,
        durationMs: 1500,
        shockwaveColor: 0x7cff55,
        depth: 300
    },
    player: {
        texture: 'player_destruction',
        displaySize: 240,
        durationMs: 900,
        shockwaveColor: 0x54e7ff,
        depth: 300
    }
} as const satisfies Record<DestructionEffectType, {
    texture: string
    displaySize: number
    durationMs: number
    shockwaveColor: number
    depth: number
}>

export function playDestructionEffect(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: DestructionEffectType
) {
    const settings = EFFECT_SETTINGS[type]

    scene.sound.play(DESTRUCTION_SFX_CONFIG.key, {
        volume: DESTRUCTION_SFX_CONFIG.volume[type]
    })

    const effect = scene.add.image(x, y, settings.texture)
        .setDepth(settings.depth)
    const baseScale = settings.displaySize / Math.max(effect.width, effect.height)

    effect.setScale(baseScale * 0.18)

    const shockwave = scene.add.circle(
        x,
        y,
        settings.displaySize * 0.17
    )
        .setStrokeStyle(
            type === 'boss' ? 9 : 5,
            settings.shockwaveColor,
            0.9
        )
        .setScale(0.25)
        .setDepth(settings.depth - 1)

    scene.tweens.add({
        targets: effect,
        scale: baseScale * (type === 'boss' ? 1.1 : 1),
        alpha: 0,
        rotation: Phaser.Math.FloatBetween(-0.22, 0.22),
        duration: settings.durationMs,
        ease: 'Cubic.Out',
        onComplete: () => effect.destroy()
    })

    scene.tweens.add({
        targets: shockwave,
        scale: type === 'boss' ? 3.2 : 2.4,
        alpha: 0,
        duration: Math.round(settings.durationMs * 0.72),
        ease: 'Quad.Out',
        onComplete: () => shockwave.destroy()
    })

    return settings.durationMs
}
