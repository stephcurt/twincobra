function zoom(number) {
    return number * Settings.zoom;
}

function loadJSON(callback, json) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', json, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function resolveCollision(box1, box2) {
    if(Settings.no_collision) return false;

    var offsetX = Game().controller.offsetX ? Game().controller.offsetX : 0;
    var x1 = box1.ignore_offset ? box1.position.x : box1.position.x + offsetX;
    var x2 = box2.ignore_offset ? box2.position.x : box2.position.x + offsetX;
    if (x1 < x2 + box2.width &&
        x1 + box1.width > x2 &&
        box1.position.y < box2.position.y + box2.height &&
        box1.height + box1.position.y > box2.position.y) {
        return true;
    }
    return false;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function convertGameSpeed(speed) {
    if(!speed) return 0;

    return Settings.game_speed[speed];
}