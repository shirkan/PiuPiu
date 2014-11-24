/**
 * Created by shirkan on 11/24/14.
 */

var Hands = cc.Sprite.extend({
    ctor: function( parentNode ) {
        this._super();
        this.init( parentNode );
    },
    init: function( parentNode ) {
        this._super(res.Hands_png);

        this.anchorX = 0;
        this.setPosition(PiuPiuConsts.handsAnchor);
        parentNode.addChild(this);

        console.log("size is " + this.width);
    },
    rotateHands: function( angle ) {
    //console.log(angle);
    angle = angle * (180 / Math.PI) * -1;
    //console.log(angle);

    var rotateAction = cc.RotateTo.create(0.05, angle);
    this.runAction(rotateAction);
}

});