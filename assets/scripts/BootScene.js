class BootScene extends Phaser.Scene{
	constructor(){
		super('Boot');
	}
	preload () {
		this.load.image('background', 'assets/images/background.png');
		this.load.image('bg', 'assets/images/bg720.jpg');
	}
	create () {
		this.scene.start('Preload');
	}

}