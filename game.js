const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const gravity = 0.5;
const keys = {
    right: false,
    left: false,
    up: false
};

// Player
const player = {
    x: 100,
    y: 400,
    width: 40,
    height: 60,
    dx: 0,
    dy: 0,
    speed: 5,
    jumpPower: 12,
    grounded: false,
    color: '#004d40'
};

// Platforms
const platforms = [
    { x: 0, y: 580, width: 800, height: 20 },
    { x: 200, y: 450, width: 150, height: 20 },
    { x: 450, y: 350, width: 150, height: 20 },
    { x: 100, y: 250, width: 100, height: 20 },
    { x: 600, y: 200, width: 150, height: 20 }
];

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    ctx.fillStyle = '#333';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

// Input Handlers
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
    if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = true;
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
    if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = false;
});

function update() {
    // Player movement
    if (keys.right) {
        player.dx = player.speed;
    } else if (keys.left) {
        player.dx = -player.speed;
    } else {
        player.dx = 0;
    }

    // Jumping
    if (keys.up && player.grounded) {
        player.dy = -player.jumpPower;
        player.grounded = false;
    }

    // Apply gravity
    player.dy += gravity;

    // Update position
    player.x += player.dx;
    player.y += player.dy;

    player.grounded = false;

    // Collision detection with platforms
    platforms.forEach(platform => {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y) {

            // Check for collision from the top
            if(player.dy > 0 && player.y + player.height - player.dy <= platform.y) {
                player.grounded = true;
                player.dy = 0;
                player.y = platform.y - player.height;
            }
        }
    });

    // Prevent falling off the canvas
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.grounded = true;
    }

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    update();
    drawPlatforms();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
