/**
 * Created by shirkan on 11/17/14.
 */

var Bullet = cc.PhysicsSprite.extend({
    endX:null,
    endY:null,
    rotationAngle:null,
    space:null,
    body:null,
    shape:null,

    ctor: function( space, shootToX, shootToY ) {
        //  If shooting backwards, don't create bullet
        if (shootToX < PiuPiuConsts.sourcePoint.x) {
            return null;
        }

        this._super();
        this.space = space;
        this.init( shootToX, shootToY );
    },
    init: function( shootToX, shootToY ) {

        //  Init sprite
        this._super(res.Bullet_png);

        const startingPoint = new cc.p(PiuPiuConsts.sourcePoint.x, PiuPiuConsts.sourcePoint.y);
        //this.setPosition(startingPoint);

        this.calculateTrigonometry(shootToX, shootToY);

        // init physics
        this.body = new cp.Body(1,1);
        this.body.setPos(startingPoint);
        this.body.setAngle(this.rotationAngle);
        this.setBody(this.body);

        //this.setPhysicsBody(this.body);
        this.space.addBody(this.body);

        var contentSize = this.getContentSize();
        this.shape = new cp.BoxShape(this.body, contentSize.width, contentSize.height);
        this.shape.setCollisionType(SpriteTag.Bullet);
        this.shape.setSensor(true);
        this.space.addShape(this.shape);

        this.scheduleUpdate();
   },

    visualize: function( node) {
        node.addChild(this);
    },

    calculateTrigonometry: function (x, y) {
        var winSize = cc.director.getWinSize();

        var dx = x - PiuPiuConsts.sourcePoint.x;
        var dy = y - PiuPiuConsts.sourcePoint.y;

        //  Calculating ax+b = 0
        var a = dy / dx ;
        var b = y - (a * x);

        //  Calculating end point
        if (a==0) {
            //  very rare, end point is right ahead after right border
            this.endX = winSize.width;
            this.endY = y;
        } else {
            //  Calculate intersection of ax+b with x=winSize.width
            var xBorderEndX = winSize.width;
            var xBorderEndY = a * xBorderEndX + b;

            //  Calculate intersection of ax+b with y=0 or y=winSize.height
            if (a>0) {
                var yBorderEndY = winSize.height;
            } else {
                var yBorderEndY = 0;
            }

            var yBorderEndX = (yBorderEndY - b) / a;

            //  Determine which is closer, using Pitagoras
            var xBorderLength = Math.sqrt(Math.pow(xBorderEndX - PiuPiuConsts.sourcePoint.x, 2) + Math.pow(xBorderEndY - PiuPiuConsts.sourcePoint.y, 2));
            var yBorderLength = Math.sqrt(Math.pow(yBorderEndX - PiuPiuConsts.sourcePoint.x, 2) + Math.pow(yBorderEndY - PiuPiuConsts.sourcePoint.y, 2));

            if (xBorderLength < yBorderLength) {
                this.endX = xBorderEndX;
                this.endY = xBorderEndY;
            } else {
                this.endX = yBorderEndX;
                this.endY = yBorderEndY;
            }
        }

        //  Calculate rotation angle
        //  "a" is the tangent, so the angle should be tan(a
        this.rotationAngle = (Math.atan(a)).toFixed(2);

        //this.rotation = this.rotationAngle;
    },

    update: function (dt) {
        this.space.step(dt);
    },

    shoot: function () {
        var moveAction = cc.MoveTo.create(1, cc.p(this.endX,this.endY));
        var seq = cc.Sequence.create(moveAction, cc.CallFunc.create (function (bullet) {
            bullet.removeFromParent();
        }));
        this.runAction(seq);
    },

    getShape:function () {
        return this.shape;
    },

    removeFromParent:function () {
        this.getParent().removeObject(this.shape);
        this.space.removeShape(this.shape);
        this.space.removeBody(this.body);
        this.shape = null;
        this._super();
    }
});