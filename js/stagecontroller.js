function StageController() {
    Controller.call(this);
    this.mover = null;
    this.press = {};
    this.colliders = [];
    this.movers = [];
    this.offsetX = 0;
}

StageController.prototype = Object.create(Controller.prototype);

StageController.prototype.registerColliders = function(type, object) {
    if (this.colliders[type] && this.colliders[type] instanceof Array) {
        this.colliders[type].push(object);
    } else {
        this.colliders[type] = [object];
    }
};

StageController.prototype.registerMovers = function(object) {
    this.movers.push(object);
};

StageController.prototype.registerBullet = function(bullet) {
    Game().layers[1].objects.push(bullet);
};

StageController.prototype.updateXOffset = function (x) {
    this.offsetX += x;
};

StageController.prototype.setXOffset = function (x) {
    this.offsetX = x;
};

StageController.prototype.move = function (distance) {
    var i;
    for(i=0;i<this.movers.length;i++){
        this.movers[i].position.y += distance;
    }
};

StageController.prototype.init = function (speed) {
    document.addEventListener("keydown", Game().controller._keyDownHandler.bind(this), false);
    document.addEventListener("keyup", Game().controller._keyUpHandler.bind(this), false);
    this.timer = setInterval(Game().controller.__proto__.timer.bind(this), 30);
    var game_speed = convertGameSpeed(speed);
    this.game_speed = game_speed ? game_speed : 0;
};

StageController.prototype.clearEvents = function () {
    document.removeEventListener("keydown", Game().controller._keyDownHandler.bind(this));
    document.removeEventListener("keyup", Game().controller._keyUpHandler.bind(this));
};

StageController.prototype._keyDownHandler = function (e) {
    this.press[e.keyCode] = true;
};

StageController.prototype._keyUpHandler = function (e) {
    this.press[e.keyCode] = false;
};

StageController.prototype.timer = function () {
    this._playerKeys();
    this._collision();
    this._targetting();
    this._cleanUp();
};

StageController.prototype._playerKeys = function () {
    if (this.press["37"]) {
        this.objects.player.move("l");
    }
    if (this.press["38"]) {
        this.objects.player.move("u");
    }
    if (this.press["39"]) {
        this.objects.player.move("r");
    }
    if (this.press["40"]) {
        this.objects.player.move("d");
    }
    if (this.press["32"]) {
        this.objects.player.shoot(this.registerBullet);
    }
    if (this.press["81"]) {
        Game().toggleZoom();
        this.press["81"] = false;
    }
    if (this.press["84"]) {
        Game().togglePauseScroll();
        this.press["84"] = false;
    }
    if (this.press["82"]) {
        Game().toggleAggro();
        this.press["82"] = false;
    }
    if (this.press["67"]) {
        Game().toggleCollision();
        this.press["67"] = false;
    }
    if (this.press["76"]) {
        Game().loadLevel(Settings.current_level);
        this.press["76"] = false;
    }
};

StageController.prototype._collision = function() {
    if(!this.colliders["enemy"] || !this.colliders["player"]) return;
    var i, j;
    for(i=0;i<this.colliders["player"].length;i++){
        for(j=0;j<this.colliders["enemy"].length;j++) {
            collided = resolveCollision(this.colliders["player"][i], this.colliders["enemy"][j]);

            if(this.colliders["player"][i].name === "bullet" && this.colliders["enemy"][j].name === "bullet") {
                collided = false;
            }

            if(this.colliders["player"][i].name === "explosion" || this.colliders["enemy"][j].name === "explosion") {
                collided = false;
            }

            if(this.colliders["player"][i].name !== "bullet" && this.colliders["enemy"][j].only_bullets_collide) {
                collided = false;
            }

            if(collided){
                this.colliders["player"][i].hit();
                this.colliders["enemy"][j].hit();
            }
        }
    }
};

StageController.prototype._targetting = function () {
    if(!this.objects["enemy"]) return;
    var enemies = this.objects["enemy"] instanceof Array ? this.objects["enemy"] : [this.objects["enemy"]];
    var i;
    for(i=0;i<enemies.length;i++) {
        enemies[i].updateTargetPosition(this.objects.player.position.x + (this.objects.player.width / 2), this.objects.player.position.y);
    }
};

StageController.prototype._cleanUp = function() {
    var i;
    for(i=Game().layers[1].objects.length-1; i>=0; i--){
        if(Game().layers[1].objects[i].die){
            Game().layers[1].objects.splice(i,1);
        }
    }
    for (var property in this.objects) {
        if(this.objects[property].die){
            delete this.objects[property];
        }
        if(this.objects[property] instanceof Array){
            for(i=this.objects[property].length-1; i>=0; i--){
                if(this.objects[property][i].die){
                    this.objects[property].splice(i,1);
                }
            }
            if(this.objects[property].length === 0){
                delete this.objects[property];
            }
        }
    }
    if(this.colliders["enemy"]){
        for(i=this.colliders["enemy"].length-1; i>=0; i--){
            if(this.colliders["enemy"][i].die){
                this.colliders["enemy"].splice(i,1);
            }
        }
    }
    for(i=this.colliders["player"].length-1; i>=0; i--){
        if(this.colliders["player"][i].die){
            this.colliders["player"].splice(i,1);
        }
    }
};