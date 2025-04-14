class Player extends Enemy {
    constructor(scene) {
        super({
            scene, 
            x: 250, 
            y: config.height / 2, 
            texture: 'dragon', 
            frame: '1',
            velocity: 500,
            bullet: {
                delay: 500,
                texture: 'fire',
                velocity: 1000
            },
            origin: { x: 1, y: 0.5 }
        });
        // Проверяем, существует ли анимация с ключом 'fly'
        if (!this.scene.anims.exists('fly')) {
            const frames = this.scene.anims.generateFrameNames('dragon', {
                start: 1, 
                end: 6, 
                prefix: '', 
            });
            this.scene.anims.create({
                key: 'fly',
                frames: frames,
                frameRate: 6,
                repeat: -1
            });
        }
        this.play('fly');
    }

    init(data) {
        super.init(data);
        this.setOrigin(0.5, 0.5); // Устанавливаем точку происхождения в центр спрайта
        this.fires = new Fires(this.scene);

        // Регистрируем клавиши WASD
        this.keys = this.scene.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Добавляем управление пальцем
        this.scene.input.on('pointermove', this.handlePointerMove, this);
    }

    move() {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        // Обработка стрелок и клавиш WASD
        if (this.scene.cursorKeys.left.isDown || this.keys.A.isDown) {
            this.body.velocity.x = -this.velocity;
        } else if (this.scene.cursorKeys.right.isDown || this.keys.D.isDown) {
            this.body.velocity.x = this.velocity;
        }

        if (this.scene.cursorKeys.up.isDown || this.keys.W.isDown) {
            this.body.velocity.y = -this.velocity;
        } else if (this.scene.cursorKeys.down.isDown || this.keys.S.isDown) {
            this.body.velocity.y = this.velocity;
        }

        // Ограничение движения игрока в пределах игрового экрана
        const halfWidth = -this.displayWidth / 3;
        const halfHeight = -this.displayHeight / 3;

        if (this.x - halfWidth < 0) {
            this.x = halfWidth;
        } else if (this.x + halfWidth > this.scene.scale.width) {
            this.x = this.scene.scale.width - halfWidth;
        }

        if (this.y - halfHeight < 0) {
            this.y = halfHeight;
        } else if (this.y + halfHeight > this.scene.scale.height) {
            this.y = this.scene.scale.height - halfHeight;
        }
    }

    handlePointerMove(pointer) {
        // Перемещаем игрока в соответствии с движением пальца
        this.x = Phaser.Math.Clamp(pointer.x, this.displayWidth / 2, this.scene.scale.width - this.displayWidth / 2);
        this.y = Phaser.Math.Clamp(pointer.y, this.displayHeight / 2, this.scene.scale.height - this.displayHeight / 2);
    }
}