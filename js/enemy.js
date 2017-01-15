function Enemy(options){

    this.die = false;
    this.explosion =  null;
    this.time = 0;
    this.bullets = 0;
    this.bullet_type = "";
    this.angle = 0;
    this.targetPosition = null;
    this.clock = 0;
    this.only_bullets_collide = false;

    this.timer = null;

    if(!options) return;

    options.name = "enemy";

    Animated.call(this, options);

    this.explosion = options.explosion ? options.explosion : null;
    this.time = options.time * 30;
    this.bullets = options.bullets ? options.bullets : 1;
    this.bullet_type = options.bullet_type ? options.bullet_type : this.name;
    this.angle = 0;
    this.targetPosition = new Position(Settings.width/2,Settings.height);
    this.clock = 0;
    this.only_bullets_collide = options.only_bullets_collide ? options.only_bullets_collide : false;

    Game().controller.registerColliders("enemy", this);

    this.timer = setInterval(this.timer.bind(this), 30);
}

Enemy.prototype = Object.create(Animated.prototype);

Enemy.prototype.move = function () {
    //overriden in child classes
};

Enemy.prototype._die = function () {
    window.clearInterval(this.timer);
    this.die = true;
};

Enemy.prototype.explode = function () {
    Animated.call(this, {name: "explosion", x: this.position.x - ((this.explosion.width - this.width)/2), y: this.position.y - ((this.explosion.height - this.height)/2), width: this.explosion.width, height: this.explosion.height, src: this.explosion.src,
        source_width: this.explosion.source_width, source_height: this.explosion.source_height, auto_start: true, repeat: false,
        finish: this._die});
};

Enemy.prototype.timer = function () {
    if(this.name !== "explosion"){
        if(this.time > 0) {
            this.time -= 1;
            return;
        }
        this.move();
    }
    if(this.position.y > Settings.height) {
        this.die = true;
    }
    this.clock +=1;
};

Enemy.prototype.updateTargetPosition = function (x,y) {
    this.targetPosition.x = x;
    this.targetPosition.y = y;

    this.angle = Math.atan2((y-(this.position.y + (this.height/2))), x-((this.position.x + (this.width / 2))));
    if(this.angle < 0) this.angle = (Math.PI * 2) + this.angle;
};

Enemy.prototype.shoot = function () {
    var i, bullet;
    for(i = 0; i < this.bullets; i++){
        bullet = new Bullet({x: this.position.x + (this.width / 2) - 4, y: this.position.y + this.height, type: this.bullet_type, number: i+1, side: "enemy", angle: this.angle});
        Game().controller.registerBullet(bullet);
    }
};
