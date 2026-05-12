isReady = false;
room = "";
host = false;
onlinePlayers = {};

tab = "players";

//host options
officialSectors = ["level 1", "level 2"]
selectedSectors = [{ "source": "official", "id": "level_1", "name": "level 1" }, { "source": "official", "id": "level_2", "name": "level 2" }];
floors = 5;
ramdomness = 1;
generationType = "random";

function appendOnlineSector(id, name) {
    selectedSectors.push({
        "source": "server",
        "id": id,
        "name": name
    });
    showRoomData();
}

function appendOfficialSector(id) {
    selectedSectors.push({
        "source": "official",
        "id": id.replace(" ", "_"),
        "name": id
    });
    showRoomData();
}

function removeSelection(i) {
    newSelection = [];
    l = 0;
    for (level of selectedSectors) {
        if (l != i) {
            newSelection.push(level);
        }
        l++
    }
    selectedSectors = newSelection;
    showRoomData();
}

function addSize(n) {
    if (floors + n >= 1) {
        floors += n;
        showRoomData();
    }
}

function addRamdom(n) {
    if (ramdomness + n >= 0) {
        ramdomness += n;
        showRoomData();
    }
}

function changeGenType() {
    if (generationType == "random") {
        generationType = "linear";
    } else {
        generationType = "random";
    }
    showRoomData();
}

function showRoomData() {
    if (tab == "players") {
        firebase.database().ref("/cattower/rooms/" + room + "/players").on('value', function (snapshot) {
            document.getElementById("playerList").innerHTML = "";
            snapshot.forEach(function (childSnapshot) {
                childKey = childSnapshot.key; childData = childSnapshot.val();
                if (childData["color"] == "orange") {
                    //
                } else {
                    thisimg = "<img src='../assets/Cat_Black-1.png'>";
                }
                document.getElementById("playerList").innerHTML += "<div><p>" + childKey + "</p>" + thisimg + "</div>";
            });
        });
    } else if (tab == "configs") {
        document.getElementById("towerSizing").innerHTML = "<h3>Tower Height</h3>";
        document.getElementById("towerSizing").innerHTML += "<label>Fixed Size:</label>";
        document.getElementById("towerSizing").innerHTML += "<section class='slider'><button onclick='addSize(-1)'><</button><button class='number-show'>" + floors + "</button><button onclick='addSize(1)'>></button></section>";
        document.getElementById("towerSizing").innerHTML += "<label>Ramdom Factor:</label>";
        document.getElementById("towerSizing").innerHTML += "<section class='slider'><button onclick='addRamdom(-1)'><</button><button class='number-show'>" + ramdomness + "</button><button onclick='addRamdom(1)'>></button></section>";
        document.getElementById("towerGeneration").innerHTML = "<h3>Generation Method</h3>";
        document.getElementById("towerGeneration").innerHTML += "<button onclick='changeGenType()'>" + generationType + "</button>";
    } else if (tab == "sectors") {
        console.log(selectedSectors);
        document.getElementById("selected_sectors").innerHTML = "<p>SELECTED</p>";
        i = 0;
        for (level of selectedSectors) {
            document.getElementById("selected_sectors").innerHTML += "<button onclick='removeSelection(" + i + ")'><b>" + level["name"] + "</b> - " + level["source"] + "</button>";
            i++;
        }
        document.getElementById("official_sectors").innerHTML = "<p>Official Sectors</p>";
        for (level of officialSectors) {
            document.getElementById("official_sectors").innerHTML += "<button onclick='appendOfficialSector(" + '"' + level + '"' + ")'><b>" + level + "</b> - easy</button>";
        }
        firebase.database().ref("/cattower/sectors/").once('value', function (snapshot) {
            document.getElementById("public_sectors").innerHTML = "<p>Published Sectors</p>";
            snapshot.forEach(function (childSnapshot) {
                childKey = childSnapshot.key; childData = childSnapshot.val();
                document.getElementById("public_sectors").innerHTML += "<button onclick='appendOnlineSector(" + '"' + childKey + '"' + "," + '"' + childData["name"] + '"' + ")'><b>" + childData["name"] + "</b> - by: " + childData["creator"] + "</button>";
            });
        });
    }
}

function roomData() {
    room = window.location.href;
    room = room.split("?");
    if (room.length >= 2) {
        room = room[1];
        firebase.database().ref("/cattower/rooms/" + room + "/status").on("value", data => {
            isRoomCreated = data.val();
            if (isRoomCreated == "waiting") {
                document.getElementById("roomName").innerHTML = room;
                firebase.database().ref("/cattower/rooms/" + room + "/host").once('value', data => {
                    if (data.val() == user) {
                        host = true;
                        for (e = 0; e < document.getElementsByClassName("adm_commands").length; e++) {
                            document.getElementsByClassName("adm_commands").item(e).style.visibility = "visible";
                        }
                    }
                })
                showRoomData();
            } else if (isRoomCreated == "playing") {
                runGame();
            } else {
                window.location = "../";
            }
        });
    } else {
        window.location = "../";
    }
    loadUserData();
}

function userLogged() {
    firebase.database().ref("/cattower/rooms/" + room + "/players/" + user).update({
        status: "online",
        x: playerX,
        y: playerY,
        color: playercat,
        vx: 0,
        vy: 0,
        state: "ground"
    })
}

function changeTab(t) {
    switch (t) {
        case 1:
            document.getElementById("tab").innerHTML = "<section id='playerList'></section>";
            tab = "players";
            break;
        case 2:
            document.getElementById("tab").innerHTML = "<section id='towerSizing'></section><section id='towerGeneration'></section>";
            tab = "configs";
            break;
        case 3:
            selectedDiv = "<section id='selected_sectors'></section>";
            selectingDiv = "<section id='selecting_sectors'><section id='official_sectors'></section><section id='public_sectors'></section></section>";
            document.getElementById("tab").innerHTML = "<section id='sectorList'>" + selectedDiv + selectingDiv + "</section>";
            tab = "sectors";
            break;
    }
    showRoomData();
}

async function startGame() {
    newFloors = Math.floor(Math.random() * (ramdomness * 2)) - ramdomness / 2;
    if (floors + newFloors > 0) {
        floors += newFloors;
    }
    finalSectors = [{
        "source": "official",
        "id": "bottom",
        "name": "bottom"
    }]
    if (generationType == "random") {
        for (f = 0; f < floors; f++) {
            selected = selectedSectors[Math.floor(Math.random() * selectedSectors.length)];
            finalSectors.push(selected);
        }
    } else {
        i = 0;
        for (f = 0; f < floors; f++) {
            selected = selectedSectors[i];
            finalSectors.push(selected);
            if (i >= selectedSectors.length - 1) {
                i = 0;
            } else {
                i++;
            }
        }
    }
    finalSectors.push({
        "source": "official",
        "id": "top",
        "name": "top"
    })
    sectorsData = []
    for (sector of finalSectors) {
        if (sector["source"] == "official") {
            await fetch('../sections/' + sector["id"] + ".craftymap")
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Cannot load sector:' + sector["id"] + ` status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    sectorsData.push(data);
                })
                .catch(error => {
                    console.error('Cannot load sector:' + sector["id"] + ' Error: ' + error);
                });
        } else if (sector["source"] == "server") {
            await firebase.database().ref("/cattower/sectors/" + sector["id"] + "/content/").once('value', data => {
                sectorsData.push(data.val());
            })
        } else {
            console.error("Cannot load sector: " + sector["id"]);
        }
    }
    console.log(sectorsData);
    firebase.database().ref("/cattower/rooms/" + room).update({
        level: sectorsData,
        status: "playing"
    })
}

async function runGame() {
    await firebase.database().ref("/cattower/rooms/" + room + "/level/").once('value', data => {
        towerData = data.val();
    })
    firebase.database().ref("/cattower/rooms/" + room + "/players/").on('value', data => {
        onlinePlayers = data.val();
    })
    firebase.database().ref("/cattower/rooms/" + room + "/winner/").on('value', data => {
        winner = data.val();
        winnercolor = winner["color"]
    })
    document.getElementById("room_data").style.visibility = "hidden";
    for (e = 0; e < document.getElementsByClassName("adm_commands").length; e++) {
        document.getElementsByClassName("adm_commands").item(e).style.visibility = "hidden";
    }
    isReady = true;
}

function draw() {
    image(bgImg, camera.x - gameWidth / 2, camera.y - gameHeight / 2, gameWidth, gameHeight)
    if (isReady) {
        //controls
        camera.x = playerX;
        camera.y = playerY;
        playerControls();

        //ground
        strokeWeight(0);
        fill("green");
        rect(camera.x - gameWidth / 2, 500, gameWidth, 250);
        if (playerY >= 500 - 50) {
            if (velocityY > 0) {
                velocityY = 0;
            }
            state = "ground";
        } else {
            state = "air";
        }

        //blocks
        sectorOffset = 0;
        for (sector of towerData) {
            if (playerY >= sectorOffset - 500 && playerY <= sectorOffset + 1000) {
                fill(sector["background"]);
                rect(300, sectorOffset, 700, 500);
                drawBlocks(sector, 0, sectorOffset);
            }
            sectorOffset -= 500;
        }

        //data
        playerX += velocityX;
        playerY += velocityY;
        firebase.database().ref("/cattower/rooms/" + room + "/players/" + user).update({
            x: Math.floor(playerX),
            y: Math.floor(playerY),
            vx: velocityX,
            vy: velocityY,
            state: state
        })

        //draw players
        drawPlayer({ "x": playerX, "y": playerY, "vx": velocityX, "vy": velocityY, "state": state, "color": playercat });
        for ([pname, pdata] of Object.entries(onlinePlayers)) {
            if (pdata["status"] == "online" && pname != user) {
                fill("white")
                text(pname, pdata["x"], pdata["y"] - 10)
                drawPlayer({
                    "x": pdata["x"],
                    "y": pdata["y"],
                    "vx": pdata["vx"],
                    "vy": pdata["vy"],
                    "color": pdata["color"],
                    "state": pdata["state"],
                })
            }
        }
    }
}

function pauseMenu() {
    if (document.getElementById("pause").style.visibility == "visible") {
        document.getElementById("pause").style.visibility = "hidden";
    } else {
        document.getElementById("pause").style.visibility = "visible";
        document.getElementById("pauseName").innerHTML = user;
    }
}