class PreloadScene extends Phaser.Scene{
	constructor(){
		super('Preload');
	}
	preload () {
		this.load.image('bullet', 'assets/sprites/bullet.png');
		this.load.image('fire', 'assets/sprites/fire.png');
		this.load.atlas('dragon', 'assets/sprites/dragon.png', 'assets/sprites/dragon.json');
		this.load.atlas('enemy', 'assets/sprites/enemy.png', 'assets/sprites/enemy.json');
		this.load.atlas('bloom', 'assets/sprites/bloom.png', 'assets/sprites/bloom.json');
		
		this.load.audio('win', 'assets/sounds/win.mp3');
		this.load.audio('lose', 'assets/sounds/lose.mp3');
		this.load.audio('bloom', 'assets/sounds/bloom.mp3');
		this.load.audio('dragon', 'assets/sounds/dragon.mp3');
		this.load.audio('theme', 'assets/sounds/SilentParadox.mp3'); 
	}
	create () {
		this.scene.start('Start');
	}

}