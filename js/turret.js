function Turret(options){

    this.fire_counter = 0;

    if(!options) return;

    options.width = 25;
    options.height = 26;
    options.src = "turret.png";
    options.source_width = 25;
    options.source_height = 26;
    options.auto_start = true;
    options.repeat = true;
    options.explosion = {width: 33, height: 33, src: "helicopter_die.png", source_width: 198, source_height: 33};
    options.bullet_type = "turret";
    options.only_bullets_collide = true;

    Enemy.call(this, options);

    this.fire_counter = 0;

    Game().controller.registerMovers(this);
}

Turret.prototype = Object.create(Enemy.prototype);

Turret.prototype.move = function () {
    var i;
    for(i=1;i<=8;i++){
        if(this.angle < ((i * Math.PI)/4)+(Math.PI/8)){
            this.angle = Math.floor(((i * Math.PI)/4) * 100)/100;
            break;
        }
    }
    this.rotate = this.angle;

    if(--this.fire_counter <= 0){
        this.fire_counter = getRandomInt(30,90);
        this.shoot();
    }
};

Turret.prototype.hit = function () {
    if(this.name !== "explosion"){
        this.explode();
    }
};
