import PlayerDTO from "../dto/player.dto.js";
import Bullet from "../gameObjects/bullet.game-object.js";
import Effect from "../gameObjects/effect.game-object.js";
import HealthBar from "../gameObjects/health-bar.game-object.js";
import Item from "../gameObjects/item.game-object.js";
import NameText from "../gameObjects/name-text.game-object.js";
import Player from "../gameObjects/player.game-object.js";
import UiButton from "../gameObjects/ui-button.game-object.js";

export default class PlayGame extends Phaser.Scene{
    
    player;
    nameText;
    healthBar;
    cursors;
    playerLayer;
    uiLayer;
    uiButtons = [];
    obstacles;
    items = [];
    otherPlayers = [];

    socketIo;

    constructor(){
        super('play-game');
    }

    init(){
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
    }

    create(){

        this.socketIo = io('http://localhost:3333');

        const tilemap = this.make.tilemap({ key: 'mapa1' });
        const tileset = tilemap.addTilesetImage('tileset', 'tiles');
        tilemap.createLayer('background', tileset);
        tilemap.createLayer('cenario', tileset);
        const objectsLayerMap = tilemap.getObjectLayer('obs');
        const itemsLayerMap = tilemap.getObjectLayer('items');

        this.obstacles = this.physics.add.staticGroup();

        objectsLayerMap.objects.forEach(object => {
            const { x, y, name, width, height } = object;
            const rect = this.add.rectangle(x, y, width, height).setOrigin(0);
            this.obstacles.add(rect);
        });

        this.items = this.physics.add.group({
            classType: Item,
            defaultKey: 'item',
            runChildUpdate: true,
            maxSize: -1,
            allowGravity: false
        })

        itemsLayerMap.objects.forEach(object => {
            const { x, y, name } = object;

            switch (name) {
                case 'potion_hp':
                    const potion = this.items.get(x, y, 'hp0');
                    Item.configurePotionHp(potion);
                    break;
            }

        });

        this.playerLayer = this.add.layer();
        this.player = new Player(this, 100, 100, 'player', 1000);
        this.playerLayer.add(this.player);
        this.physics.add.collider(this.obstacles, this.player);
        this.physics.add.collider(this.obstacles, this.player);
        this.physics.add.collider(this.items, this.player, (player, item) => {
            item.doEffect(player);
            item.destroy();
        });

        this.uiLayer = this.add.layer();
        const upButton = new UiButton(this, 150, 450, 'up-button', this.player, 'up');
        const downButton = new UiButton(this, 150, 580, 'down-button', this.player, 'down');
        const rightButton = new UiButton(this, 215, 515, 'right-button', this.player, 'right');
        const leftButton = new UiButton(this, 85, 515, 'left-button', this.player, 'left');
        const fireButton = new UiButton(this, 1000, 515, 'fire-button', this.player, 'fire');
        this.uiButtons.push(...[upButton, downButton, rightButton, leftButton, fireButton]);

        this.nameText = new NameText(this, this.player);
        this.healthBar = new HealthBar(this, this.player);

        this.uiLayer.add(upButton);
        this.uiLayer.add(downButton);
        this.uiLayer.add(rightButton);
        this.uiLayer.add(leftButton);
        this.uiLayer.add(this.nameText);
        this.uiLayer.add(this.healthBar);

        //new Effect(this, 200, 200, 'blood');
        //new Bullet(this, 500, 500, 'bullet');

        this.physics.world.setBounds(0, 0, 2880, 2880);
        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setBounds(0, 0, 2880, 2880, true);

        this.socketIo.emit('player-start', new PlayerDTO(this.player, this.player.getCurrentAnimation(), this.player.flipX));
        
        this.socketIo.on('current-players', players => {
            console.log(players);
            Object.keys(players).forEach(k => {
                if(players[k].id === this.socketIo.id) return;
                const otherPlayer = this.createOtherPlayer(players[k]);
                this.otherPlayers.push(otherPlayer);
            });
        });

        this.socketIo.on('new-player', player => {
            if(player.id === this.socketIo.id) return;
            const playerExists = this.otherPlayers.find(p => p.id === player.id);
            if(playerExists){
                console.log('player ja existe', playerExists);
            }
            console.log('new player', player);
            const otherPlayer = this.createOtherPlayer(player);
            this.otherPlayers.push(otherPlayer);
        });

        this.socketIo.on('player-moved', player => {
            const otherPlayerindex = this.otherPlayers.findIndex(player =>  player.id === player.id);
            const otherPlayer = this.otherPlayers[otherPlayerindex];
            if(otherPlayer){
                otherPlayer.x = player.instance.gameObject.x;
                otherPlayer.y = player.instance.gameObject.y;
                otherPlayer.anims.play(player.instance.currentAnimation, true);
                otherPlayer.flipX = player.instance.flipX;
            }
            this.otherPlayers[otherPlayerindex] = otherPlayer;
        });

        this.socketIo.on('player-disconnected', playerId => {
            if(playerId === this.socketIo.id) return;
            const otherPlayerindex = this.otherPlayers.findIndex(player =>  player.id === playerId);
            const otherPlayer = this.otherPlayers[otherPlayerindex];
            if(otherPlayer){
                otherPlayer.destroy();
                this.otherPlayers.splice(otherPlayerindex, 1);
            }
        });
    }

    update(time, deltaTime) {
        if (this.player) this.player.update(time, deltaTime);

        if(this.nameText) this.nameText.update(time, deltaTime);

        if(this.healthBar) this.healthBar.update(time, deltaTime);

        if(this.uiButtons.length > 0){
            this.uiButtons.forEach(button => {
                button.update(time, deltaTime);
            });
        }

        this.player.decreaseHp(1);
    }

    createOtherPlayer(player){
        const playerSprite = this.physics.add.sprite(player.instance.gameObject.x, player.instance.gameObject.y, `player${player.id}`);
        playerSprite.setScale(player.instance.gameObject.scale.x, player.instance.gameObject.scale.y);
        playerSprite.id = player.id;
        playerSprite.anims.play(player.instance.currentAnimation, true);
        return playerSprite;
    }
}