/**
 * Created by shirkan on 11/17/14.
 */

var Enemy = cc.PhysicsSprite.extend({
    space:null,
    startX:null,
    startY:null,
    speed:null,
    body:null,
    shape:null,
    ctor: function(space) {
        this._super();
        this.space = space;
        this.init();
    },
    init: function() {
        this._super(res.Enemy_png);

        var winSize = cc.director.getWinSize();

        //  Set starting position
        this.startX = winSize.width + this.width;
        this.startY = Math.random() * (winSize.height * 3 ) - (winSize.height * 1.5);
        var startingPoint = cc.p(this.startX, this.startY);

        //  Set speed
        this.speed = Math.random() * 3 + 1;

        // init physics
        this.body = new cp.Body(1,1);
        this.body.setPos(startingPoint);
        this.setBody(this.body);

        //this.setPhysicsBody(this.body);
        this.space.addBody(this.body);

        var contentSize = this.getContentSize();
        this.shape = new cp.BoxShape(this.body, contentSize.width -5 , contentSize.height - 5);
        this.shape.setCollisionType(SpriteTag.Enemy);
        this.shape.setSensor(true);
        this.space.addShape(this.shape);

        this.scheduleUpdate();

    },
    attack: function( node) {
        node.addChild(this);
        this.runAction(cc.MoveTo.create(this.speed, PiuPiuConsts.enemyMoveToPoint));
    },

    getShape:function () {
        return this.shape;
    },

    update: function (dt) {
        this.space.step(dt);
    },

    removeFromParent:function () {
        this.space.removeShape(this.shape);
        this.space.removeBody(this.body);
        this.shape = null;
        this._super();
    }

});