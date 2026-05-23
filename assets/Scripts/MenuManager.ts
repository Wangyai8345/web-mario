import AudioManager from "./AudioManager";

const {ccclass, property} = cc._decorator;


@ccclass
export default class MenuManager extends cc.Component {
    private playButton: cc.Node = null;
    private leaderboardButton: cc.Node = null;
    private signoutButton: cc.Node = null;

    protected onLoad(){
        this.playButton = cc.find("Canvas/Play Button");
        this.leaderboardButton = cc.find("Canvas/Leaderboard Button");
        this.signoutButton = cc.find("Canvas/Sign Out Button");
        
        this.registerButtonEvents();
    }


    protected start(): void {
        AudioManager.instance.playBgm1();
    }

    private registerButtonEvents(){
        this.playButton.on(cc.Node.EventType.TOUCH_END, this.changeToLevelSelectScene, this);
        this.leaderboardButton.on(cc.Node.EventType.TOUCH_END, this.changeToLeaderboardScene, this);
        this.signoutButton.on(cc.Node.EventType.TOUCH_END, this.signOut, this);
    }


    private changeToLevelSelectScene(){
        this.disableAllButton();
        cc.director.loadScene('level_select');
    }
    
    
    private changeToLeaderboardScene(){
        // TODO
        // this.disableAllButton();
        // cc.director.loadScene('leaderboard');
    }
    
    
    private async signOut(){
        this.disableAllButton();
        await firebase.auth().signOut();
        cc.director.loadScene('auth');
    }

    private disableAllButton(){
        this.playButton.getComponent(cc.Button).interactable = false;
        this.leaderboardButton.getComponent(cc.Button).interactable = false;
        this.signoutButton.getComponent(cc.Button).interactable = false;
    }
}
