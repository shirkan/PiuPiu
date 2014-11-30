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

        //  Touch handler
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded}, this);

        //  Place player on left side
        this.player = new Player(this);

        //  Create rotating hands
        this.hands = new Hands(this);

        this.schedule(this.addEnemy, 3);
    },

    addEnemy: function () {
        if (PiuPiuGlobals.gameState != GameStates.Playing) {
            this.unschedule(this.addEnemy);
            return;
        }

        var enemy = new Enemy(this);
        this.objects.push(enemy);
    },

    onTouchBegan: function (touch, event) {
        //  If game over state, return to menu
        if (PiuPiuGlobals.gameState == GameStates.GameOver) {
            var transition = new cc.TransitionFade(1, new MenuScene());
            cc.director.runScene(transition);
            return true;
        }

        var pos = touch.getLocation();
        var layerObj = event.getCurrentTarget();

        //  Angle limits - goes crazy beyond these angles
        if (pos.x < PiuPiuConsts.handsAnchor.x) {
            return false;
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

        return true;
    },

    onTouchMoved: function (touch, event) {
    },

    onTouchEnded: function (touch, event) {
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