import { Scene, GameObjects } from 'phaser';

export class HUD extends Scene {
    private incomeText: GameObjects.Text;
    private cityCountText: GameObjects.Text;
    private currentIncome: number;
    private cityCount: number;

    constructor() {
        super('HUD');
        this.currentIncome = 0;
        this.cityCount = 0;
    }

    create() {
        this.incomeText = this.add.text(16, 16, `Income: $${this.currentIncome}`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
        });

        this.cityCountText = this.add.text(16, 50, `Cities: ${this.cityCount}`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
        });
    }

    updateIncome(amount: number) {
        this.currentIncome += amount;
        this.incomeText.setText(`Income: $${this.currentIncome}`);
    }

    updateCityCount(count: number) {
        this.cityCount = count;
        this.cityCountText.setText(`Cities: ${this.cityCount}`);
    }
}