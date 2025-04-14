class Fires extends Phaser.Physics.Arcade.Group {
	constructor(scene) {
		super(scene.physics.world, scene);
		this.scene = scene;
	}
	createFire(source) {
		let fire = this.getFirstDead();
		if (!fire) {
			fire = Fire.generate(this.scene, source);
			this.add(fire);
		}else {
			fire.reset(source.x, source.y);
		}
		fire.move();
	}
}