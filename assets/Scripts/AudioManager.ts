const {ccclass, property} = cc._decorator;

@ccclass
export default class AudioManager extends cc.Component {

    public static instance: AudioManager = null;

    @property(cc.AudioClip)
    bgm1: cc.AudioClip = null;
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


    protected onLoad(): void {
        // singleton
        if (AudioManager.instance === null) {
            AudioManager.instance = this;
        }
        else{
            this.node.destroy();
            return;
        }
    }
    
    playBgm1(){
        cc.audioEngine.stopAll();
        cc.audioEngine.play(this.bgm1, true, 1);
    }
    
    playLoseOneLife(){
        cc.audioEngine.stopAll();
        cc.audioEngine.play(this.loseOneLife, false, 2);
    }

    playGameOver(){
        cc.audioEngine.stopAll();
        cc.audioEngine.play(this.gameOver, false, 1);
    }

    playGameOver2(){
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
}
