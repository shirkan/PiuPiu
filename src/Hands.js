/**
 * Created by shirkan on 11/24/14.
 */

var Hands = cc.Class.extend({
    sprite:null,
    ctor: function( parentNode ) {
        this.init( parentNode );
    },
    init: function( parentNode ) {
        this.sprite = new cc.Sprite(res.Hands_png);

        this.sprite.anchorX = 0;
        this.sprite.setPosition(PiuPiuConsts.handsAnchor);
        parentNode.addChild(this.sprite);
    },
    rotateHands: function( angle ) {
    //console.log(angle);
    angle = angle * (180 / Math.PI) * -1;
    //console.log(angle);

    var rotateAction = cc.RotateTo.create(0, angle);
    this.sprite.runAction(rotateAction);
}

});