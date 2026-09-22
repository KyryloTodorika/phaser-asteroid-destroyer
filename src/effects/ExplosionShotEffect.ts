import Phaser from 'phaser'
import { SUPER_SHOT_CONFIG } from '../config/gameplay/weapons'

export function playExplosionShotEffect(
    scene: Phaser.Scene,
    x: number,
    y: number
) {
    const config = SUPER_SHOT_CONFIG.explosion
    const effect = scene.add.image(x, y, 'supershot_icon_explosion')
        .setDepth(31)
        .setBlendMode(Phaser.BlendModes.ADD)
    const targetScale = config.effectDisplaySize
        / Math.max(effect.width, effect.height)

    effect.setScale(targetScale * 0.12)

    const shockwave = scene.add.circle(
        x,
        y,
        config.blastRadius,
        0x28cfff,
        0.18
    )
        .setStrokeStyle(6, 0xc8fbff, 0.9)
        .setScale(0.12)
        .setDepth(30)

    scene.tweens.add({
        targets: effect,
        scale: targetScale,
        alpha: 0,
        angle: 20,
        duration: config.effectDurationMs,
        ease: 'Cubic.Out',
        onComplete: () => effect.destroy()
    })

    scene.tweens.add({
        targets: shockwave,
        scale: 1,
        alpha: 0,
        duration: config.effectDurationMs,
        ease: 'Quad.Out',
        onComplete: () => shockwave.destroy()
    })
}
