export default class Item extends Phaser.Physics.Arcade.Sprite{

    effect;
    value;

    constructor(scene, x, y, texture, effect, value){
        super(scene, x, y, texture);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.value = value;
        this.effect = effect;
    }

    update(time, deltaTime){

    }

    doEffect(target){
        switch (this.effect) {
            case 'potion_hp':
                target.increaseHp(this.value);
                break;
        }
    }

    static configurePotionHp(potion){
        potion.effect = 'potion_hp';
        potion.value = 200;
        potion.setScale(0.5);
        const width = potion.width * 0.3;
        const height = potion.height * 0.3;
        potion.body.setSize(width, height);
        potion.body.setOffset(width + (width * 0.15), potion.height * 0.7);
        potion.anims.play('potion', true);
        return potion;
    }
}