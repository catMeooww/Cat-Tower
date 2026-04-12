towerData = {};

gameWidth = window.innerWidth - 2;
gameHeight = 500;
gridX = 0;
gridY = 0;
hovering = null;

playercat = "black";
playerX = 650;
playerY = 450;
velocityX = 0;
velocityY = 0;
state = "air";

function preload() {
    //bg
    bgImg = loadImage("../assets/bg.png")
    //player
    black_cat_1 = loadImage("../assets/Cat_Black-1.png");
    black_cat_2 = loadImage("../assets/Cat_Black-2.png");
    black_cat_3 = loadImage("../assets/Cat_Black-3.png");
    black_cat_4 = loadImage("../assets/Cat_Black-4.png");
    black_cat_4f = loadImage("../assets/Cat_Black-4-flip.png");
    //blocks
    grassImg = loadImage("../assets/Grass.jpg");
    planksImg = loadImage("../assets/Planks.jpg");
    stoneImg = loadImage("../assets/Stone.png");
    stringWallLeft = loadImage("../assets/StringWall.png");
    stringWallRight = loadImage("../assets/StringWallFlipped.png");
}
function setup() {
    //fixing sizes
    black_cat_1.resize(50,50);
    black_cat_2.resize(50,50);
    black_cat_3.resize(50,50);
    black_cat_4.resize(50,50);
    black_cat_4f.resize(50,50);
    grassImg.resize(50,50);
    planksImg.resize(50,50);
    stoneImg.resize(50,50);
    stringWallLeft.resize(50,50);
    stringWallRight.resize(50,50);

    canvas = createCanvas(gameWidth, 500);
    canvas.parent("canvas");
}

function collision(ax, ay, bx, by) {
    if (ax < bx + 48 && ax + 48 > bx && ay < by + 48 && ay + 48 > by) {
        return true;
    }
    return false;
}

function solidBlock(block) {
    if (collision(playerX + velocityX, playerY, block["x"], block["y"])) {
        velocityX = 0;
    }
    if (collision(playerX, playerY + velocityY, block["x"], block["y"])) {
        velocityY = 0;
        state = "ground";
    }
}

function functionalBlock(block, type) {
    if (type == "string" || type == "stringf") {
        if (collision(playerX, playerY + velocityY, block["x"], block["y"])) {
            if (velocityY > 0 && !(keyDown("s") || keyDown("down"))) {
                velocityY = 0;
                state = type;
            }
        }
    }
}

function drawPlayer(cat) {
    if (cat["color"] == "orange") {

    } else {
        if (cat["vx"] == 0 && cat["state"] == "ground") {
            image(black_cat_1, cat["x"], cat["y"] + 10);
        } else if (cat["state"] == "ground") {
            image(black_cat_2, cat["x"], cat["y"] + 10);
        } else if (cat["state"] == "string") {
            image(black_cat_4, cat["x"], cat["y"] + 10);
        } else if (cat["state"] == "stringf") {
            image(black_cat_4f, cat["x"], cat["y"] + 10);
        } else {
            image(black_cat_3, cat["x"], cat["y"] + 10);
        }
    }
}

function playerControls(){
    if (keyDown("a") || keyDown("left")) {
            velocityX = -5;
        } else if (keyDown("d") || keyDown("right")) {
            velocityX = 5;
        } else {
            if(velocityX > 0){
                velocityX -= 0.5;
            }else if(velocityX < 0){
                velocityX += 0.5;
            }
        }
        velocityY += 0.8;
        if (keyDown("w") || keyDown("up") || keyDown("space")) {
            if (state == "ground") {
                velocityY = -12;
            } else if (state == "string") {
                velocityY = -10;
                velocityX = 10
            } else if (state == "stringf") {
                velocityY = -10;
                velocityX = -10
            }
        }
}

function drawBlocks(sector,offsetX=0,offsetY=0){
    gridX = Math.floor((mouseX + (camera.x - gameWidth / 2)) / 50) * 50;
    gridY = Math.floor((mouseY + (camera.y + 20 - gameHeight / 2)) / 50) * 50;
    hovering = null;
    sector["blocks"].forEach((block, index) => {
        thisBlock = {...block};
        thisBlock["x"] = thisBlock["x"] + offsetX;
        thisBlock["y"] = thisBlock["y"] + offsetY;
        if (gridX == thisBlock["x"] && gridY == thisBlock["y"]) {
            hovering = index;
        }
        if (thisBlock["type"] == "planks") {
            image(planksImg, thisBlock["x"], thisBlock["y"]);
            solidBlock(thisBlock);
        } else if (thisBlock["type"] == "grass") {
            image(grassImg, thisBlock["x"], thisBlock["y"]);
            solidBlock(thisBlock);
        } else if (thisBlock["type"] == "stone") {
            image(stoneImg, thisBlock["x"], thisBlock["y"]);
            solidBlock(thisBlock);
        } else if (thisBlock["type"] == "stringwall") {
            image(stringWallLeft, thisBlock["x"], thisBlock["y"]);
            functionalBlock(thisBlock, "string");
        } else if (thisBlock["type"] == "stringwallf") {
            image(stringWallRight, thisBlock["x"], thisBlock["y"]);
            functionalBlock(thisBlock, "stringf");
        }
    });
}