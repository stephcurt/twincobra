function StartController() {
    Controller.call(this);
}

StartController.prototype = Object.create(Controller.prototype);

StartController.prototype.init = function () {
    document.addEventListener("keydown", Game().controller.moveCursor.bind(this), false);
    document.addEventListener("keydown", Game().controller.startGame.bind(this), false);
};

StartController.prototype.clearEvents = function () {
    document.removeEventListener("keydown", Game().controller.moveCursor.bind(this));
    document.removeEventListener("keydown", Game().controller.startGame.bind(this));
};

StartController.prototype.moveCursor = function (e) {
    if(e.keyCode === 38 || e.keyCode === 40){
        this.objects.select.toggleState();
        this.objects.start.toggleState();
        this.objects.configuration.toggleState();
    }
};

StartController.prototype.startGame = function (e) {
    if(e.keyCode === 13){
        var state = this.objects.select.getState();
        if(state.name === "start") {
            Game().loadLevel(0);
        }
    }
};