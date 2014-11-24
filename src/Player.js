/**
 * Created by shirkan on 11/17/14.
 */

var Player = cc.PhysicsSprite.extend({
    space:null,
    body:null,
    shape:null,
    ctor: function( parentNode ) {
        this._super();
        this.space = parentNode.space;
        this.init( parentNode );
    },
    init: function( parentNode ) {
        this._super(res.Player_png);

        var winSize = cc.director.getWinSize();

        var leftCenterPos = cc.p(this.width / 2, winSize.height / 2);
        //this.setPosition(leftCenterPos);

        // init physics
        var contentSize = this.getContentSize();

        //  Create body
        this.body = new cp.Body(1,1);
        this.body.setPos(leftCenterPos);
        this.setBody(this.body);
        this.space.addBody(this.body);

        //  Create shape for collision
        this.shape = new cp.BoxShape(this.body, contentSize.width, contentSize.height);
        this.shape.setCollisionType(SpriteTag.Player);
        this.space.addShape(this.shape);

        parentNode.addChild(this);
    }
});

