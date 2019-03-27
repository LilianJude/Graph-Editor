var canvas = document.getElementById("graph_editor_canvas");
var ctx = canvas.getContext('2d');
var elemLeft = canvas.offsetLeft,
    elemTop = canvas.offsetTop;

var id = 0;
var rad = 20;
var nodeList = [];

var selectedNode1, selectedNode2;

var graph = new Graph("graph");

function isIntersect(point, node, factor) {
  return Math.sqrt((point.x-node.x) ** 2 + (point.y - node.y) ** 2) < rad*factor;
}

function addNode(e) {
  var x = e.pageX - elemLeft;
  var y = e.pageY - elemTop;
  var node = new Node(x, y, id, false);
  id = id + 1;
  graph.nodeList.push(node);
  drawCircle(x,y,"green");
}

function removeNode(node){
  graph.nodeList.pop(node);
}

function clearArc(context, x, y, radius) {
  context.save();
  context.globalCompositeOperation = 'destination-out';
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fill();
  context.restore();
}

function drawCircle(x,y,color){
  ctx.fillStyle =color;
  ctx.beginPath();
  ctx.arc(x,y,rad,0,Math.PI*2);
  ctx.stroke();
  ctx.fill();
}

function selectCircle(node){
  if(selectedNode1 == undefined ){
    selectedNode1 = node;
    clearArc(ctx, node.x, node.y, rad);
    drawCircle(node.x, node.y, "red");
    node.isSelect = true
  }else if(selectedNode2 == undefined){
    selectedNode2 = node;
    clearArc(ctx, node.x, node.y, rad);
    drawCircle(node.x, node.y, "red");
    node.isSelect = true
  }
}

function unselectCircle(node){
  if(node == selectedNode1){
    selectedNode1 = null;
    clearArc(ctx, node.x, node.y, rad + 1.25);
    drawCircle(node.x, node.y, "green");
    node.isSelect = false;
  } else if(node == selectedNode2){
    selectedNode2 = null;
    clearArc(ctx, node.x, node.y, rad + 1.25);
    drawCircle(node.x, node.y, "green");
    node.isSelect = false;
  }
}

canvas.addEventListener('mousedown', (e) => {
  const mousePos = {
    x: e.pageX - elemLeft,
    y: e.pageY - elemTop
  };
  var intersect = false;
  if(graph.nodeList.length == 0){
    addNode(e);
    console.log("TEST");
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
      addNode(e);
    }
  }
});

//canvas.addEventListener('mousedown', addNode);
