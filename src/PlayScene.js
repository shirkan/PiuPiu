/**
 * Created by shirkan on 11/17/14.
 */

const pointsPerEnemyKill = 7;

var PlayScene = cc.Scene.extend({
    space:null,
    shapesToRemove:[],

    initPhysics:function() {
        this.space = new cp.Space();

        this.space.addCollisionHandler(SpriteTag.Bullet, SpriteTag.Enemy,
            this.collisionBulletEnemy.bind(this), null, null, null);
        this.space.addCollisionHandler(SpriteTag.Enemy, SpriteTag.Player,
            this.collisionEnemyPlayer.bind(this), null, null, null);
    },

    onEnter:function () {
        this._super();

        //  Init physics matters
        this.initPhysics();

        this.gameLayer = new cc.Layer();

        //add three layer in the right order
        this.gameLayer.addChild(new BackgroundLayer(), 0, TagOfLayer.Background);
        this.gameLayer.addChild(new GameLayer(this.space), 0, TagOfLayer.Game);
        this.addChild(this.gameLayer);
        this.addChild(new StatusLayer(), 0, TagOfLayer.Status);

        this.scheduleUpdate();
    },

    collisionBulletEnemy: function (arbiter, space) {

        var statusLayer = this.getChildByTag(TagOfLayer.Status);
        statusLayer.updatePoints(PiuPiuConsts.pointsPerEnemyKill);

        var shapes = arbiter.getShapes();
        console.log("B E - found " + shapes.length + " shapes");
        this.shapesToRemove.push(shapes[0], shapes[1]);

    },

    collisionEnemyPlayer: function (arbiter, space) {

        var shapes = arbiter.getShapes();
        console.log("E P - found " + shapes.length + " shapes");
        //  shapes[1] is Zehavi
        this.shapesToRemove.push(shapes[0]);

        var statusLayer = this.getChildByTag(TagOfLayer.Status);
        statusLayer.removeLife();
    },

    update: function (dt) {
        // Simulation cpSpaceAddPostStepCallback
        for(var i = 0; i < this.shapesToRemove.length; i++) {
            console.log("PlayScene: removing shape");
            var shape = this.shapesToRemove[i];
            this.gameLayer.getChildByTag(TagOfLayer.Game).removeObjectByShape(shape);
        }
        this.shapesToRemove = [];
    }
});