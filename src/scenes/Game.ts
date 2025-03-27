import { Scene, GameObjects, Input } from 'phaser';

type City = { 
    x: number, 
    y: number, 
    population: number, 
    destination?: City, 
    label?: GameObjects.Text 
};

export class Game extends Scene {
    cities: City[] = [];
    tracks: { start: { x: number, y: number }, end: { x: number, y: number } }[] = [];
    income: number = 0;
    incomeText: GameObjects.Text;
    timerText: GameObjects.Text;
    remainingTime: number = 60;

    constructor() {
        super('Game');
    }

    create() {
        // Create cities and display population labels
        this.generateCities();
        
        // Income UI and timer for build phase
        this.incomeText = this.add.text(16, 16, `Income: $${this.income}`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        });
        this.timerText = this.add.text(800, 16, `Time: ${this.remainingTime}`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ff0000'
        });

        // Build phase: 60-second countdown with track drawing as before.
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.remainingTime--;
                this.timerText.setText(`Time: ${this.remainingTime}`);
                if (this.remainingTime <= 0) {
                    // End build phase and start simulation phase.
                    this.input.removeAllListeners();
                    this.time.removeAllEvents();
                    this.startSimulation();
                }
            },
            callbackScope: this,
            loop: true
        });

        // Handle pointer events for drawing a track (build phase)
        this.input.on('pointerdown', (pointer: Input.Pointer) => {
            const city = this.getCityAt(pointer.x, pointer.y);
            if (city) {
                this.startDrawingTrack(city);
            }
        });
    }

    generateCities() {
        // Generate 10 cities with random population and position.
        for (let i = 0; i < 10; i++) {
            const x = Phaser.Math.Between(100, 900);
            const y = Phaser.Math.Between(100, 600);
            const population = Phaser.Math.Between(100, 1000);
            const city: City = { x, y, population };
            this.cities.push(city);
            // Draw city circle and label for population.
            this.add.circle(x, y, 20, 0x0000ff);
            city.label = this.add.text(x, y - 30, `Pop: ${population}`, {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);
        }
        // After all cities are generated, assign each a random destination (not itself)
        this.cities.forEach((city, index) => {
            let destination: City;
            do {
                destination = this.cities[Phaser.Math.Between(0, this.cities.length - 1)];
            } while (destination === city);
            city.destination = destination;
            // Optionally add a small marker or text for destination next to the city.
            this.add.text(city.x, city.y + 30, `→ (${destination.x},${destination.y})`, {
                fontFamily: 'Arial',
                fontSize: '12px',
                color: '#ffff00',
                align: 'center'
            }).setOrigin(0.5);
        });
    }

    getCityAt(x: number, y: number) {
        return this.cities.find(city => {
            const distance = Phaser.Math.Distance.Between(x, y, city.x, city.y);
            return distance < 20; // Click within city radius.
        });
    }

    startDrawingTrack(startCity: City) {
        const track = { start: { x: startCity.x, y: startCity.y }, end: { x: startCity.x, y: startCity.y } };
        this.tracks.push(track);

        const pointerMoveHandler = (pointer: Input.Pointer) => {
            track.end.x = pointer.x;
            track.end.y = pointer.y;
            this.drawTracks();
        };

        this.input.on('pointermove', pointerMoveHandler);

        this.input.once('pointerup', () => {
            this.input.off('pointermove', pointerMoveHandler);
            this.finalizeTrack(track);
        });
    }

    drawTracks() {
        // Clear and redraw cities and tracks
        this.cameras.main.clear();
        this.cities.forEach(city => {
            // Redraw city circle and label
            this.add.circle(city.x, city.y, 20, 0x0000ff);
            if (city.label) {
                this.add.text(city.x, city.y - 30, `Pop: ${city.population}`, {
                    fontFamily: 'Arial',
                    fontSize: '16px',
                    color: '#ffffff',
                    align: 'center'
                }).setOrigin(0.5);
            }
        });
        this.tracks.forEach(track => {
            this.add.line(0, 0, track.start.x, track.start.y, track.end.x, track.end.y, 0xff0000);
        });
    }

    finalizeTrack(track: { start: { x: number, y: number }, end: { x: number, y: number } }) {
        const endCity = this.getCityAt(track.end.x, track.end.y);
        if (endCity) {
            this.simulateTrain(track.start, endCity); // simulate drawing effect during build phase
        } else {
            this.tracks = this.tracks.filter(t => t !== track);
            this.drawTracks();
        }
    }

    startSimulation() {
        // Begin 10-second simulation phase.
        // Spawn a train from each city to its destination.
        this.cities.forEach(city => {
            if (city.destination) {
                this.simulateTrain({ x: city.x, y: city.y }, { x: city.destination.x, y: city.destination.y }, true);
            }
        });
        // End simulation after 10 seconds and go to GameOver.
        this.time.delayedCall(10000, () => {
            this.scene.start('GameOver', { finalScore: this.income });
        });
    }

    // Modified simulateTrain optionally for simulation phase (simulate=true)
    simulateTrain(
        start: { x: number, y: number }, 
        end: { x: number, y: number },
        simulate: boolean = false
    ) {
        // Draw a permanent line between start and end for simulation visual.
        if (simulate) {
            this.add.line(0, 0, start.x, start.y, end.x, end.y, 0xff0000).setLineWidth(2);
        }
        // Create train representation.
        const train = this.add.circle(start.x, start.y, 7, 0xffff00);
        // Determine passenger bonus.
        const passengerBonus = Phaser.Math.Between(10, 50);
        // For simulation, use a fixed duration (e.g., 2000 ms)
        const duration = simulate ? 2000 : Phaser.Math.Distance.Between(start.x, start.y, end.x, end.y) * 5;
        this.tweens.add({
            targets: train,
            x: end.x,
            y: end.y,
            duration: duration,
            onComplete: () => {
                train.destroy();
                // Increase income based on bonus.
                this.income += passengerBonus * 5;
                this.incomeText.setText(`Income: $${this.income}`);
                // Show passenger bonus text that fades.
                const bonusText = this.add.text(end.x, end.y - 20, `+${passengerBonus * 5}`, {
                    fontFamily: 'Arial',
                    fontSize: '16px',
                    color: '#00ff00'
                }).setOrigin(0.5);
                this.tweens.add({
                    targets: bonusText,
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => bonusText.destroy()
                });
            }
        });
    }
}