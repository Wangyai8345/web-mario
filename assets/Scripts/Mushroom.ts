
import GameManager from "./GameManager";
import PlayerController from "./PlayerController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Mushroom extends cc.Component {

    @property
    speed: number = 80;
    
    @property
    startMoveTime: number = 1;


    private curStartMoveTime: number = 0;
    private moving: boolean = false;
    private moveDir: number = 0;
    private beCollected: boolean = false;

    private rb: cc.RigidBody = null;

    start(){
        this.rb = this.getComponent(cc.RigidBody);
    }

    protected update(dt: number): void {
        if(this.moving){
            this.move();
            return;
        }

        this.curStartMoveTime += dt;

        if(this.curStartMoveTime >= this.startMoveTime){
            this.moving = true;
            this.moveDir = (Math.random() <= 0.5) ? -1 : 1;
        }        
    }


    move(){
        if(!this.rb) return;

        let speedX = this.moveDir * this.speed;
        this.rb.linearVelocity = cc.v2(speedX, this.rb.linearVelocity.y);
    }


    onBeginContact(contact: cc.PhysicsContact, self: cc.Collider, other: cc.Collider){
        // Collided by player
        if(other.node.name === "Player"){
            if(this.beCollected) return;
            
            this.beCollected = true;

            let playerController = other.node.getComponent(PlayerController);
            if(playerController) playerController.powerUp();

            GameManager.instance.addScore(1000);
            GameManager.instance.displayScoreOnScreen(1000, this.node.x, this.node.y + 30);

            contact.disabled = true; // make player clip through the mushroom
            this.node.destroy();
        }

        // Out of bound trigger
        else if(other.tag == 67){
            this.node.destroy();
        }

        // Bounce left & right
        else if(self.tag == 2){
            if(contact.getWorldManifold().normal.x < 0 && this.moveDir < 0){
                this.moveDir = 1;
            }
            else if(contact.getWorldManifold().normal.x > 0 && this.moveDir > 0){
                this.moveDir = -1;
            }
        }
    }
}
