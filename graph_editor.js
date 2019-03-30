var canvas = document.getElementById("graph_editor_canvas");
var checkBox = document.getElementById("graphType");
var ctx = canvas.getContext('2d');
var elemLeft = canvas.offsetLeft,
    elemTop = canvas.offsetTop;

var id = 0;
var rad = 20;

var selectedNode1, selectedNode2;

var graph = new Graph("graph");

function isIntersect(point, node, factor) {
  return Math.sqrt((point.x-node.x) ** 2 + (point.y - node.y) ** 2) < rad*factor;
}

function addAndDrawNode(e) {
  var x = e.pageX - elemLeft;
  var y = e.pageY - elemTop;
  graph.addNode(x,y,id);
  drawCircle(id,x,y,"green");
  id++;
}

function addAndDrawEdge(node1, node2){
  graph.addEdge(node1, node2);
  drawSegment(node1, node2);
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
    selectedNode1 = null;
    clearArc(ctx, node.x, node.y, rad + 1.25);
    drawCircle(node.id, node.x, node.y, "green");
    node.isSelect = false;
  } else if(node == selectedNode2){
    selectedNode2 = null;
    clearArc(ctx, node.x, node.y, rad + 1.25);
    drawCircle(node.id, node.x, node.y, "green");
    node.isSelect = false;
  }
}

function drawGraphOrientedMode(){
  graph.modifyType('oriented');
  ctx.fillStyle="blue";
  ctx.beginPath();
  var rapport = graph.edgeList[0].nodeEnd.x / graph.edgeList[0].nodeEnd.x;
  ctx.arc(graph.edgeList[0].nodeBegin.x+rad*Math.cos(rapport),graph.edgeList[0].nodeEnd.x+rad*Math.cos(rapport),rad-15,0,Math.PI*2);
  ctx.stroke();
  ctx.fill();
}

canvas.addEventListener('mouseup', (e) => {
  const mousePos = {
    x: e.pageX - elemLeft,
    y: e.pageY - elemTop
  };
  var intersect = false;
  if(graph.nodeList.length == 0){
    addAndDrawNode(e);
  }else{
    graph.nodeList.forEach(node => {
      if(isIntersect(mousePos, node, 2)){
        intersect = true;
        if(isIntersect(mousePos, node, 1)){
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
      var userInput = prompt('type something');
      if(!isNaN(userInput)){
        result = 1;
        node.modifyID(userInput);
      }
    }
  }
  });
});

checkBox.addEventListener('change', (e) => {
  if (checkBox.checked == true){
    drawGraphOrientedMode();
  }
  
});
