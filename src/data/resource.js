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
    BG_grass1_png : "res/sprites/maps/BG-Grass-1.png",
    BG_grass2_png : "res/sprites/maps/BG-Grass-2.png",
    BG_grass3_png : "res/sprites/maps/BG-Grass-3.png",
    BG_grass4_png : "res/sprites/maps/BG-Grass-4.png",
    BG_grass5_png : "res/sprites/maps/BG-Grass-5.png",
    BG_grass6_png : "res/sprites/maps/BG-Grass-6.png",
    BG_grass7_png : "res/sprites/maps/BG-Grass-7.png",
    BG_grass8_png : "res/sprites/maps/BG-Grass-8.png",
    BG_grass9_png : "res/sprites/maps/BG-Grass-9.png",
    BG_grass10_png : "res/sprites/maps/BG-Grass-10.png",

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
    Achievement_png : "res/sprites/game/achievement_unlocked.png",

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
    sound_ballHitGround: "res/sounds/ballHitGround.mp3",
    sound_achievement_complete: "res/sounds/achievement_complete.mp3",

    //  Chants

    music_arsenal1: "res/music/arsenal1.mp3",
    music_athletico1: "res/music/athletico1.mp3",
    music_barca1: "res/music/barca1.mp3",
    music_barca2: "res/music/barca2.mp3",
    music_barca3: "res/music/barca3.mp3",
    music_bayern1: "res/music/bayern1.mp3",
    music_boca1: "res/music/boca1.mp3",
    music_boca2: "res/music/boca2.mp3",
    music_chelsea1: "res/music/chelsea1.mp3",
    music_chelsea2: "res/music/chelsea2.mp3",
    music_dortmund1: "res/music/dortmund1.mp3",
    music_hapoel1: "res/music/hapoel1.mp3",
    music_juve1: "res/music/juve1.mp3",
    music_juve2: "res/music/juve2.mp3",
    music_liverpool1: "res/music/liverpool1.mp3",
    music_liverpool2: "res/music/liverpool2.mp3",
    music_maccabi1: "res/music/maccabi1.mp3",
    music_maccabi2: "res/music/maccabi2.mp3",
    music_mancity1: "res/music/mancity1.mp3",
    music_manutd1: "res/music/manutd1.mp3",
    music_manutd2: "res/music/manutd2.mp3",
    music_manutd3: "res/music/manutd3.mp3",
    music_milan1: "res/music/milan1.mp3",
    music_olympiakos1: "res/music/olympiakos1.mp3",
    music_pana1: "res/music/pana1.mp3",
    music_paok1: "res/music/paok1.mp3",
    music_psg1: "res/music/psg1.mp3",
    music_realmadrid1: "res/music/realmadrid1.mp3",
    music_realmadrid2: "res/music/realmadrid2.mp3",
    music_realmadrid3: "res/music/realmadrid3.mp3"
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