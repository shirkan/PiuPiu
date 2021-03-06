/**
 * Created by shirkan on 11/24/14.
 */

var Hands = cc.Class.extend({
    sprite:null,
    ctor: function( parentNode ) {
        this.init( parentNode );
    },
    init: function( parentNode ) {
        this.sprite = new cc.Sprite("#hands.png");

        this.sprite.anchorX = 0;
        this.sprite.setPosition(PiuPiuConsts.handsAnchor);
        parentNode.addChild(this.sprite);
    },
    rotateHands: function( angle ) {
    angle = angle * (180 / Math.PI) * -1;

    var rotateAction = cc.RotateTo.create(0, angle);
    this.sprite.runAction(rotateAction);
},
    setHandsMachineGun : function() {
        this.sprite.setSpriteFrame("hands_machine_gun.png");
    },

    setHandsNormal: function () {
        this.sprite.setSpriteFrame("hands.png");
    },

    setHandsCaptain : function () {
        this.sprite.setSpriteFrame("hands_captain.png");
    },

    setHandsMachineGunCaptain : function () {
        this.sprite.setSpriteFrame("hands_machine_gun_captain.png");
    }

});