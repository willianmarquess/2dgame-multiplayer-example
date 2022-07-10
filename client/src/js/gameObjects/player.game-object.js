import PlayerDTO from "../dto/player.dto.js";
import StateMachine from "../util/state-machine.util.js";

const PLAYER_CONFIG = {
    WIDTH: 50,
    HEIGHT: 55
}


export default class Player extends Phaser.Physics.Arcade.Sprite{

    stateMachine;
    speedX;
    speedY;
    command;
    hp;
    maxHp;
    defaultX;
    defaultY;
    
    constructor(scene, x, y, texture, hp){
        super(scene, x, y, texture,);
        this.hp = this.maxHp = hp;
        this.defaultX = x;
        this.defaultY = y;
        this.setScale(1.2);
        this.configPlayer();
        this.initVariables();
    }

    configPlayer(){
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setSize(PLAYER_CONFIG.WIDTH, PLAYER_CONFIG.HEIGHT);
        this.body.setOffset((this.body.center.x - PLAYER_CONFIG.WIDTH), (this.body.center.y / 2));
    }

    initVariables() {
        this.speedX = 150;
        this.speedY = 120;

        this.stateMachine = new StateMachine(this, 'player');
        this.stateMachine
        .addState('idle', { onEnter: this.idleOnEnter, onUpdate: this.idleOnUpdate })
        .addState('run', { onEnter: this.runOnEnter, onUpdate: this.runOnUpdate })
        .addState('shooting', { onEnter: this.shootingOnEnter, onUpdate: this.shootingOnUpdate })
        .addState('dead', { onEnter: this.deadOnEnter })
        .setState('idle');
    }

    increaseHp(amount){
        this.hp += amount;

        if(this.hp > this.maxHp){
            this.hp = this.maxHp;
        }
    }

    decreaseHp(amount){
        this.hp -= amount;

        if(this.hp < 0)
        
        {
            this.hp = 0;
            this.stateMachine.setState('dead')

        }
    }

    update(time, deltaTime){
        this.stateMachine.update(deltaTime);

        

        this.scene.socketIo.emit('player-movement', new PlayerDTO(this, this.anims.currentAnim.key, this.flipX));
    }

    idleOnEnter(){
        this.anims.play('player_idle', true);
    }

    idleOnUpdate(dt){
        if (this.scene.cursors.right.isDown || this.scene.cursors.left.isDown || this.scene.cursors.up.isDown || this.scene.cursors.down.isDown) {
            this.stateMachine.setState('run');
            return;
        }
        if (this.scene.cursors.space.isDown || this.command === 'fire') {
            this.stateMachine.setState('shooting');
            return;
        }
    }

    runOnEnter(){
        this.anims.play('player_run', true);
    }

    runOnUpdate(dt){

        if (this.scene.cursors.right.isDown && this.scene.cursors.down.isDown) {
            this.setVelocityX(this.speedX);
            this.setVelocityY(this.speedY);
            this.flipX = false;
            return;
        }
        if (this.scene.cursors.right.isDown && this.scene.cursors.up.isDown) {
            this.setVelocityX(this.speedX);
            this.setVelocityY(-this.speedY);
            this.flipX = false;
            return;
        }
        
        if (this.scene.cursors.left.isDown && this.scene.cursors.down.isDown) {
            this.setVelocityX(-this.speedX);
            this.setVelocityY(this.speedY);
            this.flipX = true;
            return;
        }
        if (this.scene.cursors.left.isDown && this.scene.cursors.up.isDown) {
            this.setVelocityX(-this.speedX);
            this.setVelocityY(-this.speedY);
            this.flipX = true;
            return;
        }

        if (this.scene.cursors.right.isDown || this.command === 'right') {
            this.setVelocityX(this.speedX);
            this.setVelocityY(0);
            this.flipX = false;
            this.command = null;
            return;
        } 
        if (this.scene.cursors.left.isDown || this.command === 'left') {
            this.setVelocityX(-this.speedX);
            this.setVelocityY(0);
            this.flipX = true;
            this.command = null;
            return;
        }
        if (this.scene.cursors.up.isDown || this.command === 'up') {
            this.setVelocityY(-this.speedY);
            this.setVelocityX(0);
            this.command = null;
            return;
        }
        if (this.scene.cursors.down.isDown || this.command === 'down') {
            this.setVelocityY(this.speedY);
            this.setVelocityX(0);
            this.command = null;
            return;
        }
        if (this.scene.cursors.space.isDown || this.command === 'fire') {
            this.stateMachine.setState('shooting');
            return;
        }

        this.setVelocityX(0);
        this.setVelocityY(0);
        this.stateMachine.setState('idle');
    }

    shootingOnEnter(){
        this.anims.play('player_fire', true);
    }

    shootingOnUpdate(dt){
        if (this.scene.cursors.space.isDown || this.command === 'fire') {
            this.setVelocityX(0);
            this.setVelocityY(0);
            this.command = null;
            return;
        }
        if (this.scene.cursors.up.isDown || this.command === 'up' 
            || this.scene.cursors.down.isDown || this.command === 'down'
            || this.scene.cursors.left.isDown || this.command === 'left'
            || this.scene.cursors.right.isDown || this.command === 'right') {
            this.stateMachine.setState('run');
            return;
        }

        this.stateMachine.setState('idle');
    }

    deadOnEnter(){
        this.setVelocityX(0);
        this.setVelocityY(0);
        this.anims.play('player_dead', true);
        this.on('animationcomplete', () => {
            this.reset();
        });
    }

    reset(){
        this.setPosition(this.defaultX, this.defaultY);
        this.hp = this.maxHp;
        this.stateMachine.setState('idle');
    }

    setCommand(command){
        this.command = command;
    }

    setState(state){
        this.stateMachine.setState(state);
    }

    getCenterX(){
        return (this.body.position.x + (this.body.width / 2));
    }

    getCurrentAnimation(){
        return this.anims.currentAnim.key;
    }
}