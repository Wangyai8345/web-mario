const {ccclass, property} = cc._decorator;

@ccclass
export default class MenuManager extends cc.Component {
    @property(cc.Button)
    level1Button: cc.Button = null;
    
    @property(cc.Button)
    level2Button: cc.Button = null;


    
    start(){
        if(this.level1Button){
            let eh1 = new cc.Component.EventHandler();
            eh1.target = this.node;
            eh1.component = "MenuManager";
            eh1.handler = "goLevel1";
            this.level1Button.clickEvents.push(eh1);
        }
        
        if(this.level2Button){
            let eh2 = new cc.Component.EventHandler();
            eh2.target = this.node;
            eh2.component = "MenuManager";
            eh2.handler = "goLevel2";
            this.level2Button.clickEvents.push(eh2);
        }
    }

    goLevel1(){
        cc.sys.localStorage.setItem("selected_level", "level1");
        cc.director.loadScene("load");
    }

    goLevel2(){
        cc.sys.localStorage.setItem("selected_level", "level2");
        cc.director.loadScene("load");
    }
}
