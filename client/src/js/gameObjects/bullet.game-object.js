export default class Bullet extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        this.scene.add.existing(this);
    }

    update(time, deltaTime){

    }
}