function Bullet(options){

    this.die = false;
    this.side = "";
    this.angle = 0;
    this.number = 0;
    this.type = "";
    this.velocity = 0;

    if(!options) return;

    options.name = "bullet";
    options.width = 8;
    options.height = 11;

    switch(options.type) {
        case "turret":
        case "big_helicopter":
        case "helicopter":
            options.src = "helicopter_bullets.png";
            break;
        default:
            options.src = "player_bullets_default.png";
            break;
    }

    Sprite.call(this, options);

    this.die = Settings.no_aggro ? true : false;
    this.side = options.side ? options.side : "player";
    this.angle = options.angle ? options.angle : Math.PI;
    this.number = options.number ? options.number : 1;
    this.type = options.type ? options.type : "default";

    switch(this.type) {
        case "big_helicopter":
            this.velocity = 4;
            if(this.number === 1) this.angle -= Math.PI /6;
            else if(this.number === 3) this.angle += Math.PI /6;
            break;
        case "turret":
            this.shoot_up = true;
        case "helicopter":
            this.velocity = 6;
            break;
        default:
            this.velocity = 16;
            break;
    }

    Game().controller.registerColliders(this.side, this);
}

Bullet.prototype = Object.create(Sprite.prototype);

Bullet.prototype._move = function () {
    this.position.x += this.velocity * Math.cos(this.angle);
    this.position.y += this.velocity * Math.sin(this.angle);

    if(this.position.y < -1 * this.height || this.position.y > Settings.height) {
        this.die = true;
    }
};

Bullet.prototype.hit = function () {
    this.die = true;
};

Bullet.prototype.draw = function () {
    Object.getPrototypeOf(Bullet.prototype).draw.call(this);
    this._move();
};

