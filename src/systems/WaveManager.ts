import { WAVE_CONFIGS } from '../config/gameplay/waves'
import type { WaveConfig } from '../config/gameplay/waves'

export class WaveManager {

    private currentWave: number = 1

    constructor() {}

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
