class StartScene extends Phaser.Scene{
	constructor(){
		super('Start');
	}
	preload () {
		
	}
	create (data) {
		this.createBackground();
		if(data.score !== undefined) {
			this.createStats(data);
			this.createText('white');
		}else {
			this.createText();
		}
	
		this.input.keyboard.on('keydown-SPACE', this.onTextClick, this);
        this.input.keyboard.on('keydown-ENTER', this.onTextClick, this);
	}
	createStats(data){
		this.add.graphics()
		.fillStyle(0x000000, .5)
		.fillRoundedRect(config.width / 2 - 200, config.height / 2 - 200, 400, 400);

		const textTitle = data.completed ? 'You Win' : 'You Lose';
		const textScore = 'Score: ' + data.score;
		const textStyle = { fontSize: '46px', fontFamily: 'Lato', fontStyle: 'bold', fill: 'white' };

		this.textTitle = this.add.text(config.width / 2, config.height / 2 - 100, textTitle, textStyle).setOrigin(0.5); 
		this.textScore = this.add.text(config.width / 2, config.height / 2 - 20, textScore, textStyle).setOrigin(0.5);
	}
	createBackground(){
		this.add.image(0, 0, 'background').setOrigin(0, 0);
		const background = this.add.image(0, 0, 'background').setOrigin(0, 0);

		// Смещаем изображение ближе к низу
		const offsetY = config.height - background.height;
		background.setY(offsetY > 0 ? offsetY : 0); // Устанавливаем смещение, если оно положительное
	}
	createText (color = 'black') {
		this.text = this.add.text(config.width / 2, config.height / 2, 'Tab to Start', 
			{ fontSize: '46px', fontFamily: 'Lato', fontStyle: 'bold', fill: color }).setOrigin(0.5, -1);
		this.text.setInteractive();
		this.text.on('pointerdown', this.onTextClick, this);
	}
	onTextClick(pointer, text) {
		this.scene.start('Game');
	}
}