function Game() {
    if(Game._instance) return Game._instance;

    this.ctx = null;
    this.canvas = null;
    this.layers = [];
    this.controller = null;
    this.levels = {};
    this.images = [];
}

Game._instance = null;

Game.prototype.init = function init() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    Settings.zoom = parseInt(localStorage.getItem('zoom')) ? parseInt(localStorage.getItem('zoom')) : 1;
    this._positionScreen();
    this._setLayers();
    this._loadStart();
    this._loadLevels();
    setInterval(Game().drawer.bind(this), 30);
};

Game.prototype._positionScreen = function _positionScreen() {
    this.canvas.style.position = "absolute";
    this.canvas.style.margin = "auto";
    this.canvas.style.top = "0";
    this.canvas.style.right = "0";
    this.canvas.style.bottom = "0";
    this.canvas.style.left = "0";
    this.canvas.style.width = zoom(Settings.width) + "px";
    this.canvas.style.height = zoom(Settings.height) + "px";
    this.canvas.setAttribute("width", zoom(Settings.width));
    this.canvas.setAttribute("height", zoom(Settings.height));
    this.ctx.imageSmoothingEnabled= false;
};

Game.prototype._setLayers = function _setLayers() {
    var i;
    for(i = 0; i < Settings.layers; i++) {
        this.layers.push(null);
    }
};

Game.prototype._resetLayers = function _resetLayers() {
    var i;
    for(i = 0; i < Settings.layers; i++) {
        this.layers[i] = null;
    }
};

Game.prototype._loadStart = function _loadStart() {
    this.controller = new StartController();
    this.controller.init();
    this.layers[0] = new Layer();
    this.layers[0].objects.push(new Background({color: new Color(0, 0, 72) }));
    this.layers[1] = new Layer();
    this.layers[1].objects.push(new Sprite({name: "title", x: 0, y: 8, width: 256, height: 128, src: "title.png"}));
    this.layers[1].objects.push(new Animated({name: "press_start", x: 65, y: 144, width: 143, height: 7, src: "start.png", source_width: 286, source_height: 7, auto_start: true, repeat: true, speed: "slow"}));
    this.layers[1].objects.push(new UI({name: "select", x: 73, y: 160, width: 7, height: 8, src: "select.png", states: [{name: "start", x: 73, y: 160},{name: "config", x:73, y:176}]}));
    this.layers[1].objects.push(new UI({name: "start", x: 89, y: 160, width: 103, height: 7, src: "start-1.png", source_width: 206, source_height: 7, starting_state: 1, states: [{frame: 0},{frame: 1}]}));
    this.layers[1].objects.push(new UI({name: "configuration", x: 89, y: 176, width: 103, height: 7, src: "configuration.png", source_width: 206, source_height: 7, states: [{frame: 0},{frame: 1}]}));
    this.layers[1].objects.push(new Sprite({name: "copyright", x: 48, y: 192, width: 167, height: 23, src: "copyright.png"}));
};

Game.prototype._loadLevels = function _loadLevels() {
    loadJSON(this._setLevels.bind(this), 'levels.json');
};

Game.prototype._setLevels = function _setLevels(data) {
    var json = JSON.parse(data);
    this.levels = json.levels;
};

Game.prototype.loadLevel = function(number){
    Settings.current_level = number;
    var level = this.levels[number];
    if(!level) return;
    this._resetLayers();
    this.controller.clearEvents();
    this.controller = null;
    this.controller = new window[level.controller];
    Settings.width = level.screen_width;
    Settings.height = level.screen_height;
    Settings.board_width = level.board_width ? level.board_width : Settings.board_width;
    this._positionScreen();
    this.layers[0] = new Layer();
    var bgImage = new Image();
    var bgHeight = 0;
    bgImage.onload = function () {
        bgHeight = this.height;
        if(level.water){
            var tileAnimation = new Animated({name: "water", width: level.water.width, height: level.water.height,
                src: level.water.src, source_width: level.water.source_width, source_height: level.water.source_height,
                auto_start: false, repeat: true, speed: "slow"});
            Game().layers[0].objects.push(new Background({tile: tileAnimation, scrolling: true, repeating: false, height: bgHeight, speed: level.speed}));
        }
        Game().layers[0].objects.push(new Background({src: level.background, scrolling: true, repeating: false, height: bgHeight, speed: level.speed, mover: true}));
        Game().layers[1] = new Layer();
        var i;
        for(i = 0; i<level.objects.length; i++){
            var object = window[level.objects[i].type];
            if(level.objects[i].options.y) {
                level.objects[i].options.y = (-1 * bgHeight) + Settings.height + (bgHeight - level.objects[i].options.y);
            }
            Game().layers[1].objects.push(new object(level.objects[i].options));
        }
        Game().layers[2] = new Layer();
        Game().layers[2].objects.push(new Player());
        Game().controller.init(level.speed);
    };
    bgImage.src = "img/" + level.background;
};

Game.prototype.toggleZoom = function(){
    Settings.zoom += 1;
    if(Settings.zoom > 5) Settings.zoom = 1;
    this._positionScreen();
    localStorage.setItem('zoom', JSON.stringify(Settings.zoom));
};

Game.prototype.togglePauseScroll = function(){
    Settings.pause_scroll = !Settings.pause_scroll;
    for(i = 0; i < Settings.layers; i++) {
        var layer = this.layers[i];
        if(!layer || !layer.objects) continue;
        layer.objects.forEach(function(object) {
            if(object.scrolling !== null && object.scrolling !== undefined){
                object.scrolling = !Settings.pause_scroll;
            }
        }, this);
    }
};

Game.prototype.toggleAggro = function(){
    Settings.no_aggro = !Settings.no_aggro;
};

Game.prototype.toggleCollision = function(){
    Settings.no_collision = !Settings.no_collision;
};

Game.prototype.drawer = function drawer() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0,0,zoom(Settings.width),zoom(Settings.height));
    for(i = 0; i < Settings.layers; i++) {
        var layer = this.layers[i];
        if(!layer || !layer.objects) continue;
        layer.objects.forEach(function(object) {
            object.draw();
        }, this);
    }
};

Game.prototype.registerGraphics = function (src) {
    var source = "img/" + src;
    if(!this.images[source]) {
        var graphic = new Image();
        graphic.src = source;
        this.images[source] = graphic;
    }
    return this.images[source];
};

if(!Game._instance) Game._instance = new Game();