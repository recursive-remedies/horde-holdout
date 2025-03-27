import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        // Load essential assets for the game
        this.load.image('city', 'assets/images/city.png');
        this.load.audio('trainSound', 'assets/audio/train.mp3');
        this.load.image('track', 'assets/images/track.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}