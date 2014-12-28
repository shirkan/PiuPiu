/**
 * Created by shirkan on 11/17/14.
 */

var Enemy = cc.Class.extend({
    space:null,
    startingPos:null,
    currentPos:null,
    speed:null,
    distanceLeftToPass: null,
    sprite:null,
    body:null,
    shapeBody:null,
    shapeHead:null,
    ctor: function( parentNode ) {
        this.space = parentNode.space;
        this.sprite = new cc.PhysicsSprite(res.Enemy_png);

        //  Set starting position
        startX = PiuPiuGlobals.winSize.width;
        if (specialNotationDoesContain("center")) {
            startY = PiuPiuGlobals.winSize.height / 2;
        } else {
            startY = Math.random() * (PiuPiuGlobals.winSize.height);
        }
        this.startingPos = cc.p(startX, startY);

        //  This point will be attached to the body and will change during movement
        this.currentPos = cc.p(startX, startY);
        this.distanceLeftToPass = calculateLineLength(this.startingPos, PiuPiuConsts.enemyMoveToPoint);

        //  Set speed
        this.speed = PiuPiuGlobals.currentUpdateRate * (Math.random() * 3 + 1);

        // init physics
        this.body = new cp.Body(1,1);
        this.body.setPos(this.currentPos);
        this.sprite.setBody(this.body);
        this.space.addBody(this.body);

        //  Calculate body shape
        var contentSize = this.sprite.getContentSize();
        var bodyX = contentSize.width/2;
        var bodyY = contentSize.height/2;
        var verts = [-bodyX,-bodyY, -bodyX, bodyY-20, bodyX, bodyY-20, bodyX, -bodyY];
        this.shape = new cp.PolyShape(this.body, verts, cp.v(0,0));
        this.shape.setCollisionType(SpriteTag.Enemy);
        this.shape.setSensor(true);
        this.space.addShape(this.shape);

        //  Calculate head shape
        this.shapeHead = new cp.CircleShape(this.body, PiuPiuConsts.enemyHeadRadius, PiuPiuConsts.enemyHeadOffset);
        this.shapeHead.setCollisionType(SpriteTag.EnemyHead);
        this.shapeHead.setSensor(true);
        this.space.addShape(this.shapeHead);

        parentNode.addChild(this.sprite, PiuPiuConsts.enemyLocalZOrder);

        this.sprite.runAction(cc.MoveTo.create(this.speed, PiuPiuConsts.enemyMoveToPoint));
    },

    removeFromParent:function () {
        try {
            this.space.removeShape(this.shape);
            this.shape = null;
            this.space.removeShape(this.shapeHead);
            this.shapeHead = null;
            this.space.removeBody(this.body);
            this.body = null;
            this.sprite.removeFromParent();
            this.sprite = null;
        } catch (err) {
            LOG("Enemy removeFromParent caught error: " + err);
        }
    },

    onExit:function () {
        this._super();
        console.log("enemy exit");
    },

    updateSpeed : function ( multiplier ) {
        this.sprite.stopAllActions();
        var distancePassed = calculateLineLength(this.startingPos, this.currentPos);
        this.speed = this.speed * (1 - (distancePassed / this.distanceLeftToPass));
        this.speed *= multiplier;
        this.sprite.runAction(cc.MoveTo.create(this.speed, PiuPiuConsts.enemyMoveToPoint));
    }

});