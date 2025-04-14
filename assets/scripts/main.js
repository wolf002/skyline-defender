// Определяем доступный размер экрана
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// Конфигурация Phaser
let config = {
    type: Phaser.AUTO,
    width: screenWidth, // Используем доступную ширину экрана
    height: screenHeight, // Используем доступную высоту экрана
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
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);

    // Обновляем фон при изменении размера экрана
    const currentScene = game.scene.getScene(game.scene.keys[game.scene.current]);
    if (currentScene && currentScene.bg) {
        currentScene.bg.setSize(window.innerWidth, window.innerHeight);
    }
});

document.addEventListener('DOMContentLoaded', () => {
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
    });
});