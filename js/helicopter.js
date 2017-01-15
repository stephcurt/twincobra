function Helicopter(options){

    this.center_graphic = null;
    this.left_graphic = null;
    this.right_graphic = null;

    if(!options) return;

    options.y = options.y ? options.y : -100;
    options.width = 28;
    options.height = 37;
    options.src = "helicopter.png";
    options.source_width = 56;
    options.source_height = 37;
    options.auto_start = true;
    options.repeat = true;
    options.explosion = {width: 33, height: 33, src: "helicopter_die.png", source_width: 198, source_height: 33};
    options.bullet_type = "helicopter";
    options.speed = "fastest";

    Enemy.call(this, options);

    this.center_graphic = new Image();
    this.center_graphic.src = "img/helicopter.png";
    this.left_graphic = new Image();
    this.left_graphic.src = "img/helicopter_left.png";
    this.right_graphic = new Image();
    this.right_graphic.src = "img/helicopter_right.png";
}

Helicopter.prototype = Object.create(Enemy.prototype);

Helicopter.prototype.move = function () {
    if(this.targetPosition.y > this.position.y) {
        if (this.targetPosition.x > this.position.x) {
            this.position.x += 1;
            this.graphic = this.right_graphic;
        }
        else if (this.targetPosition.x < this.position.x) {
            this.position.x -= 1;
            this.graphic = this.left_graphic;
        }
        else {
            this.graphic = this.center_graphic;
        }
        this.position.y += 3;
    }
    else this.position.y +=1;

    if(this.clock % 40 === 0 && this.angle < Math.PI) {
        this.shoot();
    }
};

Helicopter.prototype.hit = function () {
    if(this.name !== "explosion"){
        this.explode();
    }
};
