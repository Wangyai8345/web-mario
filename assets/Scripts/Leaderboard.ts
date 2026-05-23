const {ccclass, property} = cc._decorator;

@ccclass
export default class Leaderboard extends cc.Component {
    @property(cc.Label)
    levelLabel: cc.Label = null;

    @property(cc.Prefab)
    lbItem: cc.Prefab = null;


    // TODO: 
    // edit totalLevels if adding more level
    // and database.rules.json
    // and level_selector scene buttons
    // and resources/map.txt
    private totalLevels: number = 2;
    private currentPage: number = 1;
    
    private isLoading: boolean = true;
    private lbItemNodes: cc.Node[] = [];
    private data: any = {};


    protected onLoad() {
        let prevBtn = cc.find(`Canvas/Prev Button`);
        prevBtn.on(cc.Node.EventType.TOUCH_END, this.goPrev, this);
        
        let nextBtn = cc.find(`Canvas/Next Button`);
        nextBtn.on(cc.Node.EventType.TOUCH_END, this.goNext, this);
        
        let backBtn = cc.find(`Canvas/Back Button`);
        backBtn.on(cc.Node.EventType.TOUCH_END, this.goBack, this);
    }
    

    protected async start(){
        this.updateLevelLabel();

        await this.fetchDB();
        this.instantiatePrefabs();

        this.currentPage = 1;
        this.updateLeaderboard();
    }


    private goPrev(){
        this.currentPage = Math.max(1, this.currentPage - 1);
        this.updateLeaderboard();
    }

    
    private goNext(){
        this.currentPage = Math.min(this.totalLevels, this.currentPage + 1);
        this.updateLeaderboard();
    }


    private goBack(){
        cc.director.loadScene('menu');
    }


    private updateLevelLabel(){
        if(this.isLoading){
            this.levelLabel.string = `Loading...`;
        }
        else{
            this.levelLabel.string = `Top players in level${this.currentPage}`;
        }
    }


    private async fetchDB(){
        try{
            for(let level = 1; level <= this.totalLevels; level++){
                const leaderboardRef = firebase.database().ref(`Leaderboard/level${level}`);
                
                const snapshot = await leaderboardRef.orderByChild('score').limitToLast(5).once('value');
                
                let levelBoard: { uid: string, name: string, score: number }[] = [];
                
                snapshot.forEach((child) => {
                    levelBoard.push({
                        uid: child.key,
                        name: child.val().name,
                        score: child.val().score
                    });
                });

                levelBoard.reverse();

                this.data[`level${level}`] = levelBoard;
            }

            this.isLoading = false;
        }
        catch (err){
            cc.error("Error fetching leaderboard database: ", err);
        }
    }


    private instantiatePrefabs(){
        for(let i = 0; i < 5; i++){
            let node = cc.instantiate(this.lbItem);
            node.x = 0;
            node.y = 70 - i*50;
            this.lbItemNodes.push(node);
            cc.find('Canvas').addChild(node);
        }
    }


    private updateLeaderboard(){
        if(this.isLoading) return;

        this.updateLevelLabel();

        let arr = this.data[`level${this.currentPage}`];
        
        for(let i = 0; i < 5; i++){
            let node = this.lbItemNodes[i];

            if(i < arr.length){
                node.getChildByName('Player').getComponent(cc.Label).string = arr[i].name;
                node.getChildByName('Score').getComponent(cc.Label).string = arr[i].score;
            }
            else{
                node.getChildByName('Player').getComponent(cc.Label).string = '';
                node.getChildByName('Score').getComponent(cc.Label).string = '';
            }
        }
    }
}
