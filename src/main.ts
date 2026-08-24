import Phaser from 'phaser'

import { BootScene } from './scenes/BootScene'
import { GameScene } from './scenes/GameScene'

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,

    width: 1280,
    height: 720,

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },

    backgroundColor: '#050816',

    scene: [
        BootScene,
        GameScene
    ]
}

new Phaser.Game(config)