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
});