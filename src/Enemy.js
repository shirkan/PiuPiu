/**
 * Created by shirkan on 11/17/14.
 */

var Enemy = cc.Class.extend({
    space:null,
    startX:null,
    startY:null,
    speed:null,
    sprite:null,
    body:null,
    shapeBody:null,
    shapeHead:null,
    ctor: function( parentNode ) {
        this.space = parentNode.space;
        this.sprite = new cc.PhysicsSprite(res.Enemy_png);

        var winSize = cc.director.getWinSize();

        //  Set starting position
        this.startX = winSize.width + this.sprite.width;
        //this.startX = winSize.width/2;
        this.startY = Math.random() * (winSize.height * 2 ) - (winSize.height * 0.5); + this.sprite.width;
        //this.startY = winSize.height / 2;
        var startingPoint = cc.p(this.startX, this.startY);

        //  Set speed
        this.speed = Math.random() * 3 + 1;

        // init physics
        this.body = new cp.Body(1,1);
        this.body.setPos(startingPoint);
        this.sprite.setBody(this.body);
        this.space.addBody(this.body);

        //  Calculate body shape
        var contentSize = this.sprite.getContentSize();
        var bodyX = contentSize.width/2;
        var bodyY = contentSize.height/2;
        var verts = [-bodyX,-bodyY, -bodyX, bodyY-20, bodyX, bodyY-20, bodyX, -bodyY];
        this.shapeBody = new cp.PolyShape(this.body, verts, cp.v(0,0));
        //this.shape = new cp.BoxShape(this.body, contentSize.width - 5 , contentSize.height - 15);
        this.shapeBody.setCollisionType(SpriteTag.Enemy);
        this.shapeBody.setSensor(true);
        this.space.addShape(this.shapeBody);

        //  Calculate head shape
        this.shapeHead = new cp.CircleShape(this.body, PiuPiuConsts.enemyHeadRadius, PiuPiuConsts.enemyHeadOffset);
        this.shapeHead.setCollisionType(SpriteTag.EnemyHead);
        this.shapeHead.setSensor(true);
        this.space.addShape(this.shapeHead);

        parentNode.addChild(this.sprite);

        this.sprite.runAction(cc.MoveTo.create(this.speed, PiuPiuConsts.enemyMoveToPoint));
    },

    removeFromParent:function () {
        this.space.removeShape(this.shapeBody);
        this.shapeBody = null;
        this.space.removeShape(this.shapeHead);
        this.shapeHead = null;
        this.space.removeBody(this.body);
        this.body = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    },

    onExit:function () {
        console.log("enemy exit");
    }

});