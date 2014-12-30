var res = {
    //  Font
    arcade_font: "res/fonts/arcade.ttf",
    arcadepi_font: "res/fonts/arcadepi.ttf",

    //  Maps
    grass1_tmx : "res/sprites/maps/grass1.tmx",
    grass1_lowtmx : "res/sprites/maps/grass1_low.tmx",
    grass2_tmx : "res/sprites/maps/grass2.tmx",
    grass3_tmx : "res/sprites/maps/grass3.tmx",
    grass4_tmx : "res/sprites/maps/grass4.tmx",
    grass5_tmx : "res/sprites/maps/grass5.tmx",
    grass6_tmx : "res/sprites/maps/grass6.tmx",
    grass7_tmx : "res/sprites/maps/grass7.tmx",
    grass8_tmx : "res/sprites/maps/grass8.tmx",
    grass9_tmx : "res/sprites/maps/grass9.tmx",
    grass10_tmx : "res/sprites/maps/grass10.tmx",
    Field_png : "res/sprites/maps/field.png",

    //  Game
    EnemyBig_png : "res/sprites/game/enemy.png",
    Enemy_png : "res/sprites/game/enemy_small.png",
    Player_png : "res/sprites/game/player.png",
    Hands_png : "res/sprites/game/handsSprites.png",
    Hands_plist: "res/sprites/game/hands.plist",
    BulletBig_png: "res/sprites/game/bullet.png",
    Bullet_png: "res/sprites/game/bullet_small2.png",
    LifeBig_png : "res/sprites/game/life.png",
    Life_png : "res/sprites/game/life_small.png",
    //  Powerups
    PowerupMachineGun_png: "res/sprites/game/machineGun.png",
    Powerup1Up_png: "res/sprites/game/1up.png",
    PowerupCaptain_png: "res/sprites/game/captain.png",
    PowerupStopwatch_png: "res/sprites/game/stopwatch.png",


    //  Animations
    Goal_png: "res/sprites/anim/goal.png",
    Ball_png: "res/sprites/anim/ball.png",

    //  Main Menu
    FB_png: "res/sprites/mainmenu/facebook.png",

    //  Leaderboard sprites
    stencil_png: "res/sprites/leaderboard/stencil1.png",
    place1_png : "res/sprites/leaderboard/place1.png",
    place2_png : "res/sprites/leaderboard/place2.png",
    place3_png : "res/sprites/leaderboard/place3.png",
    place4_png : "res/sprites/leaderboard/place4.png",
    place5_png : "res/sprites/leaderboard/place5.png",
    place6_png : "res/sprites/leaderboard/place6.png",
    place7_png : "res/sprites/leaderboard/place7.png",

    //  Sounds
    sound_hineZeBa: "res/sounds/hineZeBa.mp3",
    sound_shaar: "res/sounds/shaar.mp3",
    sound_ohedNichnasLamigrash: "res/sounds/ohedNichnasLamigrash.mp3",
    sound_piu: "res/sounds/piu.mp3",
    sound_machineGun: "res/sounds/machineGun.mp3",
    sound_headshot: "res/sounds/headshot.mp3",
    sound_achievement_complete: "res/sounds/achievement_complete.mp3"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}

//
////  Music
//var
//var sound_piu = "res/"
//{src:sound_hineZeBa};