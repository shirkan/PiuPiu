/**
 * Created by shirkan on 11/17/14.
 */

var GameLayer = cc.Layer.extend({
    recognizer:null,
    space:null,
    objects:[],
    ctor: function(space) {
        this._super();

        this.space = space;
        this.objects = [];

        //  Debug shapes
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this.addChild(this._debugNode, 10);

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
        var player = new Player(this.space);
        this.addChild(player);

        this.scheduleUpdate();
    },

    onTouchBegan: function (touch, event) {
        var pos = touch.getLocation();
        var layerObj = event.getCurrentTarget();
        var bullet = new Bullet( layerObj.space, pos.x, pos.y);

        //  Only shoot if bullet created successfully
        if (bullet) {
            layerObj.objects.push(bullet);
            bullet.visualize(layerObj);
            bullet.shoot();
        }
    },

    update: function (dt) {
        if (Math.random() < 0.001) {
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
                console.log("removed shape");
                this.objects[i].removeFromParent();
                this.objects.splice(i, 1);
                break;
            }
        }
    }});