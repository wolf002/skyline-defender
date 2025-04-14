class Bloom extends Phaser.GameObjects.Sprite  {
	constructor(scene, x, y, frame) {
		super(scene, x, y, 'bloom', frame);
		this.scene = scene;
		this.scene.add.existing(this);
		this.scene.physics.add.existing(this);
        // Проверяем, существует ли анимация с ключом 'bloom'
        if (!this.scene.anims.exists('bloom')) {
            this.scene.anims.create({
                key: 'bloom',			
                frames: this.scene.anims.generateFrameNames('bloom', {
                    start: 1, 
                    end: 4, 
                    prefix: 'bloom', 
                }),
                frameRate: 6,
                repeat: 0
            });
        }
		this.play('bloom');
		this.on('animationcomplete', () => {
            this.destroy();
        });	
	}
	
}