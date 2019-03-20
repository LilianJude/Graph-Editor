var canvas = document.getElementById("graph_editor_canvas");
var ctx = canvas.getContext('2d');
var elemLeft = canvas.offsetLeft,
    elemTop = canvas.offsetTop;

var id = 0;
var rad = 20;
var nodeList = [];

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

function clearCircle(x,y) {
  ctx.beginPath();
  ctx.clearRect(x - rad - 1, y - rad - 1, rad * 2 + 2, rad * 2 + 2);
  ctx.closePath();
}

function drawCircle(x,y,color){
  ctx.fillStyle =color;
  ctx.beginPath();
  ctx.arc(x,y,rad,0,Math.PI*2);
  ctx.stroke();
  ctx.fill();
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
          clearCircle(node.x,node.y);
          drawCircle(node.x, node.y, "red");
        }
      }
    });
  }
  if(intersect==false){
    addNode(e);
  }
});

//canvas.addEventListener('mousedown', addNode);
