/**
 * Created by shirkan on 11/17/14.
 */

var PlayScene = cc.Scene.extend({
    space:null,
    bodiesToRemove:[],

    initPhysics:function() {
        this.space = new cp.Space();

        this.space.addCollisionHandler(SpriteTag.Bullet, SpriteTag.Enemy,
            this.collisionBulletEnemy.bind(this), null, null, null);
        this.space.addCollisionHandler(SpriteTag.Enemy, SpriteTag.Player,
            this.collisionEnemyPlayer.bind(this), null, null, null);
        this.space.addCollisionHandler(SpriteTag.Bullet, SpriteTag.EnemyHead,
            this.collisionBulletEnemyHead.bind(this), null, null, null);
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
        this.bodiesToRemove.push(shapes[0].body, shapes[1].body);

    },

    collisionBulletEnemyHead: function (arbiter, space) {

        var statusLayer = this.getChildByTag(TagOfLayer.Status);
        statusLayer.updatePoints(PiuPiuConsts.pointsPerEnemyHeadShot);
        statusLayer.displayHeadShot();

        var shapes = arbiter.getShapes();
        this.bodiesToRemove.push(shapes[0].body, shapes[1].body);

    },

    collisionEnemyPlayer: function (arbiter, space) {

        var shapes = arbiter.getShapes();
        //  shapes[1] is Zehavi
        this.bodiesToRemove.push(shapes[0].body);

        var statusLayer = this.getChildByTag(TagOfLayer.Status);
        statusLayer.removeLife();
    },

    update: function (dt) {
        this.space.step(dt);

        // Simulation cpSpaceAddPostStepCallback
        for(var i = 0; i < this.bodiesToRemove.length; i++) {
            var shape = this.bodiesToRemove[i];
            this.gameLayer.getChildByTag(TagOfLayer.Game).removeObjectByBody(shape);
        }
        this.bodiesToRemove = [];
    }
});