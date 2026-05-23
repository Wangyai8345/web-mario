import AudioManager from "./AudioManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelSelector extends cc.Component {
    private isSelected: boolean = false;

    protected onLoad() {
        let L = 1;
        while(true){
            let btnNode = cc.find(`Canvas/Level ${L} Button`);
            if(!btnNode) break;
            
            (btnNode as any).level = L;
            btnNode.on(cc.Node.EventType.TOUCH_END, this.levelButtonsOnclick, this);
            L += 1;
        }
        
        
        let customLevelBtnNode = cc.find(`Canvas/Level Custom Button`);
        if(customLevelBtnNode){
            customLevelBtnNode.on(cc.Node.EventType.TOUCH_END, this.customLevelButtonOnclick, this);
        }

        let backBtnNode = cc.find(`Canvas/Back Button`);
        if(backBtnNode){
            backBtnNode.on(cc.Node.EventType.TOUCH_END, this.changeToMenuScene, this);
        }
    }


    protected start(): void {
        AudioManager.instance.playBgm1();
    }


    private levelButtonsOnclick(event: cc.Event.EventTouch) {
        if(this.isSelected) return;
        this.isSelected = true;
        
        const targetNode = event.target as any;
        let L = targetNode.level;

        cc.sys.localStorage.setItem('level', L);
        cc.director.loadScene(`game`);
    }


    private customLevelButtonOnclick() {
        if (this.isSelected) return;
        this.isSelected = true;

        let input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';

        input.onchange = (event: any) => {
            let file = event.target.files[0];
            if (!file) {
                this.isSelected = false;
                return;
            }

            let reader = new FileReader();
            reader.onload = (e: any) => {
                let mapContent = e.target.result;
                
                cc.sys.localStorage.setItem('customMap', mapContent);
                cc.sys.localStorage.setItem('level', 0);

                cc.director.loadScene('game');
            };
            reader.readAsText(file);
        };

        window.addEventListener('focus', () => {
            this.scheduleOnce(() => {
                if (input.files.length === 0) {
                    this.isSelected = false;
                }
            }, 0.3);
        }, { once: true });

        input.click();
    }


    private changeToMenuScene(){
        cc.director.loadScene('menu');
    }
}
