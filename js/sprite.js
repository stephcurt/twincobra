function Sprite(options){

    this.graphic = null;
    this.position = new Position(0, 0);
    this.width = 0;
    this.height = 0;
    this.name = "";
    this.unattached = false;
    this.ignore_offset = false;
    this.angle = 0;

    if(!options) return;

    this.graphic = Game().registerGraphics(options.src);
    this.position = new Position(options.x ? options.x : 0, options.y ? options.y : 0);
    this.width = options.width ? options.width : 0;
    this.height = options.height ? options.height : 0;
    this.name = options.name ? options.name : 0;
    this.unattached = options.unattached ? options.unattached : false;
    this.ignore_offset = options.ignore_offset ? options.ignore_offset : false;
    this.angle = options.angle ? options.angle : 0;

    if(!this.old && !this.unattached) {
        Game().controller.registerObject(this.name, this);
    }
}

Sprite.prototype.drawRotated = function (offsetX) {
    Game().ctx.save();
    var half_width = this.width/2;
    var half_height = this.height/2;
    Game().ctx.translate(zoom(this.position.x + offsetX + half_width),zoom(this.position.y + half_height));
    Game().ctx.rotate(this.rotate);
    Game().ctx.drawImage(zoom(half_width*-1), zoom(half_height*-1), zoom(this.width), zoom(this.height));
    Game().ctx.restore();
};

Sprite.prototype.draw = function () {
    var offsetX = Game().controller.offsetX && !this.ignore_offset  ? Game().controller.offsetX : 0;
    if(this.rotate > 0) {
        this.drawRotated(offsetX);
    } else {
        Game().ctx.drawImage(this.graphic,zoom(this.position.x+offsetX),zoom(this.position.y),zoom(this.width),zoom(this.height));
    }
};