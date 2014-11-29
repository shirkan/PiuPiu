/**
 * Created by shirkan on 11/17/14.
 */

var Bullet = cc.Class.extend({
    space:null,
    sprite:null,
    body:null,
    shape:null,
    parentNode:null,

    ctor: function( parentNode, endPoint, bulletStartPoint, endAngle ) {
        this.space = parentNode.space;
        this.parentNode = parentNode;
        //this._super();
        this.init(endPoint, bulletStartPoint, endAngle);
    },

    init: function( endPoint, bulletStartPoint, endAngle ) {
        //this.space = parentNode.space;
        //this.parentNode = parentNode;

        //  Init sprite
        this.sprite = new cc.PhysicsSprite(res.Bullet_png);

        // init physics - body
        this.body = new cp.Body(1,1);
        this.body.setPos(bulletStartPoint);
        this.body.setAngle(endAngle);
        this.sprite.setBody(this.body);
        this.space.addBody(this.body);

        // init physics - shape
        var contentSize = this.sprite.getContentSize();
        this.shape = new cp.BoxShape(this.body, contentSize.width, contentSize.height);
        this.shape.setCollisionType(SpriteTag.Bullet);
        this.shape.setSensor(true);
        this.space.addShape(this.shape);

        //  Visualize
        this.parentNode.addChild(this.sprite);

        //  Calculate how much time it should take the bullet to complete the action (so velocity will be the same for all bullets)
        var moveDuration = calculateLineLength(bulletStartPoint, endPoint) / PiuPiuConsts.framesPerSeconds;

        //  Shooting bullet
        var moveAction = cc.MoveTo.create(moveDuration, endPoint);
        var seq = new cc.Sequence(moveAction, new cc.CallFunc (this.reachedBounds, this));

        this.sprite.runAction(seq);

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
        this.parentNode.removeObject(this.shape);
        this.removeFromParent();
    },

    onExit:function () {
        this._super();
        console.log("bullet exit");
    }
});