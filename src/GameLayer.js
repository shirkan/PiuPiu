/**
 * Created by shirkan on 11/17/14.
 */

var GameLayer = cc.Layer.extend({
    space:null,
    objects:[],
    player:null,
    hands:null,
    ctor: function(space) {
        this._super();

        this.space = space;
        this.objects = [];

        //  Debug shapes
        isDebugMode() ? eval("this._debugNode = new cc.PhysicsDebugNode(this.space); this.addChild(this._debugNode, 10);") : "";

        this.init();
    },

    init:function () {
        this._super();

        //  Place player on left side
        this.player = new Player(this);

        //  Create rotating hands
        this.hands = new Hands(this);

        isDebugMode() ? eval("this.schedule(this.printSize, 1)") : "";
    },

    addEnemy: function () {
        var enemy = new Enemy(this);
        this.addObject(enemy);
    },

    addBullet : function ( bulletData ) {
        var endPoint = bulletData[0];
        var bulletStartPoint = bulletData[1];
        var endAngle = bulletData[2];
        var sound = bulletData[3];

        var bullet = new Bullet( this, endPoint, bulletStartPoint, endAngle, sound);
        this.addObject(bullet);
        this.hands.rotateHands(endAngle);
    },

    addObject : function (obj) {
        this.objects.push(obj);
    },

    removeObject: function ( body ) {
        for (var i = 0; i < this.objects.length; i++) {
            if (this.objects[i].body == body) {
                this.objects.splice(i, 1);
                break;
            }
        }
    },

    removeObjectByBody:function (body) {
        for (var i = 0; i < this.objects.length; i++) {
            if (this.objects[i].body == body) {
                this.objects[i].removeFromParent();
                this.objects.splice(i, 1);
                break;
            }
        }
    },

    removeAllObjects : function () {
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].removeFromParent();
        }
        this.objects = [];
    },

    printSize : function () {
        console.log("size is " + this.objects.length);
    }
});