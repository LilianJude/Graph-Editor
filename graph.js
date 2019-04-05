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
        console.log("The edge and node array have been cleared.");
    };

    exportGraph(){
        var stream = "{\"graph\": {";
        stream+="\"name\": " + "\"" + this.name + "\",";
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
            stream += " { \"id1\": \"" + this.edgeList[i].nodeBegin.id;
            stream += "\", \"id2\": \"" + this.edgeList[i].nodeEnd.id;
            stream += "\" }" + (i == this.edgeList.length-1 ? "" : ",");
        }
        stream+="]}}";
        console.log("The graph has been stored in a json file.");
        return stream;
    };

    parseJSON(stream){
        this.reset();
        var obj = JSON.parse(stream);
        if(obj.graph != undefined){
            var jsonGraph = obj.graph;
            this.modifyName(jsonGraph.name);
            this.modifyType((jsonGraph.directed=="false" ? "non-oriented" : "oriented"));
            var nodes = jsonGraph.vertices;
            for (var i = 0; i < nodes.length; i++) {
                this.addNode(parseInt(nodes[i].pos.x), parseInt(nodes[i].pos.y),parseInt(nodes[i].label));
            }
            var edges = jsonGraph.edges;
            for (var i = 0; i < edges.length; i++) {
                this.addEdge(this.nodeList[edges[i].id1], this.nodeList[edges[i].id2]);
            }
            console.log("The importation is finished.");
        }else{
            alert("Le fichier ne respecte pas le format demandé.");
        }
    }

    isIDExisting(id){
        for(var i in this.nodeList){
            if(parseInt(id) == this.nodeList[i].id){
                return true;
            }
        }
        return false;
    }
}