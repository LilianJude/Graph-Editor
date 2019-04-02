class Graph {

    constructor(){
        this.name = null;
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

    addNode(x,y,id){
        var node = new Node(x,y,id);
        console.log("The node number " + node.id + " has been added to the list.");
        this.nodeList.push(node);
    };

    deleteNode(node){
        console.log("The node " + node.id + " has been removed from the list.");
        this.nodeList.pop(node);
    };

    addEdge(nodeA, nodeB){
        var edge = new Edge(nodeA, nodeB);
        this.edgeList.push(edge);
        console.log("The edge between " + nodeA.id + " and " + nodeB.id + " has been added to the list.");
    };

    deleteEdge(edge){
        console.log("The edge between " + edge.nodeBegin.id + " and " + edge.nodeEnd.id + " has been removed from the list.");
        this.edgeList.pop(edge);
    };

    reset(){
        this.nodeList = [];
        this.edgeList = [];
    };

    exportGraph(){
        var stream = "{\"graph\": {";
        stream+="\"name\": " + "\"test\",";
        stream+="\"directed\":";
        stream += this.graphType == "oriented" ? "\"true\"," : "\"false\",";
        stream += "\"vertices\": [";
        for(var i = 0; i < this.nodeList.length; i++){
            stream += " { \"id\": \"" + i;
            stream += "\", \"label\": \"" + this.nodeList[i].id;
            stream += "\",\"pos\": {\"x\":\"" + this.nodeList[i].x + "\", \"y\": \"" + this.nodeList[i].y + "\"}}"
            stream += (i == this.nodeList.length-1 ? "" : ",");
        }
        stream += "],\"edges\": [";
        for(var i = 0; i < this.edgeList.length; i++){
            stream += " { \"id1\": \"" + this.edgeList[i].nodeBegin.id + "\", \"id2\": \"" + this.edgeList[i].nodeEnd.id + "\" }" + (i == this.edgeList.length-1 ? "" : ",");
        }
        stream+="]}}";
        return stream;
    };

    isIDExisting(id){
        for(var i in this.nodeList){
            if(parseInt(id) == this.nodeList[i].id){
                return true;
            }
        }
        return false;
    }
}