/**
 * Created by shirkan on 11/17/14.
 */

var GameLayer = cc.Layer.extend({
    recognizer:null,
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

        var winSize = cc.director.getWinSize();

        //  Touch handler
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: "",
            onTouchEnded: ""}, this);
        this.recognizer = new SimpleRecognizer();

        //  Place player on left side
        this.player = new Player(this);

        //  Create rotating hands
        this.hands = new Hands(this);

        this.scheduleUpdate();
    },

    onTouchBegan: function (touch, event) {
        var pos = touch.getLocation();
        var layerObj = event.getCurrentTarget();

        //  Angle limits - goes crazy beyond these angles
        if (pos.x < PiuPiuConsts.handsAnchor.x) {
            return;
        }

        var data = calculateTrigonometry(pos);
        var endPoint = data[0];
        var bulletStartPoint = data[1];
        var endAngle = data[2];

        //console.log("clicked on " + pos.x + ", " + pos.y + "endangle: " + endAngle + " startPoint: " + bulletStartPoint.x + ", " + bulletStartPoint.y);
        //return;

        var bullet = new Bullet( layerObj, endPoint, bulletStartPoint, endAngle);
        layerObj.objects.push(bullet);
        layerObj.hands.rotateHands(endAngle);
    },

    update: function (dt) {
        if (Math.random() < 0.005) {
            var enemy = new Enemy(this.space);
            enemy.attack(this);
            this.objects.push(enemy);
        }
    },

    removeObject: function ( shape ) {
        for (var i = 0; i < this.objects.length; i++) {
            if (this.objects[i].getShape() == shape) {

                this.objects.splice(i, 1);
                break;
            }
        }
    },

    removeObjectByShape:function (shape) {
        for (var i = 0; i < this.objects.length; i++) {
            if (this.objects[i].getShape() == shape) {
                console.log("GameLayer: Removed shape");
                this.objects[i].removeFromParent();
                this.objects.splice(i, 1);
                break;
            }
        }
    }});