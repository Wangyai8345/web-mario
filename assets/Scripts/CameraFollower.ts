const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraFollower extends cc.Component {

    @property(cc.Node)
    player: cc.Node = null;


    protected update(dt: number): void {
        this.node.x = Math.max(this.player.x, 0);
        this.node.y = Math.max(this.player.y, 0);
    }
}
