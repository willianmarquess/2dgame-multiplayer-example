export default class UiButton extends Phaser.GameObjects.Image{

    player;
    action;

    constructor(scene, x, y, texture, player, action){
        super(scene, x, y, texture);
        this.scene = scene;
        this.scene.add.existing(this);
        this.player = player;
        this.action = action;

        this.setScrollFactor(0);
        this.setInteractive();
    }

    update(time, deltaTime){

        const input = this.scene.input;

		if (!input.activePointer.isDown) {
			return;
		}

        const objects = input.hitTestPointer(input.activePointer);
        
		if (objects.indexOf(this) >= 0) {
            switch (this.action) {
                case 'up':
                    this.player.setState('run');
                    this.player.setCommand('up');
                    break;
                case 'down':
                    this.player.setState('run');
                    this.player.setCommand('down');
                    break;
                case 'left':
                    this.player.setState('run');
                    this.player.setCommand('left');
                    break;
                case 'right':
                    this.player.setState('run');
                    this.player.setCommand('right');
                    break;
                case 'fire':
                    this.player.setState('shooting');
                    this.player.setCommand('fire');
                    break;
            }
		}	
    }
}