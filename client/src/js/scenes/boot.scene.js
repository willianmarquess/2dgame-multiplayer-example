import ProgressText from "../gameObjects/progress-text.game-object.js";

export default class Boot extends Phaser.Scene{

    constructor(){
        super('boot');
    }

    preload(){

        const progressText = new ProgressText(this, 600, 500);
        progressText.setOrigin(0.5, 0.5);
		progressText.text = "0%";
		progressText.setStyle({ "fontSize": "60px" });

        this.load.spritesheet('player', 'assets/player/player-sprite-sheet.png', { frameWidth: 96, frameHeight: 96 });
        this.load.spritesheet('blood', 'assets/effects/blood/blood.png', { frameWidth: 110, frameHeight: 96 });

        this.load.image('bullet', 'assets/bullet/bullet.png');

        this.load.image('up-button', 'assets/ui-button/up.png');
        this.load.image('left-button', 'assets/ui-button/left.png');
        this.load.image('right-button', 'assets/ui-button/right.png');
        this.load.image('down-button', 'assets/ui-button/down.png');
        this.load.image('fire-button', 'assets/ui-button/fire.png');

        this.load.image('hp0', 'assets/item/HP0.png');
        this.load.image('hp1', 'assets/item/HP1.png');
        this.load.image('hp2', 'assets/item/HP2.png');
        this.load.image('hp3', 'assets/item/HP3.png');

        this.load.image('tiles', 'assets/map/tileset.png');
        this.load.tilemapTiledJSON('mapa1', 'assets/map/mapa1.json');
    }

    create(){
        
        this.anims.create({
            key: 'player_idle',
            frames: this.anims.generateFrameNumbers('player', { start: 8, end: 9 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'player_run',
            frames: this.anims.generateFrameNumbers('player', { start: 24, end: 26 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'player_reload',
            frames: this.anims.generateFrameNumbers('player', { start: 16, end: 20 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'player_fire',
            frames: this.anims.generateFrameNumbers('player', { start: 32, end: 35 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'player_dead',
            frames: this.anims.generateFrameNumbers('player', { start: 40, end: 45 }),
            frameRate: 5,
            repeat: 0
        });

        this.anims.create({
            key: 'potion',
            frames: [
                { key: 'hp0' },
                { key: 'hp1' },
                { key: 'hp2' },
                { key: 'hp3' }
            ],
            frameRate: 7,
            repeat: -1
        });

        this.anims.create({
            key: 'blood_effect',
            frames: this.anims.generateFrameNumbers('blood', { start: 0, end: 8 }),
            frameRate: 20,
            repeat: 0
        });

        this.scene.start('play-game');

    }
}