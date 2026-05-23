const {ccclass, property} = cc._decorator;

@ccclass
export default class CameraFollower extends cc.Component {

    @property(cc.Node)
    player: cc.Node = null;

    @property
    leftBoundary: number = 0;

    protected update(dt: number): void {
        this.node.x = Math.max(this.player.x, this.leftBoundary);
    }
}
