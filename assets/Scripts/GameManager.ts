import AudioManager from "./AudioManager";
import PlayerController from "./PlayerController";
import ScoreItem from "./ScoreItem";
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    public static instance: GameManager = null;

    @property
    gameTime: number = 100;
    
    @property
    totalLives: number = 3;
    
    @property
    currentLevel: number = 0;
    
    @property(cc.Label)
    levelLabel: cc.Label = null;

    @property(cc.Label)
    lifeLabel: cc.Label = null;
    
    @property(cc.Label)
    timeLabel: cc.Label = null;
    
    @property(cc.Label)
    scoreLabel: cc.Label = null;
    
    @property(PlayerController)
    player: PlayerController = null;

    @property(cc.Prefab)
    scoreItemPrefab: cc.Prefab = null;



    private timeLeft: number;
    private lives: number;
    private score: number = 0;

    private deathWaitTime: number = 5;
    private curDeathWaitTime: number;
    private deathWaiting: boolean = false;
    private isGameOver: boolean = false;


    protected onLoad(): void {
        // singleton
        if (GameManager.instance === null) {
            GameManager.instance = this;
        }
        else{
            this.node.destroy();
            return;
        }
    }


    protected start(): void {
        this.lives = this.totalLives;
        this.timeLeft = this.gameTime;
        this.startGame();
    }


    protected update(dt: number): void {
        if(!this.deathWaiting){
            this.timeLeft -= dt;
            this.updateTimeLabel();
    
            if(this.timeLeft < 0){
                this.runOutOfTime();
            }
        }

        else{
            this.curDeathWaitTime -= dt;
            if(this.curDeathWaitTime < 0){
                this.deathWaiting = false;
                
                if(this.isGameOver){
                    cc.director.loadScene("menu");
                }
                else{
                    this.startGame();
                }
            }
        }
    }


    // Called when game starts or player revived
    startGame(){   
        this.updateLevelLabel();
        this.updateTimeLabel();
        this.updateScoreLabel();
        this.updateLifeLabel();

        this.player.respawn();
        this.player.unfreezePlayer();
        AudioManager.instance.playBgm1();
    }


    // Cool down upon death or game over
    deathWait(){
        this.deathWaiting = true;
        this.curDeathWaitTime = this.deathWaitTime;
        this.player.freezePlayer();
    }


    playerDead(){
        if(this.deathWaiting) return;

        this.lives -= 1;
        this.updateLifeLabel();
        
        this.player.deathAnimation();
        
        this.deathWait();

        if(this.lives <= 0){
            this.isGameOver = true;
            AudioManager.instance.playGameOver();
        }
        else{
            AudioManager.instance.playLoseOneLife();
        }
    }


    runOutOfTime(){
        if(this.deathWaiting) return;

        this.deathWait();    
        this.isGameOver = true;
        AudioManager.instance.playGameOver2();
    }


    addScore(score: number){
        this.score += score;
        this.updateScoreLabel();
    }


    displayScoreOnScreen(score: number, x: number, y: number){
        if(!this.scoreItemPrefab) return;
        
        let node = cc.instantiate(this.scoreItemPrefab);

        node.x = x;
        node.y = y;
        node.width = 40;
        node.height = 20;

        node.getComponent(ScoreItem).setSpriteFrame(score);

        cc.find("Canvas/Map Generator").addChild(node);
    }


    updateLevelLabel(){
        this.levelLabel.string = `LEVEL ${this.currentLevel}`;
    }

    
    updateLifeLabel(){
        this.lifeLabel.string = `❤️x${this.lives}`;
    }


    updateTimeLabel(){
        let t = Math.ceil(this.timeLeft);
        let displayTime = t >= 0 ? t : 0;
        this.timeLabel.string = `TIME: ${displayTime}`;
    }


    updateScoreLabel(){
        this.scoreLabel.string = `SCORE: ${this.score}`;
    }
}
