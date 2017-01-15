function Player(){
    var options = [];

    options.name = "player";
    options.y = Settings.height - 100;
    options.x = (Settings.width / 2) - 15;
    options.width = 30;
    options.height = 45;
    options.src = "player.png";
    options.source_width = 90;
    options.source_height = 45;
    options.auto_start = true;
    options.repeat = true;
    options.speed = "fastest";

    Animated.call(this, options);

    this.explode = false;
    this.cooldown = 0;
    this.fire_cooldown = 0;

    this.center_graphic = new Image();
    this.center_graphic.src = "img/player.png";
    this.left_graphic = new Image();
    this.left_graphic.src = "img/player_left.png";
    this.right_graphic = new Image();
    this.right_graphic.src = "img/player_right.png";

    this.board_x = this.position.x + Settings.board_diff();

    this.ignore_offset = true;

    if(!this.old){
        Game().controller.registerColliders("player", this);
        this.old = true;
    }
}

Player.prototype = Object.create(Animated.prototype);

Player.prototype.move = function (direction) {
    if(this.name !== "explosion") {
        this.position.y -= direction === "u" ? 4 : 0;
        this.position.y += direction === "d" ? 4 : 0;
        this.position.x -= direction === "l" ? 4 : 0;
        this.position.x += direction === "r" ? 4 : 0;
        this.board_x -= direction === "l" ? 4 : 0;
        this.board_x += direction === "r" ? 4 : 0;

        if(this.position.x < 0) {
            this.position.x = 0;
        } else if(this.position.x > Settings.width - this.width){
            this.position.x = Settings.width - this.width;
        }

        var offsetX = Game().controller.offsetX ? Game().controller.offsetX : 0;

        var dx = direction === "l" ? 4 : 0;
        dx = direction === "r" ? -4 : dx;

        Game().controller.updateXOffset(dx);
        this.board_x -= dx;

        offsetX = Game().controller.offsetX;

        if(offsetX > 70) Game().controller.setXOffset(70);
        else if (offsetX < -70) Game().controller.setXOffset(-70);

        if(this.board_x < 0){
            this.board_x = 0;
        } else if(this.board_x > Settings.board_width - this.width){
            this.board_x = Settings.board_width - this.width;
        }

        if(direction === "r"){
            this.graphic = this.left_graphic;
        } else if(direction === "l"){
            this.graphic = this.right_graphic;
        }
    }
};

Player.prototype.hit = function () {
    if(this.name !== "explosion" && this.cooldown <= 0){
        this.explode = true;
    }
};

Player.prototype.shoot = function (callback) {
    if(this.name !== "explosion" && this.fire_cooldown <= 0) {
        var bullet = new Bullet({x: this.position.x + (this.width / 2) - 4, y: this.position.y, angle: (3*Math.PI)/2, ignore_offset: true});
        callback(bullet);
        this.fire_cooldown = 10;
    }
};

Player.prototype.draw = function () {
    if(!this.explode){
        Object.getPrototypeOf(Player.prototype).draw.call(this);
        if(this.cooldown>0)this.cooldown -=1;
        if(this.fire_cooldown>0)this.fire_cooldown -=1;
        if(this.name !== "explosion") this.graphic = this.center_graphic;
    } else {
        Animated.call(this, {name: "explosion", x: this.position.x - ((47 - this.width)/2), y: this.position.y - ((47 - this.height)/2), width: 47, height: 47, src: "player_die.png",
            source_width: 376, source_height: 47, auto_start: true, repeat: false, speed: "fast", ignore_offset: true,
            finish: function(){
                Player.apply(this);
                this.cooldown = 30;
            }});
        this.explode = false;
    }
};