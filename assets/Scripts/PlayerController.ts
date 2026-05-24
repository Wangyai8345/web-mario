import AudioManager from "./AudioManager";
import GameManager from "./GameManager";

const {ccclass, property} = cc._decorator;

const DEBUG = 0;

@ccclass
export default class PlayerController extends cc.Component {
    @property
    spawnX: number = -400;
    @property
    spawnY: number = -160;
    @property
    speed: number = 100;
    @property
    jumpSpeed: number = 300;
    @property
    coyoteTime: number = 0.25;
    @property
    smallSize: number = 1.3;
    @property
    bigSize: number = 2;
    @property
    invincibleTime: number = 1;


    private moveH: number = 0;
    isMoveable: boolean = false;

    private isGrounded: boolean = false;
    private isJumping: boolean = false;
    private groundColliders: Set<cc.Collider> = new Set();
    
    private poweredUp: boolean = false;
    private isInvincible: boolean = false;
    
    private rb: cc.RigidBody = null;

    private anim: cc.Animation = null;
    private currentAnimName: string = "";



    protected onLoad(): void {
        let physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;

        if(DEBUG){
            physicsManager.debugDrawFlags =
                cc.PhysicsManager.DrawBits.e_shapeBit |
                cc.PhysicsManager.DrawBits.e_jointBit;
        }

        this.rb = this.node.getComponent(cc.RigidBody);
        if (!this.rb) console.warn(`PlayerController missing cc.Rigidbody`);
        
        this.anim = this.node.getComponent(cc.Animation);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }


    protected onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }


    protected update(dt: number): void {
        if(!this.rb) return;
        this.movePlayer();
        this.changeSprite();
    }


    private movePlayer(){
        let speedX = this.moveH * this.speed;
        
        if(!this.isMoveable){
            speedX = 0;
        }

        this.rb.linearVelocity = cc.v2(speedX, this.rb.linearVelocity.y);
    }


    private changeSprite(){
        let speedX = this.rb.linearVelocity.x;
        
        // Flip horizontal direction
        if(speedX < 0)      this.node.scaleX = -Math.abs(this.node.scaleX);
        else if(speedX > 0) this.node.scaleX = Math.abs(this.node.scaleX);
        
        // Animation logic
        if(this.isJumping)      this.playAnimation("player_jump");
        else if(speedX === 0)   this.playAnimation();
        else                    this.playAnimation("player_walk");
    }


    private playAnimation(clipName: string = ""){
        if(this.currentAnimName !== clipName){
            this.currentAnimName = clipName;
            this.anim.play(clipName);

            // Idle state
            if(clipName === ""){
                let state = this.anim.getAnimationState("player_walk");
                if(state){
                    state.time = 0;  
                    this.anim.sample("player_walk");
                }
            }
        }
    }


    private onKeyDown(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.space:
                this.jump();
                break;
            case cc.macro.KEY.a:
                this.moveH = -1;
                break;
            case cc.macro.KEY.d:
                this.moveH = 1;
                break;
            case cc.macro.KEY.t:
                this.debug();
                break;
        }
    }


    private onKeyUp(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                if(this.moveH === -1) this.moveH = 0;
                break;
            case cc.macro.KEY.d:
                if(this.moveH === 1) this.moveH = 0;
                break;
        }
    }


    private jump(){
        if(!this.isGrounded) return;
        if(this.isJumping) return;
        if(!this.isMoveable) return;
        
        this.rb.linearVelocity = cc.v2(this.rb.linearVelocity.x, this.jumpSpeed);
        this.isJumping = true;
        AudioManager.instance.playJump();
    }


    protected onBeginContact(contact: cc.PhysicsContact, self: cc.Collider, other: cc.Collider){
        // floor
        if(other.tag === 1){
            // if the collsion is on bottom
            if(contact.getWorldManifold().normal.y < 0){
                this.groundColliders.add(other);
                this.isGrounded = true;
                this.isJumping = false;
            }
        }
        // Out of bound trigger
        else if(other.tag === 67){
            GameManager.instance.playerDead();
        }
        // Win Flag
        else if(other.tag === 69){
            this.isInvincible = true;
            GameManager.instance.playerWin();
        }
    }   


    protected onEndContact(contact: cc.PhysicsContact, self: cc.Collider, other: cc.Collider){
        // floor
        if(other.tag === 1 && self.tag === 1){
            if(this.groundColliders.has(other)){
                this.groundColliders.delete(other);
                
                // Player is not on ground,
                // however we set isGrounded to false AFTER coyoteTime
                if(this.groundColliders.size === 0){    
                    this.scheduleOnce(() => {
                        if(this.groundColliders.size > 0) return;
                        this.isGrounded = false;
                    }, this.coyoteTime);
                }
            }
        }
    }

    
    // _____________________________________ APIs _____________________________________

    public damagedByMobs(){
        if(this.isInvincible) return;

        if(this.poweredUp){
            this.powerDown();
            this.isInvincible = true;

            this.scheduleOnce(()=>{
                this.isInvincible = false;
            }, this.invincibleTime);
        }
        else{
            GameManager.instance.playerDead();
        }
    }


    public powerUp(){
        this.poweredUp = true;
        this.node.scaleX = this.bigSize;
        this.node.scaleY = this.bigSize;

        AudioManager.instance.playPowerUp();
    }


    public powerDown(){
        this.poweredUp = false;
        this.node.scaleX = this.smallSize;
        this.node.scaleY = this.smallSize;

        AudioManager.instance.playPowerDown();
    }


    public respawn(){
        this.node.x = this.spawnX;
        this.node.y = this.spawnY;

        this.poweredUp = false;
        this.isInvincible = false;
        this.node.scaleX = this.smallSize;
        this.node.scaleY = this.smallSize;

        this.scheduleOnce(() => {
            let colliders = this.getComponents(cc.PhysicsCollider);
            colliders.forEach(collider => {
                collider.enabled = true;
            });
        }, 0);
    }
  

    public deathAnimation(){
        this.scheduleOnce(() => {
            let colliders = this.getComponents(cc.PhysicsCollider);
            colliders.forEach(collider => {
                collider.enabled = false;
            });
        }, 0);

        this.rb.linearVelocity = cc.v2(this.rb.linearVelocity.x, this.jumpSpeed);
    }


    public freeze(){
        this.isMoveable = false;
    }


    public unfreeze(){
        this.isMoveable = true;
    }


    public debug(){
        // TODO: remove this
        if(this.poweredUp){
            this.powerDown();
        }
        else{
            this.powerUp();
        }
    }
}
