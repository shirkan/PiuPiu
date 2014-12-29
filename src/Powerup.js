/**
 * Created by shirkan on 12/8/14.
 */

function PowerUp(type, parentNode, sprite, onHit, period, location) {
    this.type = type;
    this.parentNode = parentNode;
    this.sprite = new cc.PhysicsSprite(sprite);
    this.onHit = onHit;
    this.isRemoved = false;    //Bug fix: can be removed by time/collision
    this.canBeRedeemed = true;

    this.space = parentNode.space;
    this.onHit = onHit;


    //  Set starting position
    if (location == undefined) {
        //  Random location on last Q of screen
        this.x = Math.random() * (PiuPiuGlobals.winSize.width / 2) + (PiuPiuGlobals.winSize.width / 2 - this.sprite.width);
        this.y = Math.random() * (PiuPiuGlobals.winSize.height - this.sprite.height) + this.sprite.height / 2;
        location = cc.p(this.x, this.y);
    }

    //  Set tag to the powerup
    this.tag = getTag();

    //  Register collision
    this.space.addCollisionHandler(SpriteTag.Bullet, this.tag,
        this.callback.bind(this), null, null, null);

    // init physics
    this.body = new cp.Body(1, 1);
    this.body.setPos(location);
    this.sprite.setBody(this.body);
    this.space.addBody(this.body);

    //  Calculate body shape
    this.shape = new cp.CircleShape(this.body, PiuPiuConsts.powerupRadius, PiuPiuConsts.powerupCenterPoint);
    this.shape.setCollisionType(this.tag);
    this.shape.setSensor(true);
    this.space.addShape(this.shape);

    //  Display power up
    this.parentNode.addChild(this.sprite, PiuPiuConsts.powerupLocalZOrder);

    //  Remove powerup in "period" seconds
    cc.director.getScheduler().scheduleCallbackForTarget(this, this.timeUp.bind(this), 0, 0, period);
};

PowerUp.prototype.timeUp = function (  ) {
    LOG("timeup for " + this.tag)
    if (this.isRemoved) {
        return;
    }
    this.parentNode.removeObject(this.body);
    this.removeFromParent();
};

PowerUp.prototype.removeFromParent = function (  ) {
    if (this.isRemoved) {
        return;
    }
    try {
        this.isRemoved = true;
        this.space.removeShape(this.shape);
        this.shape = null;
        this.space.removeBody(this.body);
        this.body = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    } catch (err) {
        LOG("Powerup removeFromParent caught error: " + err);
    }
};

PowerUp.prototype.getTag = function() {
    return this.tag;
};

PowerUp.prototype.callback = function(arbiter, space) {
    if (!this.canBeRedeemed){
        return;
    }
    this.canBeRedeemed = false;

    //LOG("redeemed power up with type " + this.type + " and tag " + this.tag);
    ////  Unschedule auto remove from parent
    //cc.director.getScheduler().unscheduleCallbackForTarget(this, PowerUp.prototype.timeUp);

    //  Update stats
    PiuPiuGlobals.totalPowerUps++;

    //  Schedule remove powerup and bullet from parent on space post step
    var cleanUp = function () {
        LOG("cleaning up bullet-powerup collision " + this.tag + " with arbiter " + arbiter);
        var shapes = arbiter.getShapes();
        this.parentNode.removeObjectByBody(shapes[0].body);
        this.parentNode.removeObjectByBody(shapes[1].body);
    }
    addPostStepCallback(cleanUp.bind(this));

    //  Invoke callback
    this.onHit();
};