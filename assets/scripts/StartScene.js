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
	    // Относительные размеры окна
	    const boxWidth = config.screenWidth * 0.8;
	    const boxHeight = config.screenHeight * 0.4;
	    const boxX = (config.screenWidth - boxWidth) / 2;
	    const boxY = (config.screenHeight - boxHeight) / 2;

	    this.add.graphics()
	        .fillStyle(0x000000, .5)
	        .fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 20);

	    const textTitle = data.completed ? 'You Win' : 'You Lose';
	    const textScore = 'Score: ' + data.score;
	    const textStyle = { fontSize: Math.round(config.screenHeight * 0.06) + 'px', fontFamily: 'Lato', fontStyle: 'bold', fill: 'white' };

	    this.textTitle = this.add.text(config.screenWidth / 2, boxY + boxHeight * 0.15, textTitle, textStyle).setOrigin(0.5);
	    this.textScore = this.add.text(config.screenWidth / 2, boxY + boxHeight * 0.5, textScore, textStyle).setOrigin(0.5);
	}
	createBackground(){
		const background = this.add.image(0, 0, 'background').setOrigin(0, 0);

		// Масштабируем фон, чтобы он соответствовал ширине экрана
		background.setDisplaySize(config.screenWidth, background.height * (config.screenWidth / background.width));

		// Смещаем изображение ближе к низу
		const offsetY = config.screenHeight - background.displayHeight;
		background.setY(offsetY > 0 ? offsetY : 0); // Устанавливаем смещение, если оно положительное
	}
	createText(color = 'black') {
	    // Размер шрифта — 6% от высоты экрана (или блока, если нужно)
	    const fontSize = Math.round(config.screenHeight * 0.06);

	    // Позиция — чуть ниже центра серого блока
	    const boxHeight = config.screenHeight * 0.4;
	    const boxY = (config.screenHeight - boxHeight) / 2;
	    const y = boxY + boxHeight * 0.85; // 85% высоты блока

	    this.text = this.add.text(
	        config.screenWidth / 2,
	        y,
	        'Tab to Start',
	        {
	            fontSize: fontSize + 'px',
	            fontFamily: 'Lato',
	            fontStyle: 'bold',
	            fill: color
	        }
	    ).setOrigin(0.5, 0.5);

	    this.text.setInteractive();
	    this.text.on('pointerdown', this.onTextClick, this);
	}
	onTextClick(pointer, text) {
		this.scene.start('Game');
	}
}