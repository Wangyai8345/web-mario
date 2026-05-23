const {ccclass, property} = cc._decorator;

@ccclass
export default class MapGenerator extends cc.Component {

    @property(cc.TextAsset)
    mapDataFile: cc.TextAsset = null;
    
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
    floor2Prefab: cc.Prefab = null;
    @property(cc.Prefab)
    questionBlockPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    blockPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    shortPipePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    platformPrefab: cc.Prefab = null;;
    @property(cc.Prefab)
    goombaPrefeb: cc.Prefab = null;;


    prefabMaper(char: string){
        switch(char){
            case "F":
                return this.floorPrefab; 
            case "W":
                return this.floor2Prefab;
            case "P":
                return this.platformPrefab;
            case "S":
                return this.shortPipePrefab;
            case "Q":
                return this.questionBlockPrefab;
            case "B":
                return this.blockPrefab;
            case "1":
                return this.goombaPrefeb;
            default:
                return null;
        }
    }


    start(){
        if(this.mapDataFile){
            this.generateBackground(this.mapDataFile.text);
            this.generateMap(this.mapDataFile.text);
        }
    }

    generateMap(textData: string) {
        let lines = textData.trim().split('\n');
        
        for (let r = 0; r < lines.length; r++) {
            let line = lines[r].trim();
            if (!line) continue;

            for(let c = 0; c < line.length; c++){
                let tileChar = line[c];
                let tilePrefab = this.prefabMaper(tileChar);

                if (tilePrefab) {
                    let tileNode = cc.instantiate(tilePrefab);
                    
                    // Scale
                    tileNode.scaleX *= this.tileSize / 40;
                    tileNode.scaleY *= this.tileSize / 40;
                    
                    // Position
                    let posX = this.offsetX + c * this.tileSize;
                    let posY = this.offsetY + (lines.length - 1 - r) * this.tileSize;
                    posX += this.tileSize / 2;
                    posY += this.tileSize / 2;
                    tileNode.setPosition(posX, posY);

                    // Add child
                    this.node.addChild(tileNode);
                }
            }
        }
    }

    generateBackground(textData: string){
        let lines = textData.trim().split('\n');
        let totalWidth = lines[0].length * this.tileSize;

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
