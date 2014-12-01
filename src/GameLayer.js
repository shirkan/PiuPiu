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
        //this._debugNode = new cc.PhysicsDebugNode(this.space);
        //this.addChild(this._debugNode, 10);

        this.init();
    },

    init:function () {
        this._super();

        //  Set game state to playing
        PiuPiuGlobals.gameState = GameStates.Playing;

        //  Place player on left side
        this.player = new Player(this);

        //  Create rotating hands
        this.hands = new Hands(this);
    },

    addEnemy: function () {
        var enemy = new Enemy(this);
        this.objects.push(enemy);
    },

    addBullet : function ( data ) {
        var endPoint = data[0];
        var bulletStartPoint = data[1];
        var endAngle = data[2];

        //console.log("clicked on " + pos.x + ", " + pos.y + "endangle: " + endAngle + " startPoint: " + bulletStartPoint.x + ", " + bulletStartPoint.y);
        //return;

        var bullet = new Bullet( this, endPoint, bulletStartPoint, endAngle);
        this.objects.push(bullet);
        this.hands.rotateHands(endAngle);
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
    onEnter: function () {
        this._super();
        PiuPiuGlobals.gameState = GameStates.Playing;
    }
});