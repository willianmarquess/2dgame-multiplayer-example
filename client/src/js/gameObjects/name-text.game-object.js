export default class NameText extends Phaser.GameObjects.Text{

    player;

    constructor(scene, player, namePlayer = 'Thespian'){
        super(scene, 0, 0);
        this.scene = scene;
        this.scene.add.existing(this);
        this.player = player; 
        this.text = namePlayer;
    }

    update(time, deltaTime){
        if(this.player.stateMachine.isCurrentState('dead')) return;
        this.y = (this.player.body.position.y - 40);
        this.x = this.player.getCenterX() - (this.width / 2);
    }
}