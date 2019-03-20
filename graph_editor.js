var canvas = document.getElementById("graph_editor_canvas");
var ctx = canvas.getContext('2d');
var elemLeft = canvas.offsetLeft,
    elemTop = canvas.offsetTop;

var nodeList = [];

//var graph = new Graph("graph1");

function isIntersect(point, circle) {
  return Math.sqrt((point.x-circle.posX) ** 2 + (point.y - circle.posY) * 2) < 18;
}

function addVertice(e) {
  var x = e.pageX - elemLeft;
  var y = e.pageY - elemTop;

  var node = {posX: x, posY: y};

  nodeList.push(node);

  ctx.fillStyle ="green"
  ctx.beginPath();
  ctx.arc(x,y,18,0,Math.PI*2);
  ctx.stroke();
  ctx.fill();
}

canvas.addEventListener('mousedown', addVertice);

canvas.addEventListener('mousedown', (e) => {
  const mousePos = {
    x: e.clientX - elemLeft,
    y: e.clientY - elemTop
  };
  nodeList.forEach(node => {
    if(isIntersect(mousePos, node)){
      alert("CLICK !!!");
    }
  });
});
