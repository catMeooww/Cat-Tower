sectorData = {
    "background": "gray",
    "blocks": [{ "type": "planks", "x": 550, "y": 450 }, { "type": "planks", "x": 500, "y": 450 }, { "type": "planks", "x": 450, "y": 450 }, { "type": "planks", "x": 400, "y": 450 }, { "type": "planks", "x": 350, "y": 450 }, { "type": "planks", "x": 300, "y": 450 }, { "type": "planks", "x": 750, "y": 450 }, { "type": "planks", "x": 800, "y": 450 }, { "type": "planks", "x": 850, "y": 450 }, { "type": "planks", "x": 950, "y": 450 }, { "type": "planks", "x": 900, "y": 450 }, { "type": "planks", "x": 1000, "y": 450 }, { "type": "planks", "x": 300, "y": 0 }, { "type": "planks", "x": 350, "y": 0 }, { "type": "planks", "x": 400, "y": 0 }, { "type": "planks", "x": 450, "y": 0 }, { "type": "planks", "x": 500, "y": 0 }, { "type": "planks", "x": 550, "y": 0 }, { "type": "planks", "x": 750, "y": 0 }, { "type": "planks", "x": 800, "y": 0 }, { "type": "planks", "x": 850, "y": 0 }, { "type": "planks", "x": 900, "y": 0 }, { "type": "planks", "x": 950, "y": 0 }, { "type": "planks", "x": 1000, "y": 0 }, { "type": "planks", "x": 1000, "y": 50 }, { "type": "planks", "x": 1000, "y": 100 }, { "type": "planks", "x": 1000, "y": 150 }, { "type": "planks", "x": 1000, "y": 200 }, { "type": "planks", "x": 1000, "y": 250 }, { "type": "planks", "x": 1000, "y": 300 }, { "type": "planks", "x": 1000, "y": 350 }, { "type": "planks", "x": 1000, "y": 400 }, { "type": "planks", "x": 300, "y": 400 }, { "type": "planks", "x": 300, "y": 350 }, { "type": "planks", "x": 300, "y": 300 }, { "type": "planks", "x": 300, "y": 250 }, { "type": "planks", "x": 300, "y": 200 }, { "type": "planks", "x": 300, "y": 150 }, { "type": "planks", "x": 300, "y": 100 }, { "type": "planks", "x": 300, "y": 50 }, { "type": "stringwall", "x": 600, "y": 0 }, { "type": "stringwallf", "x": 700, "y": 0 }]
};

action = "planks";
isTestisng = false;

menuOpen = true;

function menuClose() {
    setTimeout(() => {
        menuOpen = false;
    }, 300)
}

function loadSector(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
        const jsonString = e.target.result;
        let jsonData;
        try {
            jsonData = JSON.parse(jsonString);
            sectorData = jsonData;
            document.getElementById("initialization").style.visibility = "hidden";
            menuClose();
        } catch (error) {
            console.error('Error loading Map File: ' + error);
        }
    };
    reader.readAsText(file);
}

function newSector() {
    document.getElementById("initialization").style.visibility = "hidden";
    menuClose();
}

function startSector() {
    loadUserData();
}

function draw() {
    background(sectorData["background"]);
    //playtesting
    if (isTestisng) {
        playerControls();
    } else {
        velocityX = 0;
        velocityY = 0;
    }
    //show
    state = "air";
    if(playerY>=500){
        velocityY = -15;
    }
    drawBlocks(sectorData);
    if (isTestisng) {
        //playing
        playerX += velocityX;
        playerY += velocityY;
        if (playerY < 0) {
            playTest();
        }
    } else {
        //editing
        stroke("white");
        strokeWeight(1);
        fill("rgba(0,0,0,0)");
        rect(gridX, gridY, 50, 50);
    }
    //indicators
    text("X:"+gridX+", Y:"+gridY,50,50);
    drawPlayer({"x":playerX,"y":playerY,"vx":velocityX,"vy":velocityY,"state":state,"color":playercat});
    stroke("red");
    line(600, 499, 750, 499);
    stroke("blue");
    line(600, 0, 750, 0);
}
function mouseClicked() {
    if (!menuOpen) {
        if (gridY < gameHeight && gridY >= 0 && !isTestisng) {
            if (action == "remove") {
                sectorData["blocks"][hovering]["type"] = "air";
            } else {
                sectorData["blocks"].push({
                    "type": action,
                    "x": gridX,
                    "y": gridY
                })
            }
        }
    }
}

function playTest() {
    if (isTestisng) {
        isTestisng = false;
        playerX = 650;
        playerY = 450;
    } else {
        isTestisng = true;
    }
}

function changeAction(n) {
    if (n == 0) {
        action = "remove";
    } else if (n == 1) {
        action = "planks";
    } else if (n == 2) {
        action = "grass";
    } else if (n == 3) {
        action = "stone";
    } else if (n == 4) {
        action = "stringwall";
    } else if (n == 5) {
        action = "stringwallf";
    }
}

function saveSector() {
    filename = "tower_sector.craftymap";
    if (!sectorData["name"] == "") {
        filename = sectorData["name"] + ".craftymap";
    }
    maptext = JSON.stringify(sectorData);
    var downloader = document.createElement('a');
    downloader.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(maptext));
    downloader.setAttribute('download', filename);
    downloader.style.display = 'none';
    document.body.appendChild(downloader);
    downloader.click();
    document.body.removeChild(downloader);
}

function publishMenu() {
    if (logged) {
        if (document.getElementById("publisher").style.visibility == "visible") {
            document.getElementById("publisher").style.visibility = "hidden";
            menuClose();
        } else {
            document.getElementById("publisher").style.visibility = "visible";
            menuOpen = true;
        }
    } else {
        loadUserData();
        window.open("../user.html", "_blank");
    }
}

function publishSector() {
    sectorName = document.getElementById("publishName").value;
    if (sectorName != "") {
        firebase.database().ref("/cattower/sectors/").push({
            name: sectorName,
            creator: user,
            content: sectorData
        });
        publishMenu();
    }
}

function userLogged() {
    for (e = 0; e < document.getElementsByClassName("login").length; e++) {
        document.getElementsByClassName("login").item(e).innerHTML = user;
    }
    firebase.database().ref("/cattower/sectors/").once('value', function (snapshot) {
        document.getElementById("usersectors").innerHTML = "<p>Published Sectors</p>";
        snapshot.forEach(function (childSnapshot) {
            childKey = childSnapshot.key; childData = childSnapshot.val();
            if (childData["creator"] == user) {
                document.getElementById("usersectors").innerHTML += "<div>" + childData["name"] + "</div>";
            }
        });
    });
}