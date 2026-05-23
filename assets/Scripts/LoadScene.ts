const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadScene extends cc.Component {

    private waitTime: number = 3;

    start(){
        this.schedule(this.changeScene, this.waitTime);
    }
    
    changeScene(){
        let targetLevel = cc.sys.localStorage.getItem("selected_level");
        
        if(targetLevel){
            cc.director.loadScene(targetLevel);
        }
        else{
            cc.director.loadScene("level1");
        }
    }
}
