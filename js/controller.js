function Controller() {
    this.objects = {};
}

Controller.prototype.registerObject = function(name, object) {
    if(this.objects[name] && this.objects[name] instanceof Array == false) {
        this.objects[name] = [this.objects[name]];
    }
    if (this.objects[name] && this.objects[name] instanceof Array) {
        this.objects[name].push(object);
    } else {
        this.objects[name] = object;
    }
};