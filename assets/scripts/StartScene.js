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
		// Сохраняем текущую высоту
		const prevHeight = this.scale.height;
		// Временно устанавливаем высоту на config.height
		this.scale.resize(this.scale.width, config.height);
	    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
	    // Масштабируем фон, чтобы он соответствовал ширине экрана
	    this.background.setDisplaySize(config.screenWidth, this.background.height * (config.screenWidth / this.background.width));
		// Возвращаем исходную высоту
		this.scale.resize(this.scale.width, prevHeight);
		// Подгоняем фон под актуальную высоту экрана
		this.background.setDisplaySize(this.scale.width, this.scale.height);
	}
	resizeBackground(width, height) {
		if (this.background) {
			this.background.setDisplaySize(width, height);
		}
	}
	createText(color = 'black') {
	    // Размер шрифта — 6% от высоты экрана (или блока, если нужно)
	    const fontSize = Math.round(config.screenHeight * 0.06);

	    // Позиция — чуть ниже центра серого блока
	    const boxHeight = config.screenHeight * 0.4;
	    const boxY = (config.screenHeight - boxHeight) / 2;
	    const y = boxY + boxHeight * 0.85; // 85% высоты блока
//console.log('screenHeight',config.screenHeight, boxY, boxHeight);
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