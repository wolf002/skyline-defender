class Enemy extends MoveableObject {
	static genarateAttributes() {
		const x = config.width + 256;
		const margin = Math.round(config.screenHeight * 0.1); // 10% от высоты экрана
		const y = Phaser.Math.Between(margin, config.screenHeight - margin);
		const frame = `enemy${Phaser.Math.Between(1, 4)}`;
		return { x, y, frame };
	}
	static generate(scene, fires) {
		const { x, y, frame } = Enemy.genarateAttributes();
	
		// Рассчитываем скорость пуль в зависимости от прогресса
		const progress = scene.enemies.countCreated / scene.enemies.countMax; // Прогресс от 0 до 1
		const minBulletVelocity = -400; // Минимальная скорость пуль
		const maxBulletVelocity = -800; // Максимальная скорость пуль
		const bulletVelocity = minBulletVelocity + (maxBulletVelocity - minBulletVelocity) * progress;
	
		return new Enemy({
			scene, 
			fires,
			x, 
			y, 
			texture: 'enemy', 
			frame: frame,
			velocity: -250,
			bullet: {
				delay: 2000,
				texture: 'bullet',
				velocity: bulletVelocity // Устанавливаем динамическую скорость пуль
			},
			origin: {x: 0, y: 0.5}
		});
	}
	init(data){
		super.init(data);
		this.setOrigin(data.origin.x, data.origin.y);
		this.fires = data.fires || new Fires(this.scene);
		this.timer = this.scene.time.addEvent({ 
			delay: data.bullet.delay, 
			callback: this.fire, 
			callbackScope: this, 
			loop: true 
		});
		this.bullet = data.bullet;
	}
	fire(){
		this.fires.createFire(this);
	}
	isDead(){
		return this.x < -this.width;
	}
	reset(){
		const data = Enemy.genarateAttributes();
		super.reset(data.x, data.y);
		this.setFrame(data.frame);
		this.setAlive(true);
	}
}