/**
 * Created by shirkan on 12/7/14.
 */

//  <------ Spawning Mechanism (SM) ------>
//  Spawning options:
//  fixed - spawn enemy every enemiesSpawnInterval seconds
//  range - spawn enemy in between enemiesSpawnIntervalMin to enemiesSpawnIntervalMax, with steps of size enemiesSpawnInterval

function SpawningMechanism(target, cb) {
    this.init(target, cb);
}

//  Clear variables
SpawningMechanism.prototype.reset = function () {
    this.availableSpawnTimings = null;
    this.target = null;
    this.callback = null;
};

//  Initalize variables according to level settings.
//  "target" is the target running current level and is used for updating the scheduler.
//  "cb" is the callback for spawning
SpawningMechanism.prototype.init = function(target, cb) {
    this.reset();
    this.target = target;
    this.callback = cb;

    switch (PiuPiuLevelSettings.enemiesSpawnIntervalType) {
        case ("fixed"):
        {
            this.availableSpawnTimings = PiuPiuLevelSettings.enemiesSpawnInterval;
            return;
        }
        case ("range"):
        {
            var iterator = PiuPiuLevelSettings.enemiesSpawnIntervalMin;
            this.availableSpawnTimings = [];
            while (iterator < PiuPiuLevelSettings.enemiesSpawnIntervalMax) {
                this.availableSpawnTimings.push(iterator);
                iterator+= PiuPiuLevelSettings.enemiesSpawnInterval;
            }
            return;
        }
    }
};

//  Start first step
SpawningMechanism.prototype.start = function () {
    switch (PiuPiuLevelSettings.enemiesSpawnIntervalType) {
        case ("fixed"):
        {
            //  Run level, wait 1 second before actually starting the level
            cc.director.getScheduler().scheduleCallbackForTarget(this.target, this.callback, PiuPiuLevelSettings.enemiesSpawnInterval, cc.REPEAT_FOREVER, 1);
            return;
        }
        case ("range"):
        {
            //  Run level, wait 1 second before actually starting the level
            cc.director.getScheduler().scheduleCallbackForTarget(this.target, this.callback, PiuPiuLevelSettings.enemiesSpawnIntervalMin, cc.REPEAT_FOREVER, 1);
            return;
        }
    }
};

//  Set scheduler next step
SpawningMechanism.prototype.step = function () {
    switch (PiuPiuLevelSettings.enemiesSpawnIntervalType) {
        case ("fixed"):
        {
            //  No need to do nothing
            return;
        }
        case ("range"):
        {
            var interval = this.availableSpawnTimings[(Math.floor(Math.random() * this.availableSpawnTimings.length))];
            console.log("interval is " + interval);
            cc.director.getScheduler().scheduleCallbackForTarget(this.target, this.callback, interval, cc.REPEAT_FOREVER);
            return;
        }
    }
};

SpawningMechanism.prototype.stop = function () {
    cc.director.getScheduler().unscheduleCallbackForTarget(this.target, this.callback);
}