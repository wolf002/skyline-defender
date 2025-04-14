class Enemies extends Phaser.Physics.Arcade.Group {
	constructor(scene) {
		super(scene.physics.world, scene);
		this.scene = scene;
		this.fires = new Fires(this.scene);
		this.countMax = 33;
		this.countCreated = 0;
		this.countKilled = 0;
		this.timer = this.scene.time.addEvent({ 
			delay: 1000, 
			callback: this.createCountEnemy, 
			callbackScope: this, 
			loop: true 
		});
	}
	onEnemyKilled(enemy){
		++this.countKilled;
		if(this.countKilled >= this.countMax){
			this.scene.events.emit('enemyKilled', this);
		}
	}
	createEnemy(){
		let enemy = this.getFirstDead();
		if (!enemy) {
			enemy = Enemy.generate(this.scene, this.fires);
			enemy.on('killed', this.onEnemyKilled, this);
			this.add(enemy);
		}else{
			enemy.reset();
		}

		enemy.move();
	}
	createCountEnemy() {
		if (this.countCreated < this.countMax) {
			this.createEnemy();
	
			// Ускоряем появление врагов
			const minDelay = 1000; // Минимальная задержка (в миллисекундах)
			const maxDelay = 3500; // Начальная задержка (в миллисекундах)
			const progress = this.countCreated / this.countMax; // Прогресс появления врагов (от 0 до 1)
			const newDelay = maxDelay - (maxDelay - minDelay) * progress;
	
			this.timer.delay = newDelay; // Устанавливаем новое значение задержки
		} else {
			this.timer.remove();
		}
		this.countCreated++;
	}
}