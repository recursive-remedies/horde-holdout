import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.text(512, 384, 'Loading...', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        const progressBar = this.add.rectangle(512, 450, 400, 20, 0xffffff);
        const progressBarBackground = this.add.rectangle(512, 450, 400, 20, 0x000000);
        progressBarBackground.setOrigin(0.5);
        progressBar.setOrigin(0.5);

        this.load.on('progress', (progress: number) => {
            progressBar.width = 400 * progress;
        });
    }

    preload ()
    {
        this.load.setPath('assets/images');
        this.load.image('city', 'city.png'); // Example asset
        this.load.image('track', 'track.png'); // Example asset

        this.load.setPath('assets/audio');
        this.load.audio('backgroundMusic', 'background.mp3'); // Example audio
    }

    create ()
    {
        this.scene.start('MainMenu');
    }
}