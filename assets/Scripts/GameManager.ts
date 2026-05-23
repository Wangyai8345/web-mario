import AudioManager from "./AudioManager";
import GoombaController from "./GoombaController";
import MapGenerator from "./MapGenerator";
import PlayerController from "./PlayerController";
import QuestionBlock from "./QuestionBlock";
import ScoreItem from "./ScoreItem";
const {ccclass, property} = cc._decorator;




export enum GAMESTATE{
    INIT,
    READY,
    GAME,
    BREAK,
    END
}




@ccclass
export default class GameManager extends cc.Component {

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
    @property
    totalLives: number = 3;

    @property(cc.Node)
    gameStartModal: cc.Node = null;
    @property(cc.Node)
    gameWinModal: cc.Node = null;
    @property(cc.Node)
    gameLoseModal: cc.Node = null;

    @property(cc.Prefab)
    scoreItemPrefab: cc.Prefab = null;

    @property(MapGenerator)
    mapGenerator: MapGenerator = null;

    @property
    READY_TIME: number = 2;
    @property
    BREAK_TIME: number = 5;
    
    
    public static instance: GameManager = null;
    
    private gameState: GAMESTATE = GAMESTATE.INIT;
    private stateID: number = 0;
    private GAME_TIME: number = 0;
    private isWin: boolean = false;
    private isLose: boolean = false;
    
    private currentLevel: number = 1;
    private timer: number;
    private lives: number;
    private score: number = 0;
   

    protected onLoad(): void {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        // singleton
        if (GameManager.instance === null) {
            GameManager.instance = this;
        }
        else{
            this.node.destroy();
            return;
        }
    }


    protected onDestroy(): void {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        if (GameManager.instance === this) {
            GameManager.instance = null;
        }
    }


    onKeyDown(event: any) {
        if (event.keyCode === cc.macro.KEY.escape) {
            this.backToLevelSelect();
        }
    }


    protected start(): void {
        this.changeState(GAMESTATE.INIT);
    }


    protected update(dt: number): void {
    }


    public getGameState(){
        return this.gameState;
    }


    private startTimer(curStateID: number, callback: any, duration: number) {
        this.timer = Math.ceil(duration);
        
        const onTick = () => {
            if (this.stateID !== curStateID) {
                this.unschedule(onTick);
                return;
            }

            this.timer--;

            if (this.timer > 0) {
                this.updateTimeLabel();
            }
            else{
                this.unschedule(onTick);
                this.updateTimeLabel();
                callback();
            }
        };

        this.updateTimeLabel();
        this.schedule(onTick, 1, this.timer - 1, 1);
    }


    private changeState(state: GAMESTATE) {
        this.gameState = state;
        this.stateID++;
        const curStateID = this.stateID;

        switch(state){
            // Initialize & Generate Map
            case GAMESTATE.INIT:
                this.initialize();
                this.loadAndGenerateMap();

                this.changeState(GAMESTATE.READY);
                break;

            // Showing start modal
            case GAMESTATE.READY:
                this.enableGameStartModal();
                this.freezeEntities();
                AudioManager.instance.stopAllMusic();

                this.startTimer(curStateID, ()=>{ this.changeState(GAMESTATE.GAME) }, this.READY_TIME);
                break;

            // Main game time
            case GAMESTATE.GAME:
                this.respawnEntitiesAndPlayer();
                AudioManager.instance.playBgm1();
                this.disableGameStartModal();

                this.startTimer(curStateID, ()=>{ this.runOutOfTime() }, this.GAME_TIME);
                break;

            // either runOutOfTime or playerDead is called
            case GAMESTATE.BREAK:
                this.player.freeze();

                if(this.isLose){
                    this.enableGameLoseModal();
                    this.startTimer(curStateID, ()=>{ this.changeState(GAMESTATE.END) }, this.BREAK_TIME);
                }
                else if(this.isWin){
                    this.enableGameWinModal();
                    this.saveData();
                    this.startTimer(curStateID, ()=>{ this.changeState(GAMESTATE.END) }, this.BREAK_TIME);
                }
                else{
                    this.startTimer(curStateID, ()=>{ this.changeState(GAMESTATE.READY) }, this.BREAK_TIME);
                }
                break;

            case GAMESTATE.END:
                cc.director.loadScene('level_select');
                break;
        }
    }


    private initialize(){
        this.currentLevel = cc.sys.localStorage.getItem('level');
        this.lives = this.totalLives;
        this.score = 0;
        this.isWin = false;
        this.isLose = false;
        this.updateLevelLabel();
        this.updateTimeLabel();
        this.updateScoreLabel();
        this.updateLifeLabel();
    }


    private loadAndGenerateMap(){
        if(this.currentLevel == 0){
            this.mapGenerator.generate(cc.sys.localStorage.getItem('customMap'));  
            return;
        }

        const path = this.currentLevel ? `map${this.currentLevel}` : `map1`;

        cc.resources.load(path, cc.TextAsset, (err: Error, asset: cc.TextAsset) => {
            if (err) {
                cc.error("Failed reading map, error:", err);
                return;
            }

            if (asset && asset.text) {
                this.mapGenerator.generate(asset.text);                
            }
            else{
                cc.error("Map asset is empty or invalid");
            }
        });
    }


    private enableGameStartModal(){
        this.gameStartModal.active = true;
    }


    private disableGameStartModal(){
        this.gameStartModal.active = false;
    }


    private enableGameLoseModal(){
        this.gameLoseModal.active = true;
    }
    
    
    private enableGameWinModal(){
        this.gameWinModal.active = true;
    }


    private respawnEntitiesAndPlayer(){
        // _____________ Entities (Goomba) _____________
        let entityNodes = this.mapGenerator.entityNodes;
        
        for(let node of entityNodes){
            if(!cc.isValid(node)) continue;
            
            let goomba = node.getComponent(GoombaController);
            if(goomba){
                goomba.respawn();
                goomba.unfreeze();
                continue;
            }

            let qblock = node.getComponent(QuestionBlock);
            if(qblock){
                qblock.disactivate();
                continue;
            }
        }
        
        // _____________ Player  _____________
        this.player.unfreeze();
        this.player.respawn();
    }


    private freezeEntities(){
        let entityNodes = this.mapGenerator.entityNodes;
        
        for(let node of entityNodes){
            if(!cc.isValid(node)) continue;
            
            let goomba = node.getComponent(GoombaController);
            if(goomba){
                goomba.freeze();
                continue;
            }
        }
    }


    playerDead(){
        if(this.gameState !== GAMESTATE.GAME) return;

        this.lives -= 1;
        this.updateLifeLabel();
    
        this.player.deathAnimation();

        if(this.lives <= 0) this.isLose = true;

        if(this.isLose){
            AudioManager.instance.playGameOver();
        }
        else{
            AudioManager.instance.playLoseOneLife();
        }

        this.changeState(GAMESTATE.BREAK);
    }


    runOutOfTime(){
        if(this.gameState !== GAMESTATE.GAME) return;

        this.lives -= 1;
        this.updateLifeLabel();
        
        this.player.deathAnimation();
        
        AudioManager.instance.playGameOver2();
        
        if(this.lives <= 0) this.isLose = true;
        this.changeState(GAMESTATE.BREAK);
    }


    playerWin(){
        if(this.gameState != GAMESTATE.GAME) return;
        
        this.isWin = true;
        AudioManager.instance.playWin();
        this.changeState(GAMESTATE.BREAK);
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

        this.mapGenerator.node.addChild(node);
    }


    updateLevelLabel(){
        this.levelLabel.string = `LEVEL ${this.currentLevel}`;
    }

    
    updateLifeLabel(){
        this.lifeLabel.string = `❤️x${this.lives}`;
    }


    updateTimeLabel(){
        let t = Math.ceil(this.timer);
        let displayTime = t >= 0 ? t : 0;
        this.timeLabel.string = `TIME: ${displayTime}`;
    }


    updateScoreLabel(){
        this.scoreLabel.string = `SCORE: ${this.score}`;
    }


    setGameTime(time: number){
        this.GAME_TIME = time;
    }


    backToLevelSelect(){
        cc.director.loadScene('level_select');
    }


    private async saveData(){
        const user = firebase.auth().currentUser;
        if(!user) return;

        const uid = user.uid;
        const username = user.email.split('@')[0];
        
        
        // Save player's own highscore
        const playerRef = firebase.database().ref('Players/' + uid + '/HighScore');
        
        try {
            const snapshot = await playerRef.once('value');
            const dbScore = snapshot.val() || -1;
            
            if (this.score > dbScore) {
                await playerRef.set(this.score);
            }
        }
        catch (err) {
            cc.error("Error saving score to firebase database: ", err);
        }
        
        
        // Save to leaderboard if top 5
        const leaderboardRef = firebase.database().ref('Leaderboard/' + `level${this.currentLevel}`);
        
        try {
            const snapshot = await leaderboardRef.orderByChild('score').once('value');
        
            let currentBoard: { key: string, score: number }[] = [];
            snapshot.forEach((child) => {
                currentBoard.push({ key: child.key, score: child.val().score });
            });

            let shouldSave = false;
            let keyToRemove: string = null;

            if (currentBoard.length < 5) {
                shouldSave = true;
            }
            else{
                const lowestTopScore = currentBoard[0].score;
                if (this.score > lowestTopScore) {
                    shouldSave = true;
                    keyToRemove = currentBoard[0].key;
                }
            }

            if(shouldSave){
                let updates: any = {};
                
                if (keyToRemove && keyToRemove !== uid) {
                    updates[keyToRemove] = null; 
                }
                
                updates[uid] = { name: username, score: this.score };

                await leaderboardRef.update(updates);
            }
        }
        catch (err) {
            cc.error("Error saving score to firebase database: ", err);
        }
    }
}
