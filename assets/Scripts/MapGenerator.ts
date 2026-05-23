import GameManager from "./GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MapGenerator extends cc.Component {

    @property
    tileSize: number = 40;
    
    @property
    bgWidth: number = 1200;
    
    @property
    offsetX: number = 0;

    @property
    offsetY: number = 0;

    @property(cc.Prefab)
    background: cc.Prefab = null;
    @property(cc.Prefab)
    floorPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    wallPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    questionBlockPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    blockPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    shortPipePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    platformPrefab: cc.Prefab = null;;
    @property(cc.Prefab)
    winFlagPrefab: cc.Prefab = null;;
    @property(cc.Prefab)
    goombaPrefeb: cc.Prefab = null;;



    public entityNodes: cc.Node[] = [];


    public generate(mapTxt: string){
        if(mapTxt){
            this.generateBackground(mapTxt);
            this.generateMap(mapTxt);
        }
    }


    private prefabMaper(char: string){
        switch(char){
            case "F":
                return this.floorPrefab; 
            case "W":
                return this.wallPrefab;
            case "-":
                return this.platformPrefab;
            case "S":
                return this.shortPipePrefab;
            case "Q":
                return this.questionBlockPrefab;
            case "B":
                return this.blockPrefab;
            case "P":
                return this.winFlagPrefab;
            case "1":
                return this.goombaPrefeb;
            default:
                return null;
        }
    }
    

    private isEntity(char: string){
        return (char === "1" || char === "Q");
    }


    private generateMap(textData: string) {
        let lines = textData.trim().split('\n');
        let R = lines.length - 1;

        GameManager.instance.setGameTime(parseInt(lines[0]));

        for (let r = 0; r < R; r++) {
            // Left border
            this.instantiatePrefab(r, -1, R, this.prefabMaper("F"), false);
            
            let line = lines[r+1].trim();
            if (!line) continue;

            for(let c = 0; c < line.length; c++){
                let tileChar = line[c];
                let tilePrefab = this.prefabMaper(tileChar);
                let isEntity = this.isEntity(tileChar);

                this.instantiatePrefab(r, c, R, tilePrefab, isEntity);
            }
        }
    }


    private instantiatePrefab(r: number, c: number, R: number, tilePrefab: cc.Prefab, isEntity: boolean){
        if(!tilePrefab) return;

        let tileNode = cc.instantiate(tilePrefab);
        
        // Scale
        tileNode.scaleX *= this.tileSize / 40;
        tileNode.scaleY *= this.tileSize / 40;
        
        // Position
        let posX = this.offsetX + c * this.tileSize;
        let posY = this.offsetY + (R - 1 - r) * this.tileSize;
        posX += this.tileSize / 2;
        posY += this.tileSize / 2;
        tileNode.setPosition(posX, posY);

        // Add child
        this.node.addChild(tileNode);

        // Add entity nodes
        if(isEntity) this.entityNodes.push(tileNode);
    }


    private generateBackground(textData: string){
        let lines = textData.trim().split('\n');
        let totalWidth = lines[lines.length - 1].length * this.tileSize;

        let bgNeeded = totalWidth / this.bgWidth + 1;

        for(let i = 0; i < bgNeeded; i++){
            let bgNode = cc.instantiate(this.background);

            bgNode.scaleX = (i % 2 == 0) ? 1 : -1;

            bgNode.x = 500 + this.bgWidth * i;
            bgNode.y = 250;
            // bgNode.setPosition(posX, posY);

            bgNode.width = this.bgWidth;
            bgNode.height = this.bgWidth * 2 / 3;

            this.node.addChild(bgNode);
        }
    }
}
