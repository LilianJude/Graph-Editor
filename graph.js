export class Graph {

    constructor(name){
        this.name = name;
        this.graphType = "non-oriented";
        this.nodeList = [];
        this.edgeList = [];
    };

    modifyType(type){
        this.graphType = type;
        console.log("The graph is now " + this.graphType +".");
    };

    modifyName(name){
        this.name = name;
        console.log("The graph's name is now " + this.name);
    };

    addNode(node){
        console.log("The node number " + node.name + " has been added to the list.");
        this.nodeList.push(node);
    };

    deleteNode(node){
        console.log("The node " + node.name + " has been removed from the list.");
        this.nodeList.pop(node);
    };

    addEdge(nodeA, nodeB){
        var edge = new Edge(nodeA, nodeB);
        this.edgeList.push(edge);
        console.log("The edge between " + nodeA.name + " and " + nodeB.name + " has been added to the list.");
    };

    deleteEdge(edge){
        console.log("The edge between " + edge.nodeBegin.name + " and " + edge.nodeEnd.name + " has been removed from the list.");
        this.edgeList.pop(edge);
    };

    reset(){
        this.nodeList = [];
        this.nodeList = [];
    };

    exportGraph(){

    };
}
