// JavaScript source code

const sideLen = 10
var c = document.getElementById("canvas");
c.width = Math.floor((window.innerHeight * 0.95) / 10) * 10;
c.height = Math.floor((window.innerHeight * 0.95) / 10) * 10;
var canvas = c.getContext("2d");
var canvas = c.getContext("2d");
const unit = c.width / sideLen;
canvas.imageSmoothingEnabled = false;
canvas.webkitImageSmoothingEnabled = false;
canvas.mozImageSmoothingEnabled = false;
c.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

//Version Number
const version = "0.1";

var spritesheet = new Image();
spritesheet.src = 'Resoil-Spritesheetv0.1.png';
var menuTab = 0;
var buttons = document.getElementsByClassName("custom-button");
var statText = document.getElementById("statText");
var IsNew = JSON.parse(localStorage.getItem("IsNew"));
var readVersion = JSON.parse(localStorage.getItem("version"));
var SaveKey = 0;
var cropCounts = [0, 0, 0, 0, 0, 0, 0, 0]
var cells = []
var rockTier = 0;
var ToolActive = "None";
var ToolUnlocks = [false,false]
for (var x = 0; x < sideLen; x++) {
    cells.push([]);
    for (var y = 0; y < sideLen; y++) {
        cells[x].push(0);
    }

}
if (IsNew == null || readVersion != version) {
    spritesheet.onload = function () {
        populate(["dirt", "grass", "moss"], [15, 3, 0.075]);
    };
}
else {
    load();
    spritesheet.onload = function () {
        draw();
        console.log(exportSaveData());
    };
}
function showTab(tabId) {
    // Hide all tabs
    var tabs = document.getElementsByClassName("tab");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }

    // Show the selected tab
    var selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add("active");
    }
}
function exportSaveData() {
    const saveData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        saveData[key] = value;
    }

    const saveDataJson = btoa(JSON.stringify(saveData));
    return saveDataJson;
}
function load() {
    cropCounts = JSON.parse(localStorage.getItem("cropCounts"));
    cells = JSON.parse(localStorage.getItem("cells"));
    ToolActive = JSON.parse(localStorage.getItem("ToolActive"));
    ToolUnlocks = JSON.parse(localStorage.getItem("ToolUnlocks"));
}
var save = function () {
    localStorage.setItem("IsNew", JSON.stringify(false));
    localStorage.setItem("version", JSON.stringify(version));
    localStorage.setItem("cropCounts", JSON.stringify(cropCounts));
    localStorage.setItem("cells", JSON.stringify(cells));
    localStorage.setItem("ToolActive", JSON.stringify(ToolActive));
    localStorage.setItem("ToolUnlocks", JSON.stringify(ToolUnlocks));
}
const cropNames = ["Weeds", "Grain", "Pumpkins", "Wood", "Leaves", "Apples"];
const ToolNames = ["Clippers", "Rake"]

var pick = function (type, x, y, ExtraMult) {
    var fortuneMult = ExtraMult + 1;
    if (type == "grass") {
        playsound(weightedRandom([leafSound2, leafSound],[1, 1]),0.7,Math.random() * 0.5 + 1, 0.1);
        cropCounts[0] += (Math.floor(Math.random() * 3) * fortuneMult + Math.floor(Math.random() * 3) + 2) * fortuneMult;
        return "dirt";
    }
    else if (type == "moss") {
        playsound(weightedRandom([leafSound2,leafSound],[1,1]), 0.7, Math.random() * 0.5 + 1, 0.1);
        cropCounts[0] += 5 + Math.floor(Math.random() * 6) * fortuneMult + Math.floor(Math.random() * 6) * fortuneMult;
        return weightedRandom(["dirt", "grass"], [4, 1]);
    }
    else if (type == "grain") {
        playsound(weightedRandom([leafSound2, leafSound], [1, 1]), 0.7, Math.random() * 0.5 + 1, 0.1);
        cropCounts[1] += 1 + Math.floor(Math.random() * 2) * fortuneMult + Math.floor(Math.random() * 2) * fortuneMult;
        return weightedRandom(["dirt", "grass"], [9, 1]);
    }
    else if (type == "wheat") {
        playsound(weightedRandom([leafSound2, leafSound], [1, 1]), 0.7, Math.random() * 0.5 + 1, 0.1);
        cropCounts[1] += 3 + Math.floor(Math.random() * 5) * fortuneMult + Math.floor(Math.random() * 5) * fortuneMult;
        return "dirt";
    }
    else if (type == "stone") {
        playsound(StoneSound, 1, Math.random() * 0.3 + 0.5, 0.1);
        return weightedRandom(["moss", "wheat", "stone"], [4, 1, 1]);
    }
    else if (type == "pumpkin") {
        playsound(PickupSound, 0.7, Math.random() * 0.2 + 1.5, 0);
        cropCounts[2] += 1 * fortuneMult;
        return "dirt";
    }
    else if (type == "jack-o-lantern") {
        playsound(StoneSound, 1, Math.random() * 0.3 + 3, 0.1);
        let neighborsX = [0, 0, -1, 1]
        let neighborsY = [1, -1, 0, 0]
        if (cells[x + 1] == null) {
            neighborsX = [0, 0, -1];
        }
        if (cells[x - 1] == null) {
            neighborsX = [0, 0, 1];
        }
        let swap = "dirt"; //return dirt as failsafe

        for (var i = 0; i < neighborsX.length; i++) {
            console.log(i);
            if (cells[x + neighborsX[i]][y + neighborsY[i]] != null && (Math.random() < 1/(neighborsX.length - i)) ) {
                swap = cells[x + neighborsX[i]][y + neighborsY[i]];
                cells[x + neighborsX[i]][y + neighborsY[i]] = weightedRandom(["jack-o-lantern", "pumpkin"], [5, 1]);
                console.log("success");
                break;
            }
        }
        return swap;
    }
    else if (type == "stump") {
        playsound(PickupSound, 0.7, Math.random() * 0.2 + 1.5, 0);
        cropCounts[3] += 1 + Math.floor(Math.random() * 5) * fortuneMult;
        cropCounts[4] += Math.floor(Math.random() * 2) * fortuneMult;
        return "dirt";
    }
    else if (type == "tree") {
        playsound(WoodcutSound, 1, Math.random() * 0.5 + 0.7, 0);
        cropCounts[3] += 1 + Math.floor(Math.random() * 2) * fortuneMult + Math.floor(Math.random() * 3) * fortuneMult;
        cropCounts[4] += 1 + Math.floor(Math.random() * 3) * fortuneMult;
        return weightedRandom(["stump", "tree"], [1, 10]);
    }
    else if (type == "apple tree") {
        playsound(PickupSound, 0.7, Math.random() * 0.2 + 1.5, 0);
        cropCounts[3] += 1 + Math.floor(Math.random() * 2) * fortuneMult + Math.floor(Math.random() * 3) * fortuneMult;
        cropCounts[4] += 1 + Math.floor(Math.random() * 3) * fortuneMult;
        let neighborsX = [0, 0, -1, 1]
        let neighborsY = [1, -1, 0, 0]
        if (cells[x + 1] == null) {
            neighborsX = [0,0,-1];
        }
        if (cells[x - 1] == null) {
            neighborsX = [0, 0, 1];
        }
        for (var i = 0; i < neighborsX.length; i++) {
            if ((cells[x + neighborsX[i]][y + neighborsY[i]] == "dirt" || cells[x + neighborsX[i]][y + neighborsY[i]] == "moss" || cells[x + neighborsX[i]][y + neighborsY[i]] == null) & Math.random() <= 0.75) {
                cells[x + neighborsX[i]][y + neighborsY[i]] = "apple";
            }
        }
        
        return "tree";
    }
    else if (type == "apple") {
        playsound(PickupSound, 0.7, Math.random() * 0.2 + 1.5, 0);
        cropCounts[5] += 1 * fortuneMult;

        return "dirt";
    }
    else {
        return type;
    }
}
var OnClick = function (event) {
    const mouseX = event.clientX - c.getBoundingClientRect().left;
    const mouseY = event.clientY - c.getBoundingClientRect().top;

    const squareX = Math.floor(mouseX / unit);
    const squareY = Math.floor(mouseY / unit);

    cells[squareX][squareY] = pick(cells[squareX][squareY], squareX, squareY, 0);
    
    draw();
}
var OnRightClick = function (event) {
    const mouseX = event.clientX - c.getBoundingClientRect().left;
    const mouseY = event.clientY - c.getBoundingClientRect().top;

    const squareX = Math.floor(mouseX / unit);
    const squareY = Math.floor(mouseY / unit);

    if (ToolActive == "Clippers") {
        if (Math.random() <= 0.5) {
            cells[squareX][squareY] = pick(cells[squareX][squareY], squareX, squareY, 1);
        }
        else {
            playsound(SnipSound, 0.7, Math.random() * 0.2 + 1.5, 0);
        }
    }
    else if (ToolActive == "Rake") {
        cells[squareX][squareY] = pick(cells[squareX][squareY], squareX, squareY, 2);
        playsound(StoneSound, 0.7, 0.6, 0.1);
        var neighborsX = [-1, -1, -1, 0, 0, 1, 1, 1]
        var neighborsY = [-1, 0, 1, -1, 1, -1, 0, 1]
        for (var i = 0; i < neighborsX.length; i++) {
            try {
                cells[squareX + neighborsX[i]][squareY + neighborsY[i]] = "dirt";
            }
            catch {
                
            }
        }
        
    }
    draw();
}
var draw = function () {
    if (menuTab == 0) {
        var statText = document.getElementById("InventoryText")
        var displayedCrops = cropNames.map((value, i) => value + ": " + cropCounts[i])
        displayedCrops = displayedCrops.filter((_, i) => cropCounts[i] !== 0);
        statText.setHTML(displayedCrops.join("\n"));
    }
    else if (menuTab == 1) {
        var saveKey = exportSaveData();
        var SaveExport = document.getElementById("SaveExport")
        SaveExport.setHTML(saveKey);
    }
    else if (menuTab == 2) {
        for (var i = 0; i < ToolNames.length; i++) {
            if (ToolUnlocks[i]) {
                document.getElementById(ToolNames[i] + "Button").getElementsByTagName("img")[0].src = ToolNames[i] + ".png";
            }
            else {
                document.getElementById(ToolNames[i] + "Button").getElementsByTagName("img")[0].src = "LockIcon.png";
            }
            document.getElementById(ToolNames[i] + "Button").classList.remove("select");
        }
        if (ToolActive != "None") {
            document.getElementById(ToolActive + "Button").classList.add("select");
        }
        
    }
    canvas.fillStyle = "black"
    canvas.fillRect(0, 0, c.width, c.height)
    canvas.strokeStyle = "black";
    for (var x = 0; x < sideLen; x++) {
        for (var y = 0; y < sideLen; y++) {
            switch (cells[x][y]) {
                case "dirt":
                    canvas.drawImage(spritesheet, 0, 0, 16, 16, (x) * unit, (y) * unit, unit, unit);
                    break;
                case "grass":
                    canvas.drawImage(spritesheet, 16, 0, 16, 16, (x) * unit, (y) * unit, unit, unit);
                    break;
                case "moss":
                    canvas.drawImage(spritesheet, 32, 0, 16, 16, (x) * unit, (y) * unit, unit, unit);
                    break;
                case "grain":
                    canvas.drawImage(spritesheet, 48, 0, 16, 16, (x) * unit, (y) * unit, unit, unit);
                    break;
                case "stone":
                    canvas.drawImage(spritesheet, 96, 0, 16, 16, (x) * unit, (y) * unit, unit, unit);
                    break;
                case "wheat":
                    canvas.drawImage(spritesheet, 64, 0, 16, 16, (x) * unit, (y) * unit, unit, unit);
                    break;
                case "pumpkin":
                    canvas.drawImage(spritesheet, 80, 0, 16, 16, (x) * unit, (y) * unit, unit, unit);
                    break;
                case "flower":
                    canvas.drawImage(spritesheet, 112, 0, 16, 16, (x) * unit, (y) * unit, unit, unit);
                    break;
                case "stump":
                    canvas.drawImage(spritesheet, 160, 0, 16, 16, (x) * unit, (y) * unit, unit, unit);
                    break;
                case "tree":
                    canvas.drawImage(spritesheet, 144, 0, 16, 16, (x) * unit, (y) * unit, unit, unit);
                    break;
                case "apple tree":
                    canvas.drawImage(spritesheet, 128, 0, 16, 16, (x) * unit, (y) * unit, unit, unit);
                    break;
                case "apple":
                    canvas.drawImage(spritesheet, 176, 0, 16, 16, (x) * unit, (y) * unit, unit, unit);
                    break;
                case "jack-o-lantern":
                    canvas.drawImage(spritesheet, 192, 0, 16, 16, (x) * unit, (y) * unit, unit, unit);
                    break;
                default:
                    // This shouldn't happen if the code works
                    console.log("code broken :(");
                    break;
            }

            canvas.strokeRect((x) * unit, (y) * unit, unit, unit);
        }
    }
    save();
}
function weightedRandom(pool, weights) { 
    // Calculate the total weight
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);

    // Generate a random number between 0 and the total weight
    const randomNum = Math.random() * totalWeight;

    // Iterate through the weights and find the corresponding value
    let cumulativeWeight = 0;
    for (let i = 0; i < pool.length; i++) {
        cumulativeWeight += weights[i];
        if (randomNum < cumulativeWeight) {
            return pool[i];
        }
    }

    // This should never happen, but just in case
    return null;
}
function handleButtonClick(buttonId) {
    switch (buttonId) {
        case 'button1':
            populate(["dirt", "grass", "moss"], [15, 3, 0.075]);
            break;

        case 'button2':
            if (cropCounts[0] >= 100) {
                cropCounts[0] -= 100;
                populate(["dirt","grass","moss","grain"],[50,25,1,4]);
            }
            break;

        case 'button3':
            if (cropCounts[0] >= 200 & cropCounts[1] >= 50) {
                cropCounts[0] -= 200;
                cropCounts[1] -= 50;
                populate(["dirt", "grass", "moss", "grain", "wheat", "stone"], [20, 20, 5, 5, 2, 2]);
            }
            break;
        case 'button4':
            if (cropCounts[0] >= 500 & cropCounts[1] >= 75) {
                cropCounts[0] -= 500;
                cropCounts[1] -= 75;
                populate(["dirt", "grass", "moss", "grain", "wheat", "stone", "jack-o-lantern"], [10, 25, 8, 7, 5, 3, 0.2]);
            }
            break;
        case 'button5':
            if (cropCounts[0] >= 500 & cropCounts[1] >= 100 & cropCounts[2] >= 2) {
                cropCounts[0] -= 500;
                cropCounts[1] -= 100;
                cropCounts[2] -= 2;
                populate(["dirt", "grass", "moss", "wheat", "stone", "jack-o-lantern", "tree","stump"], [10, 50, 20, 20, 10, 2, 6, 2]);
            }
            break;
        case 'button6':
            if (cropCounts[0] >= 700 & cropCounts[1] >= 150 & cropCounts[2] >= 5 & cropCounts[3] >= 500 & cropCounts[4] >= 500) {
                cropCounts[0] -= 700;
                cropCounts[1] -= 150;
                cropCounts[2] -= 5;
                cropCounts[3] -= 500;
                cropCounts[4] -= 500;
                populate(["dirt", "moss", "wheat", "stone", "jack-o-lantern", "tree", "stump", "apple tree"], [30, 15, 25, 10, 5, 10, 2, 2]);
            }
            break;
        
        //Menu Cases
        case 'Inventory': 
            menuTab = 0;
            showTab("InventoryMenu");
            draw();
            break;
        case 'Save': 
            menuTab = 1;
            showTab("SaveMenu");
            draw();
            break;
        case 'Tools':
            menuTab = 2;
            showTab("ToolsMenu");
            draw();
            break;
        //Tools Cases
        case 'ClippersButton':
            if (handleTool("Clippers", 0, cropCounts[1] >= 100)) {
                cropCounts[1] -= 100;
            }
            draw();
            break;
        case 'RakeButton':
            if (handleTool("Rake", 1, cropCounts[2] >= 10)) {
                cropCounts[2] -= 10;
            }
            draw();
            break;
        //Save Tab Cases
        case 'ImportButton':
            const backupData = atob(exportSaveData());
            // Clear existing data in localStorage
            localStorage.clear();

            // Set all data from saveData object back to localStorage
            try {
                const obfuscatedData = document.getElementById('SaveImport').value;
                const saveDataJson = atob(obfuscatedData);
                const saveData = JSON.parse(saveDataJson);
                for (const key in saveData) {
                    if (saveData.hasOwnProperty(key)) {
                        localStorage.setItem(key, saveData[key]);
                    }
                }
                location.reload();
                break;
            }
            catch (error) {
                alert("Enter a valid save code!")
                for (const key in backupData) {
                    if (saveData.hasOwnProperty(key)) {
                        localStorage.setItem(key, saveData[key]);
                    }
                }
            }
            draw();
            break;
        case 'ClearButton':
            if (window.confirm("Are you sure you want to clear your save data?")) {
                localStorage.clear();
                location.reload();
                break;
            }
            break;
        default:
            console.log("Unknown button clicked!");
            break;
    }
}
var handleTool = function (name, id, costCondition) {
    if (ToolUnlocks[id]) {
        if (ToolActive == name) {
            ToolActive = "None";
        }
        else {
            ToolActive = name;
        }
    }
    else if (!ToolUnlocks[id]) {
        if (costCondition) {
            ToolUnlocks[id] = true;
            ToolActive = name;
            return true;
        }
    }
    return false
}
var populate = function (pool, weights) {
    cells = [];
    for (var x = 0; x < sideLen; x++) {
        cells.push([]);
        for (var y = 0; y < sideLen; y++) {
            cells[x].push(weightedRandom(pool, weights));
        }
    }
    console.log(cells);
    draw();
}

var playsound = function (sound, volume, pitch, startTime) {
    sound.currentTime = startTime;
    sound.playbackRate = pitch;
    sound.volume = volume;
    sound.play();
}

c.onclick = function (event) { OnClick(event); }
c.oncontextmenu = function (event) { OnRightClick(event); }