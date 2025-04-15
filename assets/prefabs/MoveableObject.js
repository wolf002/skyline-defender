class MoveableObject extends Phaser.GameObjects.Sprite {
    static adaptiveObjects = [];

	constructor(data) {
		super(data.scene, data.x, data.y, data.texture, data.frame);
		this.init(data);
        MoveableObject.adaptiveObjects.push(this); // Регистрируем объект
	}
	init(data){
		this.scene.add.existing(this);
		this.scene.physics.add.existing(this);
		this.body.enable = true;
		this.velocity = data.velocity;
		this.scene.events.on('update', this.update, this);
		this.setAdaptiveSize(config.height);
	}
	isDead(){
		return false;
	}
	update() {
		if (this.active && this.isDead()) {
			this.setAlive(false);
		}
	}		
	reset(x, y) {
		this.x = x;
		this.y = y;
		this.setAlive(true);
	}
	setAlive(status) {
		this.body.enable = status;
		this.setVisible(status);
		this.setActive(status);
		if(this.timer){
			this.timer.paused = !status;
		}
		if (!status) {
			this.emit('killed', this);
		}
	}
	move(){
		this.body.setVelocityX(this.velocity);
	}
    setAdaptiveSize(baseScreenHeight = config.height) {
        // Получаем размеры текущего фрейма (работает и для atlas, и для одиночных текстур)
        const originalSpriteWidth = this.frame.width;
        const originalSpriteHeight = this.frame.height;
        const heightPercent = originalSpriteHeight / baseScreenHeight;
        const currentScreenHeight = this.scene.scale.height;
        const newHeight = currentScreenHeight * heightPercent;
        const aspect = originalSpriteWidth / originalSpriteHeight;
        const newWidth = newHeight * aspect;
		//console.log(this.texture.key, 'originalSpriteWidth', originalSpriteWidth, 'originalSpriteHeight', originalSpriteHeight, 'newWidth', newWidth, 'newHeight', newHeight, 'currentScreenHeight', currentScreenHeight, 'baseScreenHeight', baseScreenHeight);
        this.setDisplaySize(newWidth, newHeight);
    }

    destroy(fromScene) {
        const idx = MoveableObject.adaptiveObjects.indexOf(this);
        if (idx !== -1) MoveableObject.adaptiveObjects.splice(idx, 1);
        super.destroy(fromScene);
    }

    static updateAllAdaptiveSizes(baseScreenHeight = config.height) {
        for (const obj of MoveableObject.adaptiveObjects) {
            obj.setAdaptiveSize(baseScreenHeight);
        }
    }
}