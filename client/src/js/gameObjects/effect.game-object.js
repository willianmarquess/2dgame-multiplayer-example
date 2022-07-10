export default class Effect extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y, effectType){
        super(scene, x, y, null);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        switch (effectType) {
            case 'blood':
                this.anims.play('blood_effect');
                break;
        }

        this.on('animationcomplete', () => {
            this.destroy();
        });
    }

    update(time, deltaTime){

    }
}