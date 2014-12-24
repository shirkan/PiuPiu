/**
 * Created by shirkan on 11/17/14.
 */

var Bullet = cc.Class.extend({
    space:null,
    sprite:null,
    body:null,
    shape:null,
    parentNode:null,
    startingPos: null,
    currentPos: null,
    speed: null,
    endPoint: null,
    distanceLeftToPass: null,

    ctor: function( parentNode, endPoint, bulletStartPoint, endAngle, sound ) {
        this.space = parentNode.space;
        this.parentNode = parentNode;
        this.currentPos = cc.p(bulletStartPoint);
        this.startingPos = cc.p(bulletStartPoint);
        this.endPoint = endPoint;
        this.distanceLeftToPass = calculateLineLength(this.startingPos, this.endPoint);

        this.sprite = new cc.PhysicsSprite(res.Bullet_png);

        // init physics - body
        this.body = new cp.Body(1,1);
        this.body.setPos(this.currentPos);
        this.body.setAngle(endAngle);
        this.sprite.setBody(this.body);
        this.space.addBody(this.body);

        // init physics - shape
        var contentSize = this.sprite.getContentSize();
        this.shape = new cp.SegmentShape(this.body, cc.p(-contentSize.width / 2,0), cc.p(contentSize.width/2, 0), 1);
        this.shape.setCollisionType(SpriteTag.Bullet);
        this.shape.setSensor(true);
        this.space.addShape(this.shape);

        //  Visualize
        this.parentNode.addChild(this.sprite, PiuPiuConsts.bulletLocalZOrder);

        //  Calculate how much time it should take the bullet to complete the action (so velocity will be the same for all bullets)
        this.speed = PiuPiuGlobals.currentUpdateRate * calculateLineLength(bulletStartPoint, this.endPoint) / PiuPiuConsts.framesPerSeconds;

        //  Shooting bullet
        var moveAction = cc.MoveTo.create(this.speed, this.endPoint);
        var seq = new cc.Sequence(moveAction, new cc.CallFunc (this.reachedBounds, this));

        this.sprite.runAction(seq);

        sound = sound || res.sound_piu;
        playSound(sound);
    },

    removeFromParent:function () {
        this.space.removeShape(this.shape);
        this.shape = null;
        this.space.removeBody(this.body);
        this.body = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    },

    reachedBounds: function () {
        this.parentNode.removeObject(this.body);
        this.removeFromParent();
    },

    onExit:function () {
        this._super();
        console.log("bullet exit");
    },

    updateSpeed : function ( multiplier ) {
        this.sprite.stopAllActions();
        var distancePassed = calculateLineLength(this.startingPos, this.currentPos);
        this.speed = this.speed * (1 - (distancePassed / this.distanceLeftToPass));
        this.speed *= multiplier;

        LOG("Bullet updated speed " + this.speed);

        var moveAction = cc.MoveTo.create(this.speed, this.endPoint);
        var seq = new cc.Sequence(moveAction, new cc.CallFunc (this.reachedBounds, this));

        this.sprite.runAction(seq);
    }
});