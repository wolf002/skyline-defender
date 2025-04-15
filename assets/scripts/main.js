// Определяем доступный размер экрана
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// Конфигурация Phaser
let config = {
    type: Phaser.AUTO,
    width: 1280, 
    height: 720, 
	screenWidth: screenWidth,
	screenHeight: screenHeight,
    scene: [BootScene, PreloadScene, StartScene, GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE, // Масштабируем игру, чтобы она вписывалась в экран
        autoCenter: Phaser.Scale.CENTER_BOTH // Центрируем игру по горизонтали и вертикали
    }	
};

let game = new Phaser.Game(config);
game.scale.on('resize', (gameSize, baseSize, displaySize, resolution) => {
    config.screenWidth = gameSize.width;
    config.screenHeight = gameSize.height;
    
    MoveableObject.updateAllAdaptiveSizes(config.height);

    const currentScene = game.scene.getScenes(true)[0];
    if (currentScene && typeof currentScene.resizeBackground === 'function') {
        currentScene.resizeBackground(config.screenWidth, config.screenHeight);
    }
});

document.addEventListener('DOMContentLoaded', () => {
	config.screenWidth = game.scale.width;
    config.screenHeight = game.scale.height;
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const canvas = document.querySelector('canvas');

    // Показываем кнопку только на мобильных устройствах
    if (/Mobi|Android/i.test(navigator.userAgent)) {
        fullscreenBtn.style.display = 'block';
    }

    // Обработчик для кнопки
    fullscreenBtn.addEventListener('click', () => {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) { // Для Safari
            canvas.webkitRequestFullscreen();
        } else if (canvas.msRequestFullscreen) { // Для IE/Edge
            canvas.msRequestFullscreen();
        }
		window.dispatchEvent(new Event('resize'));
    });
});