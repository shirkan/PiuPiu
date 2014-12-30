/**
 * Created by shirkan on 11/17/14.
 */

var Player = cc.Class.extend({
    space:null,
    sprite:null,
    body:null,
    shape:null,
    ctor: function( parentNode ) {
        this.space = parentNode.space;
        this.init( parentNode );
    },
    init: function( parentNode ) {
        this.sprite = new cc.PhysicsSprite(res.Player_png);

        var leftCenterPos = cc.p(this.sprite.width / 2, PiuPiuGlobals.winSize.height / 2);
        //this.setPosition(leftCenterPos);

        // init physics
        var contentSize = this.sprite.getContentSize();

        //  Create body
        this.body = new cp.Body(1,1);
        this.body.setPos(leftCenterPos);
        this.sprite.setBody(this.body);
        this.space.addBody(this.body);

        //  Create shape for collision
        this.shape = new cp.BoxShape(this.body, contentSize.width, contentSize.height);
        this.shape.setCollisionType(SpriteTag.Player);
        this.space.addShape(this.shape);

        parentNode.addChild(this.sprite);
    }
});

