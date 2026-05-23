import AudioManager from "./AudioManager";
import GameManager from "./GameManager";
const {ccclass, property} = cc._decorator;

@ccclass
export default class QuestionBlock extends cc.Component {

    private isActivated: boolean = false;
    private isMushroom: boolean = false;

    private anim: cc.Animation = null;
    private currentAnimName: string = "";

    @property(cc.SpriteFrame)
    activatedSpriteFrame: cc.SpriteFrame = null;

    @property(cc.Prefab)
    mushroomPrefab: cc.Prefab = null;
    


    onLoad() {
        this.anim = this.node.getComponent(cc.Animation);
    }

    start() {
        this.playAnimation("question_block");
        this.isMushroom = (Math.random() <= 0.33);
    }

    // update (dt) {}

    
    onBeginContact(contact: cc.PhysicsContact, self: cc.Collider, other: cc.Collider){
        if(other.node.name === "Player"){
            if(contact.getWorldManifold().normal.y < 0){
                this.activate();
            }
        }
    }


    playAnimation(clipName: string = ""){
        if(this.currentAnimName !== clipName){
            this.currentAnimName = clipName;
            this.anim.play(clipName);
        }
    }


    activate(){
        if(this.isActivated) return;

        this.playAnimation("");
        this.isActivated = true;
        this.getComponent(cc.Sprite).spriteFrame = this.activatedSpriteFrame;


        if(this.isMushroom){
            this.spawnItem(this.mushroomPrefab);
            AudioManager.instance.playPowerUpAppear();
        }
        else{
            GameManager.instance.addScore(100);
            GameManager.instance.displayScoreOnScreen(100, this.node.x, this.node.y + 30);
            AudioManager.instance.playCoin();
        }
    }


    spawnItem(prefab: cc.Prefab){
        if(!prefab) return;

        let size = this.node.width;
        let node = cc.instantiate(prefab);

        node.x = this.node.x;
        node.y = this.node.y + size;
        node.width *= size / 40;
        node.height *= size / 40;

        this.node.parent.addChild(node);
    }
}
