/**
 * Created by shirkan on 12/7/14.
 */

//  <------ Spawning Mechanism (SM) ------>
//  Spawning options:
//  fixed - spawn cb every intervalStep seconds
//  range - spawn cb in between intervalRangeMin to intervalRangeMax, with steps of size intervalStep

function SpawningMechanism() {}

//  Clear variables
SpawningMechanism.prototype.reset = function () {
    this.availableSpawnTimings = null;
    this.target = null;
    this.callback = null;
    this.intervalType = 0;
    this.intervalStep = 0;
    this.intervalRangeMin = 0;
    this.intervalRangeMax = 0;
};

//  Initalize variables according to level settings.
//  "target" is the target running current level and is used for updating the scheduler.
//  "cb" is the callback for spawning
SpawningMechanism.prototype.init = function(target, cb, intervalType, intervalStep, intervalRangeMin, intervalRangeMax) {
    this.reset();
    this.target = target;
    this.callback = cb;
    this.intervalType = intervalType;
    this.intervalStep = intervalStep;
    this.intervalRangeMin = intervalRangeMin;
    this.intervalRangeMax = intervalRangeMax;

    switch (this.intervalType) {
        case ("fixed"):
        {
            this.availableSpawnTimings = this.intervalStep;
            return;
        }
        case ("range"):
        {
            var iterator = this.intervalRangeMin;
            this.availableSpawnTimings = [];
            while (iterator < this.intervalRangeMax) {
                this.availableSpawnTimings.push(iterator);
                iterator+= this.intervalStep;
            }
            return;
        }
    }
};

//  Start first step
SpawningMechanism.prototype.start = function () {
    switch (this.intervalType) {
        case ("fixed"):
        {
            //  Run level, wait 1 second before actually starting the level
            cc.director.getScheduler().scheduleCallbackForTarget(this.target, this.callback, this.intervalStep, cc.REPEAT_FOREVER, 1);
            return;
        }
        case ("range"):
        {
            //  Run level, wait 1 second before actually starting the level
            cc.director.getScheduler().scheduleCallbackForTarget(this.target, this.callback, this.intervalRangeMin, cc.REPEAT_FOREVER, 1);
            return;
        }
    }
};

//  Set scheduler next step
SpawningMechanism.prototype.step = function () {
    switch (this.intervalType) {
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