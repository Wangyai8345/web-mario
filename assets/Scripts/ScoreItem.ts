const {ccclass, property} = cc._decorator;

@ccclass
export default class ScoreItem extends cc.Component {

    @property(cc.SpriteFrame)
    score100SpriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    score400SpriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    score1000SpriteFrame: cc.SpriteFrame = null;

    
    displayTime: number = 1;
    fadeOutTime: number = 0.3;
    private curDisplayTime: number = 0;

    animTime: number = 0.7;
    animDist: number = 30;


    start(){
        this.curDisplayTime = this.displayTime;

        let action = cc.moveBy(this.animTime, 0, this.animDist);
        this.node.runAction(action);
    }
    
    setSpriteFrame(score: number = 0){
        if(score === 100){
            this.getComponent(cc.Sprite).spriteFrame = this.score100SpriteFrame;
        }
        else if(score === 400){
            this.getComponent(cc.Sprite).spriteFrame = this.score400SpriteFrame;
        }
        else if(score === 1000){
            this.getComponent(cc.Sprite).spriteFrame = this.score1000SpriteFrame;
        }
    }

    protected update(dt: number): void {
        this.curDisplayTime -= dt;

        if(this.curDisplayTime <= this.fadeOutTime){
            this.node.opacity = 255 * this.curDisplayTime / this.fadeOutTime;
        }

        if(this.curDisplayTime < 0){
            this.node.destroy();
        }
    }
}
