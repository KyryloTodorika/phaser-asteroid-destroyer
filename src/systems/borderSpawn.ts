import Phaser from 'phaser'

interface SpawnExclusion {
    x: number
    y: number
    minDistance: number
}

/** Returns a random point on one of the four Arcade world borders. */
export function getBorderSpawnPosition(
    scene: Phaser.Scene,
    exclusions: SpawnExclusion[] = [],
    maxAttempts: number = 30
): Phaser.Math.Vector2 {
    const bounds = scene.physics.world.bounds
    const position = new Phaser.Math.Vector2(bounds.left, bounds.top)

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const edge = Phaser.Math.Between(0, 3)

        if (edge === 0 || edge === 1) {
            position.set(
                edge === 0 ? bounds.left : bounds.right,
                Phaser.Math.Between(bounds.top, bounds.bottom)
            )
        } else {
            position.set(
                Phaser.Math.Between(bounds.left, bounds.right),
                edge === 2 ? bounds.top : bounds.bottom
            )
        }

        const isValid = exclusions.every(exclusion =>
            Phaser.Math.Distance.Between(
                position.x,
                position.y,
                exclusion.x,
                exclusion.y
            ) >= exclusion.minDistance
        )

        if (isValid) {
            break
        }
    }

    return position
}
