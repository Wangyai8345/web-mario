import AudioManager from "./AudioManager";
import GameManager from "./GameManager";
import PlayerController from "./PlayerController";
import ScoreItem from "./ScoreItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GoombaController extends cc.Component {
    
    @property(cc.SpriteFrame)
    aliveSpriteFrame: cc.SpriteFrame = null;
    
    @property(cc.SpriteFrame)
    deadSpriteFrame: cc.SpriteFrame = null;
    
    @property
    speed: number = 50;
    
    @property
    deathAnimTime: number = 1;
    
    @property
    idleDist: number = 1000;
    
    @property
    walkAnimCycle: number = 0.1;
    

    private moveDir: number = -1;
    private isAlive: boolean = true;
    private isMoveable: boolean = false;

    private rb: cc.RigidBody = null;
    private playerNode: cc.Node = null;
    
    private spawnX: number = 0;
    private spawnY: number = 0;


    start(){
        this.rb = this.getComponent(cc.RigidBody);
        this.playerNode = cc.find("Canvas/Player");
        this.schedule(this.walkAnim, this.walkAnimCycle, cc.macro.REPEAT_FOREVER, 0);
        
        this.spawnX = this.node.x;
        this.spawnY = this.node.y;
    }


    protected update(dt: number): void {
        this.move();
    }


    private move(){
        if(!this.rb) return;
        
        let speedX = this.moveDir * this.speed;

        if(!this.isMoveable){
            speedX = 0;
        }

        if(Math.abs(this.playerNode.x - this.node.x) >= this.idleDist){
            speedX = 0;
        }

        if(!this.isAlive){
            speedX = 0;
        }

        this.rb.linearVelocity = cc.v2(speedX, this.rb.linearVelocity.y);
    }


    protected onBeginContact(contact: cc.PhysicsContact, self: cc.Collider, other: cc.Collider){
        // Collided by player
        if(other.node.name === "Player"){
            if(!this.isAlive) return;

            let hitOnHead = contact.getWorldManifold().points[0].y > this.node.y + 9;
            if(hitOnHead){
                this.onKilled();
            }
            else{
                let playerController = other.node.getComponent(PlayerController);
                if(playerController) playerController.damagedByMobs();
            }
        }
        // Out of bound trigger
        else if(other.tag == 67){
            // this.node.destroy();
        }

        // Bounce left & right
        if(self.tag == 2){
            if(contact.getWorldManifold().normal.x < 0 && this.moveDir < 0){
                this.moveDir = 1;
            }
            else if(contact.getWorldManifold().normal.x > 0 && this.moveDir > 0){
                this.moveDir = -1;
            }
        }
    }


    private walkAnim(){
        this.node.scaleX = -this.node.scaleX;
    }


    private onKilled(){
        if(!this.isAlive) return;
        
        this.isAlive = false;
        this.getComponent(cc.Sprite).spriteFrame = this.deadSpriteFrame;
        this.unschedule(this.walkAnim);
        this.disableCollision();

        this.scheduleOnce(() => {
            this.node.active = false;
        }, this.deathAnimTime)

        AudioManager.instance.playStomp();
        GameManager.instance.addScore(400);
        GameManager.instance.displayScoreOnScreen(400, this.node.x, this.node.y);
    }


    private disableCollision(){
        this.scheduleOnce(() => {
            let colliders = this.getComponents(cc.PhysicsCollider);
            colliders.forEach(collider => {
                collider.enabled = false;
            });

            let rb = this.getComponent(cc.RigidBody);
            if(rb){
                rb.gravityScale = 0;
                rb.enabled = false; 
            }
        }, 0);
    }


    private enableCollision(){
        this.scheduleOnce(() => {
            let colliders = this.getComponents(cc.PhysicsCollider);
            colliders.forEach(collider => {
                collider.enabled = true;
            });

            let rb = this.getComponent(cc.RigidBody);
            if(rb){
                rb.gravityScale = 1;
                rb.enabled = true; 
            }
        }, 0);
    }


    public unfreeze(){
        this.isMoveable = true;
    }
    
    
    public freeze(){
        this.isMoveable = false;
    }


    public respawn(){
        if(!this.isAlive){
            this.isAlive = true;
            this.enableCollision();
            this.node.active = true;
            this.schedule(this.walkAnim, this.walkAnimCycle, cc.macro.REPEAT_FOREVER, 0);
            this.getComponent(cc.Sprite).spriteFrame = this.aliveSpriteFrame;
        }
        this.moveDir = -1;
        this.node.x = this.spawnX;
        this.node.y = this.spawnY;
    }
}
