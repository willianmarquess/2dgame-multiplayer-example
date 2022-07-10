export default class HealthBar extends Phaser.GameObjects.Graphics{

    player;
    width;
    height;
    Fillwidth;
    FillHeight;
    originalValue;
    value;

    constructor(scene, player){
        super(scene);
        this.scene.add.existing(this);
        this.player = player; 
        this.init();
    }

    init(){
        this.width = 80;
        this.height = 12;
        this.Fillwidth = this.width - 3;
        this.FillHeight = this.height - 3;
        this.originalValue = this.value = this.player.hp;
    }


    update(time, deltaTime){

        if(this.player.stateMachine.isCurrentState('dead')) return;

        this.clear();

        this.value = this.player.hp;

        const x = this.player.getCenterX() - (this.width / 2);
        const y = this.player.body.position.y - 20;

        //desenha um retangulo preto de fundo (simula uma borda)
        this.fillStyle(0x000000);
        this.fillRect(x, y, this.width, this.height);
        //desenha um retangulo branco simulando a barra branca de fundo
        this.fillStyle(0xffffff);
        this.fillRect(x + 2, y + 2, this.Fillwidth, this.FillHeight);

        //calcula a porcentagem do hp * o valor da largura do preenchimento
        const fillValue = Math.floor((this.value/this.originalValue) * this.Fillwidth);
        //preenchimento da barra
        this.fillStyle(0xff0000);
        this.fillRect(x + 2, y + 2, fillValue, this.FillHeight);

    }
}