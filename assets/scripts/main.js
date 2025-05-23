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
        mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT, // Масштабируем игру, чтобы она вписывалась в экран
        autoCenter: Phaser.Scale.CENTER_BOTH // Центрируем игру по горизонтали и вертикали
    }	
};

if (window.innerHeight > window.innerWidth) {
	config.scale.mode = Phaser.Scale.WIDTH_CONTROLS_HEIGHT; // Изменяем режим масштабирования для мобильных устройств
}else {
	config.scale.mode = Phaser.Scale.RESIZE; // Изменяем режим масштабирования 
}
let game = new Phaser.Game(config);
game.scale.on('resize', (gameSize, baseSize, displaySize, resolution) => {
	config.screenWidth = gameSize.width;
    config.screenHeight = gameSize.height;

    // Обновляем размеры всех объектов
    MoveableObject.updateAllAdaptiveSizes(config.height);

    // Вызываем resizeBackground у текущей сцены
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
		game.scale.resize(game.scale.width, game.scale.height);
    });
});

document.addEventListener('fullscreenchange', () => {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (document.fullscreenElement) {
        fullscreenBtn.style.display = 'none';
    } else {
        // Показываем кнопку только на мобильных устройствах
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            fullscreenBtn.style.display = 'block';
        }
    }
});