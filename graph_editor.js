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

  ctx.fillStyle ="green"
  ctx.beginPath();
  ctx.arc(x,y,rad,0,Math.PI*2);
  ctx.stroke();
  ctx.fill();
}

function clearCircle(ctx,x,y,radius) {
  ctx.beginPath();
  ctx.clearRect(x - radius - 1, y - radius - 1, radius * 2 + 2, radius * 2 + 2);
  ctx.closePath();
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
          clearCircle(ctx, node.x, node.y, rad);
          ctx.fillStyle ="red"
          ctx.beginPath();
          ctx.arc(node.x,node.y,rad,0,Math.PI*2);
          ctx.stroke();
          ctx.fill();
        }
      }
    });
  }
  if(intersect==false){
    addNode(e);
  }
});

//canvas.addEventListener('mousedown', addNode);
