export default class ProgressText extends Phaser.GameObjects.Text{

    constructor(scene, x, y){
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);

        this.scene.load.on(Phaser.Loader.Events.PROGRESS, (p) => {
			this.text = Math.floor(p * 100) + "%";
		});
    }
}