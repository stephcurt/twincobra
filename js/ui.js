function UI(options){
    Animated.call(this, options);

    this.states = [];
    this.current_state = 0;

    if(!options) return;

    this.states = options.states ? options.states : [];
    this.current_state = options.starting_state ? options.starting_state : 0;
}

UI.prototype = Object.create(Animated.prototype);

UI.prototype._updateState = function () {
    this.position.x = this.states[this.current_state].x ? this.states[this.current_state].x : this.position.x;
    this.position.y = this.states[this.current_state].y ? this.states[this.current_state].y : this.position.y;
    this.current_frame = this.states[this.current_state].frame !== undefined ? this.states[this.current_state].frame : this.current_frame;
};

UI.prototype.getState = function (state) {
    return this.states[this.current_state];
};

UI.prototype.setState = function (state) {
    this.current_state = state;
};

UI.prototype.toggleState = function () {
    this.current_state += 1;
    if(this.current_state >= this.states.length) this.current_state = 0;
};

UI.prototype.draw = function () {
    Object.getPrototypeOf(UI.prototype).draw.call(this);
    this._updateState();
};