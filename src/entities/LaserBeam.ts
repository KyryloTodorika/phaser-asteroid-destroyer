import Phaser from 'phaser'

export class LaserBeam extends Phaser.Physics.Arcade.Sprite {
    private readonly damage: number = 80
    private readonly hitTargets = new Set<Phaser.GameObjects.GameObject>()

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        direction: Phaser.Math.Vector2
    ) {
        super(scene, x, y, 'laser_beam')

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.setDisplaySize(300, 71)
        this.setRotation(direction.angle())
        this.setDepth(20)

        const body = this.body as Phaser.Physics.Arcade.Body

        body.setSize(this.width * 0.86, this.height * 0.55)
        body.setVelocity(direction.x * 900, direction.y * 900)

        scene.time.delayedCall(900, () => {
            if (this.active) {
                this.destroy()
            }
        })
    }

    hit(target: Phaser.GameObjects.GameObject): number {
        if (this.hitTargets.has(target)) {
            return 0
        }

        this.hitTargets.add(target)

        return this.damage
    }
}
