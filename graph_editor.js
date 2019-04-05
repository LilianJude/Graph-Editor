var canvas = document.getElementById("graph_editor_canvas");
var checkBox = document.getElementById("graphType");
var exportButton = document.getElementById("export");
var clearButton = document.getElementById("clearButton");
var pageRank = document.getElementById("pageRank");

checkBox.checked = false;
var ctx = canvas.getContext('2d');
var elemLeft = canvas.offsetLeft,
    elemTop = canvas.offsetTop;

var id = 0;
var rad = 20;
var dragok = false;
var startX;
var startY;

var selectedNode1, selectedNode2;

var graph = new Graph();

function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

function isIntersect(point, node, factor) {
  return Math.sqrt((point.x-node.x) ** 2 + (point.y - node.y) ** 2) < rad*factor;
}

function clear(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

function draw(){
  clear();
  ctx.fillStyle = "#FFFFFF";
  rect(0, 0, canvas.width, canvas.height);
  // redraw each rect in the rects[] array

  for(var i = 0; i < graph.edgeList.length; i++){
    var edge = graph.edgeList[i];
    drawSegment(edge.nodeBegin, edge.nodeEnd);
    if(graph.graphType == "oriented"){
      drawArrowEdge(edge.nodeBegin, edge.nodeEnd);
    }
  }

  for (var i = 0; i < graph.nodeList.length; i++) {
      var node = graph.nodeList[i];
      if(node.isSelect){
        drawCircle(node.id, node.x, node.y, "red");
      }else{
        drawCircle(node.id, node.x, node.y, "green");
      }
  }

}

function addAndDrawNode(e) {
  var x = e.pageX - elemLeft;
  var y = e.pageY - elemTop;
  while(graph.isIDExisting(id)){
    id++;
  }
  graph.addNode(x,y,id);
  drawCircle(id,x,y,"green");
  id++;
}

function addAndDrawEdge(node1, node2){
  graph.addEdge(node1, node2);
  drawSegment(node1, node2);
  if(graph.graphType == "oriented"){
    drawArrowEdge(node1, node2);
  }
}

function clearArc(context, x, y, radius) {
  context.save();
  context.globalCompositeOperation = 'destination-out';
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fill();
  context.restore();
}

function drawCircle(id,x,y,color){
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.arc(x,y,rad,0,Math.PI*2);
  ctx.stroke();
  ctx.fill();
  ctx.fillStyle="white";
  ctx.font = "15px Georgia";
  ctx.fillText(id, x-5, y+2);
}

function drawSegment(node1, node2){
  ctx.fillStyle="black";
  ctx.moveTo(node1.x, node1.y);
  ctx.lineTo(node2.x, node2.y);
  ctx.stroke();
}

function selectCircle(node){
  if(selectedNode1 == undefined ){
    selectedNode1 = node;
    clearArc(ctx, node.x, node.y, rad);
    drawCircle(node.id, node.x, node.y, "red");
    node.isSelect = true;
  }else if(selectedNode2 == undefined){
    selectedNode2 = node;
    clearArc(ctx, node.x, node.y, rad);
    drawCircle(node.id, node.x, node.y, "red");
    node.isSelect = true;
  }
  if(selectedNode1 != undefined && selectedNode2 != undefined){
    addAndDrawEdge(selectedNode1, selectedNode2);
    unselectCircle(selectedNode1);
    unselectCircle(selectedNode2);
  }
}

function unselectCircle(node){
  if(node == selectedNode1){
    selectedNode1 = undefined;
    clearArc(ctx, node.x, node.y, rad + 1.25);
    drawCircle(node.id, node.x, node.y, "green");
    node.isSelect = false;
  } else if(node == selectedNode2){
    selectedNode2 = undefined;
    clearArc(ctx, node.x, node.y, rad + 1.25);
    drawCircle(node.id, node.x, node.y, "green");
    node.isSelect = false;
  }
}

function drawArrowEdge(sommet1, sommet2){
  var theta = Math.atan2((sommet1.y - sommet2.y),(sommet1.x - sommet2.x)) - .5*Math.PI;
  ctx.fillStyle="blue";
  ctx.beginPath();
  ctx.save();
  ctx.translate(sommet2.x,sommet2.y);
  ctx.rotate(theta);
  ctx.beginPath();
  ctx.moveTo(0,20);
  ctx.lineTo(10,30);
  ctx.lineTo(-10,30);
  ctx.lineTo(0,20);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

canvas.addEventListener('mousedown', (e) => {
  const mousePos = {
    x: e.pageX - elemLeft,
    y: e.pageY - elemTop
  };

  dragok = false;

  var intersect = false;
  if(graph.nodeList.length == 0){
    addAndDrawNode(e);
  }else{
    graph.nodeList.forEach(node => {
      if(isIntersect(mousePos, node, 2)){
        intersect = true;
        if(isIntersect(mousePos, node, 1)){
          dragok = true;
          node.isDragging = true;
          if(node.isSelect == false){
            selectCircle(node);
          }else{
            unselectCircle(node);
          }
        }
      }
    });
    if(intersect == false && graph.nodeList.length > 0){
      addAndDrawNode(e);
    }
    startX = mousePos.x;
    startY = mousePos.y;
  }
});

canvas.addEventListener('mouseup', (e) => {
  dragok = false;
  for(var i = 0; i < graph.nodeList.length; i++){
    graph.nodeList[i].isDragging = false;
  }
});

canvas.addEventListener('mousemove', (e) => {
  const mousePos = {
    x: e.pageX - elemLeft,
    y: e.pageY - elemTop
  };

  if (dragok) {
        var dx = mousePos.x - startX;
        var dy = mousePos.y - startY;

        for (var i = 0; i < graph.nodeList.length; i++) {
            var node = graph.nodeList[i];
            if (node.isDragging) {
                node.x += dx;
                node.y += dy;
            }
        }

        draw();

        startX = mousePos.x;
        startY = mousePos.y;
    }
});

canvas.addEventListener('dblclick', (e) => {
  const mousePos = {
    x: e.pageX - elemLeft,
    y: e.pageY - elemTop
  };
  graph.nodeList.forEach(node => {
  if(isIntersect(mousePos, node, 1)){
    var result = -1;
    while(result == -1){
      var userInput = prompt('Modifier l\'id du noeud :');
      if(!isNaN(userInput) && userInput != ""){
        if(userInput == null){
          result = 1;
        }else{
          for(var i in graph.nodeList){
            if(parseInt(userInput) == graph.nodeList[i].id){
              alert("Cette étiquette est déjà attribuée à un autre noeud.")
              return;
            }
          }
          result = 1;
          node.modifyID(userInput);
        }
        draw();
      }
    }
  }
  });
});

checkBox.addEventListener('change', (e) => {
  if (checkBox.checked == true){
    graph.modifyType("oriented");
  }else{
    graph.modifyType("non-oriented");
  }
  draw();
});

exportButton.addEventListener("click", function () {
  if(graph.name === null){
    var result = -1;
    while(result == -1){
      var graphName = prompt('Vous devez d\'abord donner un nom au graphe :');
      if(graphName!=null){
        result = 1;
        graph.modifyName(graphName);
      }
    }
  }
  var blob = new Blob([graph.exportGraph()], {type: "application/json;charset=utf-8"});
  saveAs(blob, graph.name+".json");
});
window.addEventListener('keydown', (e) => {
  const key = e.key;
  var edgeIndex = [];

  if(selectedNode1 != undefined){
    if(key == 'Delete'){
      for(var i = 0; i<graph.edgeList.length; i++){
        var edge = graph.edgeList;
        if(edge[i].nodeBegin.id == selectedNode1.id || edge[i].nodeEnd.id == selectedNode1.id){
          edgeIndex.push(i);
        }
      }

      for(var i in edgeIndex){
        graph.edgeList.pop(graph.edgeList[i]);
      }

      for(var i in graph.nodeList){
        var node = graph.nodeList;
        if(node[i].id == selectedNode1.id){
          var n = i;
        }
      }
      unselectCircle(node[n]);
      node.splice(n, 1);
      draw();
    }
  }
});

clearButton.onclick = function(){
  id = 0;
  graph.reset();
  draw();
};

pageRank.onclick = function(){
    var done = false;
    var distance = 0;
    var currentRank;
    var nodesCount = graph.nodeList.length;

    if(graph.graphType != "oriented"){
      return;
    }

    for(var i in graph.nodeList){
      graph.nodeList[i].value = 1/nodesCount;
    }

    for(var j = 0; j < graph.edgeList.length; j++){
      graph.nodeList[graph.edgeList[j].nodeBegin.id].outDegree.push(graph.edgeList[j].nodeEnd);
      graph.nodeList[graph.edgeList[j].nodeEnd.id].inDegree.push(graph.edgeList[j].nodeBegin);
    }

    alert("PAGERANK");
    var pageName = [];
    var vecteur1 = [];
    var vecteur2 = [];
    var nbIteration=0;
    for(var i=0;i<graph.nodeList.length;i++){
      var currentNode = graph.nodeList[i];
      currentNode.pageRank[0] = 1/graph.nodeList.length;
      vecteur1.push(currentNode.pageRank[0]);
      pageName.push(currentNode.id);
    }
    for(var i=0;i<graph.nodeList.length;i++){
      var currentNode = graph.nodeList[i];
      var linkedVertices = currentNode.inDegree;
      var newPageRank = 0;
      for(var j=0;j<linkedVertices.length;j++){
        var linkedNode = linkedVertices[j];
        if(linkedNode.inDegree.length>0){
          newPageRank += linkedNode.pageRank[nbIteration]/linkedNode.inDegree.length;
        }
      }
      if(newPageRank==0){
        newPageRank = currentNode.pageRank[nbIteration];
      }
      currentNode.pageRank[nbIteration+1] = newPageRank;
      vecteur2.push(currentNode.pageRank[nbIteration+1]);
    }
    while(!testArret(vecteur1, vecteur2)){
      nbIteration++;
      vecteur1 = vecteur2;
      vecteur2 = [];
      for(var i=0;i<graph.nodeList.length;i++){
        var currentNode = graph.nodeList[i];
        var linkedVertices = currentNode.inDegree;
        var newPageRank = 0;
        for(var j=0;j<linkedVertices.length;j++){
          var linkedNode = linkedVertices[j];
          if(linkedNode.inDegree.length>0){
            newPageRank += linkedNode.pageRank[nbIteration]/linkedNode.inDegree.length;
          }
        }
        if(newPageRank==0){
          newPageRank = currentNode.pageRank[nbIteration];
        }
        currentNode.pageRank[nbIteration+1] = newPageRank;
        vecteur2.push(currentNode.pageRank[nbIteration+1]);
      }
    }
    // console.log(nbIteration);
    console.log(pageName);
    console.log(vecteur2);

  };

  function scalaire(ary1, ary2) {
      if (ary1.length != ary2.length)
          throw "Les vecteurs ne sont pas de la même taille";
      var dotprod = 0;
      for (var i = 0; i < ary1.length; i++)
          dotprod += ary1[i] * ary2[i];
      return dotprod;
  }

  function normeVecteur(v){
      var somme = 0;

      for(var i in v)
      {
          somme += Math.pow(v[i], 2);
      }

      return Math.sqrt(somme);
  }

  function testArret(v1, v2){

      normeV1 = normeVecteur(v1);
      normeV2 = normeVecteur(v2);

      var cosTeta = scalaire(v1, v2) / (normeV1 * normeV2);

      if(cosTeta >= 0.99999)
          return true;
      return false;
  }
