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

var spritesheet = new Image();
spritesheet.src = 'Resoil-Spritesheet.png';
var menuTab = 0;
var buttons = document.getElementsByClassName("custom-button");
var statText = document.getElementById("statText");
var IsNew = localStorage.getItem("IsNew");
var SaveKey = 0;
var cropCounts = [0, 0, 0, 0, 0, 0, 0, 0]
var petalCounts = [0, 0, 0, 0]
var petalType = "None";
var petalUses = 0;
var fortune = 0;
var combo = 0;
var flowerChance = 0;
var cells = []
var rockTier = 0;
console.log(IsNew);
if (IsNew == null) {
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
    petalCounts = JSON.parse(localStorage.getItem("petalCounts"));
    petalType = JSON.parse(localStorage.getItem("petalType"));
    petalUses = JSON.parse(localStorage.getItem("petalUses"));
    fortune = JSON.parse(localStorage.getItem("fortune"));
    combo = JSON.parse(localStorage.getItem("combo"));
    flowerChance = JSON.parse(localStorage.getItem("flowerChance"));
    cells = JSON.parse(localStorage.getItem("cells"));
    rockTier = JSON.parse(localStorage.getItem("rockTier"));
}
var save = function () {
    console.log("saved!")
    localStorage.setItem("IsNew", JSON.stringify(null));
    localStorage.setItem("cropCounts", JSON.stringify(cropCounts));
    localStorage.setItem("petalCounts", JSON.stringify(petalCounts));
    localStorage.setItem("petalType", JSON.stringify(petalType));
    localStorage.setItem("petalUses", JSON.stringify(petalUses));
    localStorage.setItem("fortune", JSON.stringify(fortune));
    localStorage.setItem("combo", JSON.stringify(combo));
    localStorage.setItem("flowerChance", JSON.stringify(flowerChance));
    localStorage.setItem("cells", JSON.stringify(cells));
    localStorage.setItem("rockTier", JSON.stringify(rockTier));
}
const RockDropPools = [["moss", "wheat", "stone"], ["moss", "wheat", "stone"], ["moss", "wheat", "stone", "pumpkin"], ["moss", "wheat", "stone", "pumpkin"], ["moss", "wheat", "stone", "pumpkin", "apple"], ["moss", "wheat", "stone", "pumpkin", "apple"]];
const RockDropWeights = [[4, 1, 1], [4, 4, 1], [4, 6, 1, 1], [2, 6, 0.5, 2.5], [2, 6, 0.5, 2.5, 1], [4, 4, 1, 4, 4]];
const cropNames = ["Weeds", "Grain", "Pumpkins", "Wood", "Leaves", "Apples"];
const petalNames = ["Picking", "Destructive", "Digging", "Flowering"]
for (var x = 0; x < sideLen; x++) {
    cells.push([]);
    for (var y = 0; y < sideLen; y++) {
        cells[x].push(0);
    }

}


var pick = function (type, fromCombo, x, y) {
    var willFlower = false;
    if (!fromCombo & petalType == "Flowering" & type != "dirt") {
        petalUses--;
        if (Math.random() <= 0.1) {
            willFlower = true;
        }
    }
    let ExtraCombo = 0;
    if (!fromCombo & petalType == "Destructive" && type != "dirt") {
        petalUses--;
        ExtraCombo += 5 + Math.floor(Math.random() * 11);
    }
    let fortuneMult = (Math.floor(fortune / 10)) + Math.floor(Math.random() + ((fortune / 10) % 1)) + 1;
    if (!fromCombo & petalType == "Picking" & type != "dirt" & type != "stone") {
        petalUses--;
        fortuneMult += 3 + Math.floor(Math.random() * 4);
    }
    if (!fromCombo & type != "dirt") {
        for (var i = 0; i < combo + ExtraCombo; i++) {
            if (Math.random() < 0.5) {
                let cellX = Math.floor(Math.random() * 10);
                let cellY = Math.floor(Math.random() * 10);
                cells[cellX][cellY] = pick(cells[cellX][cellY], true, cellX, cellY);
            }
        }
    }
    if (type != "dirt" & type != "flower") {
        for (var i = 0; i < flowerChance + 1; i++) {
            if (Math.random() < 0.0005) {
                willFlower = true;
            }
        }
    }

    if (type == "grass") {
        cropCounts[0] += (Math.floor(Math.random() * 3) * fortuneMult + Math.floor(Math.random() * 3) + 2) * fortuneMult;
        if (willFlower) {
            return "flower";
        }
        return "dirt";
    }
    else if (type == "moss") {
        cropCounts[0] += 5 + Math.floor(Math.random() * 6) * fortuneMult + Math.floor(Math.random() * 6) * fortuneMult;
        if (willFlower) {
            return "flower";
        }
        return weightedRandom(["dirt", "grass"], [4, 1]);
    }
    else if (type == "grain") {
        cropCounts[1] += 1 + Math.floor(Math.random() * 2) * fortuneMult + Math.floor(Math.random() * 2) * fortuneMult;
        if (willFlower) {
            return "flower";
        }
        return weightedRandom(["dirt", "grass"], [9, 1]);
    }
    else if (type == "wheat") {
        cropCounts[1] += 3 + Math.floor(Math.random() * 5) * fortuneMult + Math.floor(Math.random() * 5) * fortuneMult;
        if (willFlower) {
            return "flower";
        }
        return "dirt";
    }
    else if (type == "stone") {
        if (willFlower) {
            return "flower";
        }
        return weightedRandom(["moss", "wheat", "stone"], [4, 1, 1]);
    }
    else if (type == "pumpkin") {
        cropCounts[2] += 1 * fortuneMult;
        if (willFlower) {
            return "flower";
        }
        
        return "dirt";
    }
    else if (type == "flower") {
        let rolls = 1 + Math.floor(Math.random() * 3);
        for (var i = 0; i < rolls; i++) {
            petalCounts[Math.floor(Math.random() * 4)] += 1;
        }
        return "dirt";
    }
    else if (type == "stump") {
        cropCounts[3] += 1 + Math.floor(Math.random() * 5) * fortuneMult;
        cropCounts[4] += Math.floor(Math.random() * 2) * fortuneMult;
        if (willFlower) {
            return "flower";
        }
        return "dirt";
    }
    else if (type == "tree") {
        cropCounts[3] += 1 + Math.floor(Math.random() * 2) * fortuneMult + Math.floor(Math.random() * 3) * fortuneMult;
        cropCounts[4] += 1 + Math.floor(Math.random() * 3) * fortuneMult;
        return weightedRandom(["stump", "tree"], [1, 10]);
    }
    else if (type == "apple tree" && !fromCombo) {
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
        cropCounts[5] += 1 * fortuneMult;
        if (willFlower) {
            return "flower";
        }

        return "dirt";
    }
    else if (!fromCombo & type == "dirt" & petalType == "Digging") {
        petalUses--;
        return "stone";
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

    cells[squareX][squareY] = pick(cells[squareX][squareY], false, squareX, squareY);
    
    draw();
}
var draw = function () {
    if (petalUses == 0) {
        petalType = "None"
    }
    console.log(menuTab);
    if (menuTab == 0) {
        var statText = document.getElementById("InventoryText")
        var displayedCrops = cropNames.map((value, i) => value + ": " + cropCounts[i])
        displayedCrops = displayedCrops.filter((_, i) => cropCounts[i] !== 0);
        var displayedPetals = petalNames.map((value, i) => value + " Petals: " + petalCounts[i])
        displayedPetals = displayedPetals.filter((_, i) => petalCounts[i] !== 0);
        statText.setHTML(displayedCrops.join("\n") + `\n\nPetal Active: ${petalType}\nUses Left: ${petalUses}/15\nYour Petals:\n` + displayedPetals.join("\n"));
    }
    else if (menuTab == 1) {
        var saveKey = exportSaveData();
        var SaveExport = document.getElementById("SaveExport")
        SaveExport.setHTML(saveKey);
    }
    document.getElementById("upgrade2").setHTML(`Combo(${combo}): <br /> ${75 + combo * 50} grain <br /> ${1 + Math.floor(combo * 0.5)} pumpkin`);
    document.getElementById("upgrade1").setHTML(`Fortune(${fortune}): <br /> ${300 + fortune * 100} weeds <br /> ${10 + fortune * 10} Grain`);
    document.getElementById("upgrade3").setHTML(`Flower Spawn(${flowerChance}): <br /> ${100 + flowerChance * 75} Grain`);
    document.getElementById("upgrade4").setHTML(`Rock Luck(${rockTier}/5): <br /> ${3 + rockTier * 3} pumpkins`)
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
                populate(["dirt", "grass", "moss", "grain", "wheat", "stone", "pumpkin"], [10, 25, 8, 7, 5, 3, 0.1]);
            }
            break;
        case 'button5':
            if (cropCounts[0] >= 500 & cropCounts[1] >= 100 & cropCounts[2] >= 2) {
                cropCounts[0] -= 500;
                cropCounts[1] -= 100;
                cropCounts[2] -= 2;
                populate(["dirt", "grass", "moss", "wheat", "stone", "pumpkin", "tree","stump"], [10, 50, 20, 20, 10, 2, 6, 2]);
            }
            break;
        case 'button6':
            if (cropCounts[0] >= 700 & cropCounts[1] >= 150 & cropCounts[2] >= 5 & cropCounts[3] >= 500 & cropCounts[4] >= 500) {
                cropCounts[0] -= 700;
                cropCounts[1] -= 150;
                cropCounts[2] -= 5;
                cropCounts[3] -= 500;
                cropCounts[4] -= 500;
                populate(["dirt", "moss", "wheat", "stone", "pumpkin", "tree", "stump", "apple tree"], [30, 15, 25, 10, 5, 10, 2, 2]);
            }
            break;
        // upgrade cases
        case 'upgrade1':
            if (cropCounts[0] >= 300 + fortune * 100 & cropCounts[1] >= 10 + fortune * 10) {
                cropCounts[0] -= 300 + fortune * 100;
                cropCounts[1] -= 10 + fortune * 10;
                fortune++;
                draw();
                
            }
            break;
        case 'upgrade2':
            if (cropCounts[1] >= 75 + combo * 50 & cropCounts[2] >= 1 + Math.floor(combo * 0.5)) {
                cropCounts[1] -= 75 + combo * 50;
                cropCounts[2] -= 1 + Math.floor(combo * 0.5);
                combo++;
                draw();
                
            }
            break;
        case 'upgrade3':
            if (cropCounts[1] >= 100 + flowerChance * 75) {
                cropCounts[1] -= 100 + flowerChance * 75;
                flowerChance++;
                draw();
            }
            break;
        case 'upgrade4':
            if (cropCounts[2] >= 3 + rockTier * 3 && rockTier <= 5) {
                cropCounts[2] -= 3 + rockTier * 3;
                rockTier++;
                draw();
            }
            break;
        case 'petalButton':
            if (petalCounts.reduce((accumulator, currentValue) => accumulator + currentValue, 0) > 0) {
                petalUses = 15;
                petalType = weightedRandom(petalNames, petalCounts);
                petalCounts[petalNames.findIndex((element) => element === petalType)] -= 1;
                draw();
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


c.onclick = function (event) { OnClick(event); }