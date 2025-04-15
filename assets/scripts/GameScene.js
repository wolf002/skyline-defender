class GameScene extends Phaser.Scene{
	constructor(){
		super('Game');
	}
	init() {
		this.cursorKeys = this.input.keyboard.createCursorKeys();
		this.score = 0;
		this.bloom = null;
	}
	preload () {

	}
	create () {
		this.createBackground();
		this.createSounds();
		this.createText();
		this.player = new Player(this);
		this.enemies = new Enemies(this);
		this.createCompleteEvents();
		this.addOverlap();

		 // Централизованно обновляем размеры всех объектов при старте
		MoveableObject.updateAllAdaptiveSizes(config.height);
	}
	createBackground() {
		// Сохраняем текущую высоту
		const prevHeight = this.scale.height;

		// Временно устанавливаем высоту на 640
		this.scale.resize(this.scale.width, config.height);

		// Создаём фон с высотой 1024
		this.bg = this.add.tileSprite(
			0,
			0,
			this.scale.width,
			config.height,
			'bg'
		).setOrigin(0, 0);

		// Возвращаем исходную высоту
		this.scale.resize(this.scale.width, prevHeight);

		// Подгоняем фон под актуальную высоту экрана
		this.bg.setDisplaySize(this.scale.width, this.scale.height);
	}
	resizeBackground(width, height) {
		if (this.bg) {
			this.bg.setDisplaySize(width, height);
		}
	}
	createSounds(){
		if (!this.sounds) {
			this.sounds = {
				win: this.sound.add('win'),
				lose: this.sound.add('lose'),
				bloom: this.sound.add('bloom'),
				dragon: this.sound.add('dragon'),
				theme: this.sound.add('theme', { volume: 0.8, loop: true }) // Добавляем параметр loop: true для зацикливания,
			}; 
		}

		this.sounds.theme.play();  // Воспроизводим музыку
	}
	createText(){
		this.textScore = this.add.text(20, 20, 'Score: ' + this.score, 
			{ fontSize: '46px', fontFamily: 'Lato', fontStyle: 'bold', fill: 'black' });
	}
	createCompleteEvents(){
		this.player.once('killed', this.onComplete, this);
		this.events.once('enemyKilled', this.onComplete, this);
	}
	onComplete() {
		if (this.bloom && this.bloom.anims) {
			// Если анимация ещё воспроизводится, ждём её завершения
			this.bloom.once('animationcomplete', () => {
				this.onCompleteAction();
			});
		} else {
			// Если анимации нет, сразу переходим на новую сцену
			this.onCompleteAction();
		}
	}
	onCompleteAction() {
		this.sounds.theme.pause(); // Останавливаем текущую музыку
	
		if (this.player.active) {
			// Если игрок остался жив, воспроизводим музыку победы
			this.sounds.win = this.sound.add('win'); // Убедитесь, что звук 'win' загружен
			this.sounds.win.play();
		} else {
			// Если игрок проиграл, можно добавить музыку поражения (опционально)
			this.sounds.lose = this.sound.add('lose'); // Убедитесь, что звук 'lose' загружен
			this.sounds.lose.play();
		}
	
		// Переход на стартовую сцену
		this.scene.start('Start', {
			score: this.score,
			completed: this.player.active
		});
	}
	addOverlap() {
		this.physics.add.overlap(this.player.fires, this.enemies, this.onOverlap, this.checkPixelCollision, this);
		this.physics.add.overlap(this.enemies.fires, this.player, this.onOverlap, this.pixelPerfectOverlap, this);
		this.physics.add.overlap(this.player, this.enemies, this.onOverlap, this.pixelPerfectOverlap, this);
	}
	onOverlap(source, target) {
		if(source !== this.player && target !== this.player) {
			this.sounds.bloom.play(); // Воспроизводим звук взрыва
			this.bloom = new Bloom(this, target.x, target.y);
			this.score++;
			this.textScore.setText('Score: ' + this.score);
		}
		if (source === this.player && this.enemies.contains(target)) {
			this.sounds.dragon.play(); // Воспроизводим звук дракона
			this.bloom = new Bloom(this, source.x, source.y);
		} 
		if (source.texture.key === 'dragon' && target.texture.key === 'bullet') {
			this.sounds.dragon.play(); // Воспроизводим звук дракона
			this.bloom = new Bloom(this, target.x, target.y);
		}
		source.setAlive(false);
		target.setAlive(false);
	}
	update () {
		this.bg.tilePositionX += 0.5;
		this.player.move();
	}
	checkPixelCollision(fire, enemy) {
		// Получаем текстуры как Canvas
		const fireTexture = fire.texture.getSourceImage();
		const enemyTexture = enemy.texture.getSourceImage();
	  
		// Создаем временные Canvas, если еще не были созданы
		if (!this._tempCanvas1) {
		  this._tempCanvas1 = this.textures.createCanvas('tempCanvas1', fire.width, fire.height);
		  this._tempCanvas2 = this.textures.createCanvas('tempCanvas2', enemy.width, enemy.height);
		}
	  
		// Копируем изображения на временные канвасы
		const ctx1 = this._tempCanvas1.getContext();
		ctx1.clearRect(0, 0, fire.width, fire.height);
		ctx1.drawImage(fireTexture, 0, 0);
	  
		const ctx2 = this._tempCanvas2.getContext();
		ctx2.clearRect(0, 0, enemy.width, enemy.height);
		ctx2.drawImage(enemyTexture, 0, 0);
	  
		// Получаем ImageData
		const fireData = ctx1.getImageData(0, 0, fire.width, fire.height).data;
		const enemyData = ctx2.getImageData(0, 0, enemy.width, enemy.height).data;
	  
		// Определим пересекающуюся область
		const boundsA = fire.getBounds();
		const boundsB = enemy.getBounds();
	  
		const intersectX = Math.max(boundsA.x, boundsB.x);
		const intersectY = Math.max(boundsA.y, boundsB.y);
		const intersectRight = Math.min(boundsA.right, boundsB.right);
		const intersectBottom = Math.min(boundsA.bottom, boundsB.bottom);
	  
		if (intersectX >= intersectRight || intersectY >= intersectBottom) {
		  return false;
		}
	  
		const width = intersectRight - intersectX;
		const height = intersectBottom - intersectY;
	  
		// Проверяем каждый пиксель в пересечении
		for (let y = 0; y < height; y++) {
		  for (let x = 0; x < width; x++) {
			const fireX = intersectX - boundsA.x + x;
			const fireY = intersectY - boundsA.y + y;
			const enemyX = intersectX - boundsB.x + x;
			const enemyY = intersectY - boundsB.y + y;
	  
			const fireIndex = (Math.floor(fireY) * fire.width + Math.floor(fireX)) * 4 + 3;
			const enemyIndex = (Math.floor(enemyY) * enemy.width + Math.floor(enemyX)) * 4 + 3;
	  
			const fireAlpha = fireData[fireIndex];
			const enemyAlpha = enemyData[enemyIndex];
	  
			if (fireAlpha > 10 && enemyAlpha > 10) {
			  return true; // столкнулись непрозрачные пиксели
			}
		  }
		}
	  
		return false;
	  }
	  
	  pixelPerfectOverlap(spriteA, spriteB, alphaThreshold = 10) {
		if (!this._pixelCache) {
		  this._pixelCache = {};
		}
	  
		const getImageData = (key, sprite) => {
		  const image = sprite.texture.getSourceImage();
	  
		  // Проверка на наличие кэша и совпадение размеров
		  const cache = this._pixelCache[key];
		  if (cache &&
			  cache.image === image &&
			  cache.width === image.width &&
			  cache.height === image.height) {
			return cache.data;
		  }
	  
		  // Удаляем старую текстуру, если есть
		  if (this.textures.exists(key)) {
			this.textures.remove(key);
		  }
	  
		  this.textures.createCanvas(key, image.width, image.height);
		  const ctx = this.textures.get(key).getContext();
		  ctx.clearRect(0, 0, image.width, image.height);
		  ctx.drawImage(image, 0, 0);
		  const imageData = ctx.getImageData(0, 0, image.width, image.height).data;
	  
		  // Кэшируем
		  this._pixelCache[key] = {
			image: image,
			width: image.width,
			height: image.height,
			data: imageData
		  };
	  
		  return imageData;
		};
	  
		const dataA = getImageData('tempCanvasA', spriteA);
		const dataB = getImageData('tempCanvasB', spriteB);
	  
		const imageA = spriteA.texture.getSourceImage();
		const imageB = spriteB.texture.getSourceImage();
	  
		const boundsA = spriteA.getBounds();
		const boundsB = spriteB.getBounds();
	  
		const xStart = Math.max(boundsA.x, boundsB.x);
		const yStart = Math.max(boundsA.y, boundsB.y);
		const xEnd = Math.min(boundsA.right, boundsB.right);
		const yEnd = Math.min(boundsA.bottom, boundsB.bottom);
	  
		if (xEnd <= xStart || yEnd <= yStart) {
		  return false;
		}
	  
		const overlapWidth = xEnd - xStart;
		const overlapHeight = yEnd - yStart;
	  
		for (let y = 0; y < overlapHeight; y++) {
		  for (let x = 0; x < overlapWidth; x++) {
			const worldX = xStart + x;
			const worldY = yStart + y;
	  
			const ax = Math.round(worldX - boundsA.x);
			const ay = Math.round(worldY - boundsA.y);
			const bx = Math.round(worldX - boundsB.x);
			const by = Math.round(worldY - boundsB.y);
	  
			if (
			  ax < 0 || ay < 0 || ax >= imageA.width || ay >= imageA.height ||
			  bx < 0 || by < 0 || bx >= imageB.width || by >= imageB.height
			) {
			  continue;
			}
	  
			const indexA = (ay * imageA.width + ax) * 4 + 3;
			const indexB = (by * imageB.width + bx) * 4 + 3;
	  
			const alphaA = dataA[indexA];
			const alphaB = dataB[indexB];
	  
			if (alphaA > alphaThreshold && alphaB > alphaThreshold) {
			  return true; // Нашли реальное соприкосновение непрозрачных пикселей
			}
		  }
		}
	  
		return false;
	  }
	  
	  /*resize(gameSize, baseSize, displaySize, resolution) {
		const width = gameSize.width;
		const height = gameSize.height;
	
		 // Масштабируем фон, чтобы он заполнил весь экран
		this.bg.setDisplaySize(width, height);
	
		// Обновляем позицию и размеры игрока
		this.player.setPosition(width / 2, height / 2);
	
		// Обновляем позицию текста
		this.textScore.setPosition(20, 20);
	}*/
	
}