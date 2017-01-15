function Animated(options){
    Sprite.call(this, options);
    this.source_width = 0;
    this.source_height = 0;
    this.columns = 0;
    this.rows = 0;
    this.auto_start = false;
    this.speed = 10;
    this.repeat = false;
    this.finish = null;

    this.animations = null;

    this.tick = 0;
    this.current_frame = 0;

    if(!options) return;

    this.source_width = options.source_width ? options.source_width : this.width;
    this.source_height = options.source_height ? options.source_height : this.height;
    this.columns = this.source_width / this.width;
    this.rows = this.source_height / this.height;
    this.auto_start = options.auto_start ? true : false;
    this.repeat = options.repeat ? true : false;
    this.finish = options.finish ? options.finish : null;

    this.animations = options.animations ? options.animations : [];
    this._registerAnimations();
    this.animations["default"] = {width: this.width, height: this.height, src: options.src, source_width: this.source_width, source_height: this.source_height};

    if(options.speed) {
        switch (options.speed){
            case "fastest":
                this.speed = 2;
                break;
            case "faster":
                this.speed = 4;
                break;
            case "fast":
                this.speed = 6;
                break;
            case "slow":
                this.speed = 14;
                break;
        }
    }
}

Animated.prototype = Object.create(Sprite.prototype);

Animated.prototype._calculateFrames = function () {
    return this.rows * this.columns;
};

Animated.prototype._getColumn = function () {
    return this.current_frame % this.columns;
};

Animated.prototype._getRow = function () {
    return Math.floor(this.current_frame / this.columns);
};

Animated.prototype._registerAnimations = function () {
    for (var animation in this.animations){
        Game().registerGraphics(this.animations[animation].src)
    }
}

Animated.prototype.addAnimation = function (name, src, width, height, source_width, source_height) {
    this.animations[name] = {width: width, height: height, src: src, source_width: source_width, source_height: source_height};
    Game().registerGraphics(src);
};

Animated.prototype.setAnimation = function (name, repeat) {
    if(!this.animations[name]) return;
    var animation = this.animations[name];
    this.width = animation.width;
    this.height = animation.height;
    this.graphic = Game().images["img/" + animation.src];
    this.source_width = animation.source_width;
    this.source_height = animation.source_height;
    this.columns = this.source_width / this.width;
    this.rows = this.source_height / this.height;
    var orig_repeat = this.repeat;
    this.repeat = repeat;
    this.current_frame = 0;
    this.tick = 0;
    if(!this.repeat) {
        this.finish = function () {
            this.setAnimation("default", orig_repeat);
        }.bind(this);
    }
};

Animated.prototype.cycleFrame = function () {
    this.current_frame += 1;
    if(this.current_frame >= this._calculateFrames()) {
        if(this.repeat){
            this.current_frame = 0;
        } else {
            this.finish();
        }
    }
};

Animated.prototype.tickFrame = function () {
    this.tick++;
    if(this.tick === this.speed) {
        this.tick = 0;
        this.current_frame += 1;
        if(this.current_frame >= this._calculateFrames()) {
            if(this.repeat){
                this.current_frame = 0;
            } else {
                this.finish();
            }
        }
    }
};

Sprite.prototype.drawRotated = function (offsetX) {
    Game().ctx.save();
    var half_width = this.width/2;
    var half_height = this.height/2;
    Game().ctx.translate(zoom(this.position.x + offsetX + half_width),zoom(this.position.y + half_height));
    Game().ctx.rotate(this.rotate);
    Game().ctx.drawImage(this.graphic, this._getColumn() * this.width, this._getRow() * this.height, this.width, this.height, zoom(half_width*-1), zoom(half_height*-1), zoom(this.width), zoom(this.height));
    Game().ctx.restore();
};

Animated.prototype.draw = function () {
    var offsetX = Game().controller.offsetX && !this.ignore_offset ? Game().controller.offsetX : 0;
    if(this.rotate > 0) {
        this.drawRotated(offsetX);
    } else {
        Game().ctx.drawImage(this.graphic, this._getColumn() * this.width, this._getRow() * this.height, this.width, this.height, zoom(this.position.x + offsetX), zoom(this.position.y), zoom(this.width), zoom(this.height));
    }
    if(this.auto_start){
        this.tick++;
        if(this.tick === this.speed) {
            this.tick = 0;
            this.current_frame += 1;
            if(this.current_frame >= this._calculateFrames()) {
                if(this.repeat){
                    this.current_frame = 0;
                } else {
                    this.finish();
                }
            }
        }
    }
};