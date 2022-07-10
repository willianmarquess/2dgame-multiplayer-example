export default class PlayerDTO{
    gameObject;
    currentAnimation;
    flipX;

    constructor(gameObject, currentAnimation, flipX){
        this.gameObject = gameObject;
        this.currentAnimation = currentAnimation;
        this.flipX = flipX;
    }
}