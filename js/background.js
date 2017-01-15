function Background(options){
    this.graphic = null;
    this.scrolling = false;
    this.repeating = false;
    this.mover = false;
    this.height = 0;
    this.speed = 5;
    this.y = 0;
    this.color = null;
    this.tile = null;

    if(!options) return;

    this.graphic = Game().registerGraphics(options.src);
    this.scrolling = options.scrolling ? true : false;
    this.repeating = options.repeating ? true : false;
    this.mover = options.mover ? options.mover : false;
    this.height = options.height ? options.height : 0;
    this.y = (-1 * this.height) + Settings.height;
    this.resetY = (-1 * this.height) + Settings.height;
    this.color = options.color ? options.color : null;
    this.tile = options.tile ? options.tile : null;

    if(options.speed) {
        this.speed = convertGameSpeed(options.speed);
    }
};

Background.prototype._drawGrid = function(tile, y){
    var columns = Math.ceil(Settings.board_width / tile.width);
    var rows = Math.ceil(this.height / tile.height);
    var i, j;
    for(i=0; i<rows; i++){
        for(j=0; j<columns; j++) {
            tile.position.y = (i * tile.height) + y;
            tile.position.x = (j * tile.width) - Settings.board_diff();
            if(tile.position.y > 0 - tile.height && tile.position.y < Settings.height){
                tile.draw();
            }
        }
    }
};

Background.prototype.draw = function () {
    var offsetX = Game().controller.offsetX ? Game().controller.offsetX : 0;
    if(this.color) {
        Game().ctx.fillStyle = "rgb(" + this.color.r + ", " + this.color.g + ", " + this.color.b + ")";
        Game().ctx.fillRect(0,0,zoom(Settings.width),zoom(Settings.height));
    } else if (this.tile) {
        this._drawGrid(this.tile, this.y);
        if(this.scrolling){
            if(this.repeating || (!this.repeating && this.y < 0)){
                this.y += this.speed;
                if(this.mover){
                    Game().controller.move(this.speed);
                }
            }
            if(this.repeating && this.y > 0) {
                var second_y = (-1 * this.height) + this.y;
                this._drawGrid(this.tile, second_y);
            }
            if(this.y >= Settings.height) {
                this.y = this.resetY;
            }
        }
        this.tile.tickFrame();
    } else {
        Game().ctx.drawImage(this.graphic,zoom(0+offsetX - Settings.board_diff()),zoom(this.y),zoom(Settings.board_width),zoom(this.height));
        if(this.scrolling){
            if(this.repeating || (!this.repeating && this.y < 0)){
                this.y += this.speed;
                if(this.mover){
                    Game().controller.move(this.speed);
                }
            }
            if(this.repeating && this.y > 0) {
                Game().ctx.drawImage(this.graphic,zoom(0+offsetX - Settings.board_diff()),zoom((-1 * this.height) + this.y),zoom(Settings.board_width),zoom(this.height));
            }
            if(this.y >= Settings.height) {
                this.y = this.resetY;
            }
        }
    }
};