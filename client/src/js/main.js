import Boot from "./scenes/boot.scene.js";
import PlayGame from "./scenes/play-game.scene.js";

window.addEventListener('load', function () {
	new Phaser.Game({
		width: 1133,
		height: 640,
		type: Phaser.AUTO,
		backgroundColor: "#242424",
		physics: {
			default: "arcade",
			arcade: {
				debug: false
			}
		},
		scene: [Boot, PlayGame],
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH
		}
	});
});