/**
 * Created by shirkan on 11/19/14.
 */

var TestScene = cc.Scene.extend({
    ctor: function() {
        this._super();
        this.init();
    },

    init: function() {
        this._super();

        var tests = ["testCalculateEndPoint"];
        for (i in tests) {
            var test = tests[i];
            var testString = "this." + test + "()";
            var res = eval(testString);
            if (res == 1) {
                this.labelHishScore = new cc.LabelTTF(test + " passed", PiuPiuConsts.fontName, 20);
                this.labelHishScore.setColor(cc.color(0, 255, 0)); //  Green
            } else {
                this.labelHishScore = new cc.LabelTTF(test + " failed", PiuPiuConsts.fontName, 20);
                this.labelHishScore.setColor(cc.color(255, 0, 0)); //  Red

            }
            this.labelHishScore.setPosition(320, 240);
            this.addChild(this.labelHishScore);
        }
    },

    testCalculateEndPoint: function (){
        var bullet = new Bullet( 151, 302);
        console.log("bullet.endX = " + bullet.endX + " bullet.endY = " + bullet.endY + " rotationAngle = " + bullet.rotationAngle);
        if (bullet.endX == 80 && bullet.endY == 480 && bullet.rotationAngle == 80.54) {
            return 1;
        }
        return 0;
    }
});