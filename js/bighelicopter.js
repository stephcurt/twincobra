function BigHelicopter(options){

    this.life = 0;
    this.meander = 0;
    this.meander_counter = 0;

    if(!options) return;

    options.y = -100;
    options.width = 32;
    options.height = 64;
    options.src = "big_helicopter.png";
    options.source_width = 64;
    options.source_height = 64;
    options.auto_start = true;
    options.repeat = true;
    options.explosion = {width: 64, height: 64, src: "big_helicopter_die.png", source_width: 512, source_height: 64};
    options.bullet_type = "big_helicopter";
    options.bullets = 3;
    options.speed = "fastest";
    options.animations = [];
    options.animations["flash"] = {width: 32, height: 64, src: "big_helicopter_flash.png", source_width: 32, source_height: 64};

    Enemy.call(this, options);

    this.life = 10;
    this.meander = 0;
    this.meander_counter = 0;
}

BigHelicopter.prototype = Object.create(Enemy.prototype);

BigHelicopter.prototype.move = function () {
    if(this.meander_counter === 0) {
        if(this.angle < Math.PI){
            this.shoot();
        }
        this.meander_counter = getRandomInt(30,90);
        this.meander = getRandomInt(1,4);
        if(this.position.x <= 0) this.meander = 1;
        else if (this.position.x >= Settings.width + this.width) this.meander = 2;
    }
    switch(this.meander) {
        case 1:
            this.position.x += .2;
            break;
        case 2:
            this.position.x -= .2;
            break;
        case 3:
            this.position.x += .2;
            this.position.y += .2;
            break;
        case 4:
            this.position.x -= .2;
            this.position.y += .2;
            break;
    }
    this.position.y +=.4;
    this.meander_counter--;
};

BigHelicopter.prototype.hit = function () {
    if(this.name !== "explosion"){
        this.setAnimation("flash", false)
        this.life -= 1;
        if(this.life === 0){
            this.explode();
        }
    }
};
