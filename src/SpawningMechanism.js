/**
 * Created by shirkan on 12/7/14.
 */

//  <------ Spawning Mechanism (SM) ------>
//  Spawning options:
//  fixed - spawn enemy every enemiesSpawnInterval seconds
//  range - spawn enemy in between enemiesSpawnIntervalMin to enemiesSpawnIntervalMax, with steps of size enemiesSpawnInterval
var SMthis = null;
var SMavailableSpawnTimings = null;

//  Clear variables
function SMreset() {
    SMavailableSpawnTimings = [];
    SMthis = null;
    SMcallback = null;
}

//  Initalize variables according to level settings.
//  "scene" is the scene running current level and is used for updating the scheduler.
//  "cb" is the callback for spawning
function SMinit(scene, cb) {
    SMreset();
    SMthis = scene;
    SMcallback = cb;

    switch (PiuPiuLevelSettings.enemiesSpawnIntervalType) {
        case ("fixed"):
        {
            SMavailableSpawnTimings = PiuPiuLevelSettings.enemiesSpawnInterval;
            return;
        }
        case ("range"):
        {
            var iterator = PiuPiuLevelSettings.enemiesSpawnIntervalMin;
            SMavailableSpawnTimings = [];
            while (iterator < PiuPiuLevelSettings.enemiesSpawnIntervalMax) {
                SMavailableSpawnTimings.push(iterator);
                iterator+= PiuPiuLevelSettings.enemiesSpawnInterval;
            }
            return;
        }
    }
}

//  Start first step
function SMstart() {
    switch (PiuPiuLevelSettings.enemiesSpawnIntervalType) {
        case ("fixed"):
        {
            //  Run level, wait 1 second before actually starting the level
            cc.director.getScheduler().scheduleCallbackForTarget(SMthis, SMcallback, PiuPiuLevelSettings.enemiesSpawnInterval, cc.REPEAT_FOREVER, 1);
            return;
        }
        case ("range"):
        {
            //  Run level, wait 1 second before actually starting the level
            cc.director.getScheduler().scheduleCallbackForTarget(SMthis, SMcallback, PiuPiuLevelSettings.enemiesSpawnIntervalMin, cc.REPEAT_FOREVER, 1);
            return;
        }
    }

}

//  Set scheduler next step
function SMstep() {
    switch (PiuPiuLevelSettings.enemiesSpawnIntervalType) {
        case ("fixed"):
        {
            //  No need to do nothing
            return;
        }
        case ("range"):
        {
            var interval = SMavailableSpawnTimings[(Math.floor(Math.random() * 3))];
            console.log("interval = " +interval);
            cc.director.getScheduler().scheduleCallbackForTarget(SMthis, SMcallback, interval, cc.REPEAT_FOREVER);
            return;
        }
    }
}