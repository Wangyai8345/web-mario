const {ccclass, property} = cc._decorator;

@ccclass
export default class AudioManager extends cc.Component {

    public static instance: AudioManager = null;

    @property(cc.AudioClip)
    bgm1: cc.AudioClip = null;
    @property(cc.AudioClip)
    bgm2: cc.AudioClip = null;
    @property(cc.AudioClip)
    bgm3: cc.AudioClip = null;
    @property(cc.AudioClip)
    coin: cc.AudioClip = null;
    @property(cc.AudioClip)
    gameOver: cc.AudioClip = null;
    @property(cc.AudioClip)
    gameOver2: cc.AudioClip = null;
    @property(cc.AudioClip)
    jump: cc.AudioClip = null;
    @property(cc.AudioClip)
    win: cc.AudioClip = null;
    @property(cc.AudioClip)
    loseOneLife: cc.AudioClip = null;
    @property(cc.AudioClip)
    powerDown: cc.AudioClip = null;
    @property(cc.AudioClip)
    powerUp: cc.AudioClip = null;
    @property(cc.AudioClip)
    powerUpAppear: cc.AudioClip = null;
    @property(cc.AudioClip)
    stomp: cc.AudioClip = null;

    private currentBgm: string = "";


    protected onLoad(): void {
        // singleton
        if (AudioManager.instance === null) {
            AudioManager.instance = this;

            cc.game.addPersistRootNode(this.node);
        }
        else{
            this.node.destroy();
            return;
        }
    }
    
    playBgm1(){
        if(this.currentBgm === "bgm1") return;
        this.currentBgm = "bgm1";

        cc.audioEngine.stopAll();
        cc.audioEngine.play(this.bgm1, true, 1);
    }
    
    playBgm2(){
        if(this.currentBgm === "bgm2") return;
        this.currentBgm = "bgm2";

        cc.audioEngine.stopAll();
        cc.audioEngine.play(this.bgm2, true, 1);
    }

    playBgm3(){
        if(this.currentBgm === "bgm3") return;
        this.currentBgm = "bgm3";

        cc.audioEngine.stopAll();
        cc.audioEngine.play(this.bgm3, true, 1);
    }
    
    playLoseOneLife(){
        if(this.currentBgm === "loseOneLife") return;
        this.currentBgm = "loseOneLife";

        cc.audioEngine.stopAll();
        cc.audioEngine.play(this.loseOneLife, false, 2);
    }

    playGameOver(){
        if(this.currentBgm === "gameOver") return;
        this.currentBgm = "gameOver";
        
        cc.audioEngine.stopAll();
        cc.audioEngine.play(this.gameOver, false, 1);
    }

    playGameOver2(){
        if(this.currentBgm === "gameOver2") return;
        this.currentBgm = "gameOver2";

        cc.audioEngine.stopAll();
        cc.audioEngine.play(this.gameOver2, false, 1);
    }

    playCoin(){
        cc.audioEngine.play(this.coin, false, 1);
    }
    
    playJump(){
        cc.audioEngine.play(this.jump, false, 1);
    }
    
    playWin(){
        if(this.currentBgm === "win") return;
        this.currentBgm = "win";

        cc.audioEngine.stopAll();
        cc.audioEngine.play(this.win, false, 1);
    }
    
    playPowerDown(){
        cc.audioEngine.play(this.powerDown, false, 1);
    }
    
    playPowerUp(){
        cc.audioEngine.play(this.powerUp, false, 1);
    }
    
    playPowerUpAppear(){
        cc.audioEngine.play(this.powerUpAppear, false, 0.5);
    }
    
    playStomp(){
        cc.audioEngine.play(this.stomp, false, 1);
    }

    stopAllMusic(){
        this.currentBgm = "";
        cc.audioEngine.stopAll();
    }
}
