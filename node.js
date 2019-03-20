export class Node {

    constructor(x,y,id){
        this.x = x;
        this.y = y;
        this.id = id;
        this.isSelect = false;
    };

    modifyID(id){
        this.id = id;
        console.log("The node's id is now" + this.id);
    };

    modifyPosition(x,y){
        this.x = x;
        this.y = y;
        console.log("The node's position is now (" + this.x + "," + this.y + ").");
    };

    modifySelectedState(state){
        this.isSelect = state;
        console.log("The node " + this.id + " is now " + this.isSelect == true ? "selected." : "unselected.")
    };

}