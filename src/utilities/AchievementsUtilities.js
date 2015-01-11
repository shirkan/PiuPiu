/**
 * Created by shirkan on 1/8/15.
 */

if(typeof PiuPiuAchievements == "undefined") {
    var PiuPiuAchievements = {};
    PiuPiuAchievements.firestarter = {  "status": 0,
        "cond"  : "PiuPiuGlobals.totalEnemyKilled > 0",
        "sprite": null,
        "text"  : '"Firestarter" achievement unlocked!'
    };
};

//  Check status
function isAchieved ( key ) {
    return (PiuPiuAchievements[key].status);
}

//  Check if condition exists now
function hasCompleted (key) {
    return (eval(PiuPiuAchievements[key].cond));
}

function checkAllAchievements() {
    var result = [];
    for (var key in PiuPiuAchievements) {
        if (isAchieved(key)) {
            result.push(key);
        }
    }

    return result;
}