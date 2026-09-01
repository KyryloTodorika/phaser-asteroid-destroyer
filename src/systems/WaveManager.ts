import Phaser from 'phaser'
import { WAVE_CONFIGS } from '../data/waves'
import type { WaveConfig } from '../data/waves'

export class WaveManager {

    private scene: Phaser.Scene

    private currentWave: number = 1

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    getCurrentWave(): number {
        return this.currentWave
    }

    getCurrentConfig(): WaveConfig | undefined {
        return WAVE_CONFIGS.find(
            config => config.wave === this.currentWave
        )
    }

    hasNextWave(): boolean {
        return this.currentWave < WAVE_CONFIGS.length
    }

    nextWave(): boolean {

        if (!this.hasNextWave()) {
            return false
        }

        this.currentWave++

        return true
    }

    reset() {
        this.currentWave = 1
    }
}