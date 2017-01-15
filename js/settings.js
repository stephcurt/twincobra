var Settings = {};

Settings.layers = 5;
Settings.width = 256;
Settings.board_width = 256;
Settings.board_diff = function(){ return ((Settings.board_width - Settings.width) / 2); };
Settings.height = 224;
Settings.zoom = 1;
Settings.pause_scroll = false;
Settings.no_aggro = false;
Settings.no_collision = false;
Settings.current_level = 0;
Settings.game_speed = {
    "fastest": 30,
    "faster": 20,
    "fast": 10,
    "default": 5,
    "slow": .75
};