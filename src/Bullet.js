/**
 * Created by shirkan on 11/17/14.
 */

var Bullet = cc.PhysicsSprite.extend({
    space:null,
    body:null,
    shape:null,

    ctor: function( parentNode, endPoint, bulletStartPoint, endAngle ) {
        this._super();
        this.space = parentNode.space;
        this.init( parentNode, endPoint, bulletStartPoint, endAngle );
    },
    init: function( parentNode, endPoint, bulletStartPoint, endAngle ) {

        //  Init sprite
        this._super(res.Bullet_png);

        // init physics
        this.body = new cp.Body(1,1);
        this.body.setPos(bulletStartPoint);
        this.body.setAngle(endAngle);
        this.setBody(this.body);

        //this.setPhysicsBody(this.body);
        this.space.addBody(this.body);

        var contentSize = this.getContentSize();
        this.shape = new cp.BoxShape(this.body, contentSize.width, contentSize.height);
        this.shape.setCollisionType(SpriteTag.Bullet);
        this.shape.setSensor(true);
        this.space.addShape(this.shape);

        //  Visualize
        parentNode.addChild(this);

        //  Shooting bullet
        var moveAction = cc.MoveTo.create(1, endPoint);
        var seq = cc.Sequence.create(moveAction, cc.CallFunc.create (function (bullet) {
            bullet.getParent().removeObject(this.shape);
            bullet.removeFromParent();
        }));

        this.runAction(seq);

        this.scheduleUpdate();
    },

    update: function (dt) {
        this.space.step(dt);
    },

    getShape:function () {
        return this.shape;
    },

    removeFromParent:function () {
        this.space.removeShape(this.shape);
        this.space.removeBody(this.body);
        this.shape = null;
        this._super();
    }
});