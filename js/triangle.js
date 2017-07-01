var cvs;
var ctx;
var angle = Math.PI/4;
var isMouse = false;

function init() {
    cvs = document.getElementById('triangle');
    ctx = cvs.getContext('2d');

    cvs.addEventListener('mousedown',doMouseDown,false);

    resize();
}

function resize() {
    var width = window.innerWidth
	|| document.documentElement.clientWidth
	|| document.body.clientWidth;

    var height = window.innerHeight
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;

    var w = Math.max(Math.floor(width/2),200);
    var h = Math.max(Math.floor(height/2),150);
    var bw = Math.floor((width - w)/2);
    var bh = Math.floor((height - h)/2);

    var expl = document.getElementById('expl');
    expl.style.marginLeft = bw + 'px';
    expl.style.width = w + 'px';
    var eh = window.getComputedStyle(expl).getPropertyValue("height");

    bh -= eh;
    bh = Math.max(10,bh);
    
    cvs.style.marginLeft = bw + 'px';
    cvs.style.marginTop = bh + 'px';
    cvs.style.width = w + 'px';
    cvs.style.height = h + 'px';
    cvs.width = w;
    cvs.height = h;

    drawTriangle();
}

window.addEventListener('load',init,false);
window.addEventListener('resize',resize,false);

function doMouseDown(e) {
    var p = calculateAngle(e);
    drawTriangle();

    ctx.fillStyle = '#0ff';
    ctx.beginPath();
    ctx.arc(p[0],p[1],5,0,Math.PI * 2, true);
    ctx.fill();

    cvs.addEventListener('mousemove',doMouseMove,false);
    cvs.addEventListener('mouseup',doMouseUp,false);
    cvs.addEventListener('mousecancel',doMouseUp,false);
}

function doMouseMove(e) {
    var p = calculateAngle(e);
    drawTriangle();

    ctx.fillStyle = '#0ff';
    ctx.beginPath();
    ctx.arc(p[0],p[1],5,0,Math.PI * 2, true);
    ctx.fill();
}

function doMouseUp(e) {
    calculateAngle(e);
    drawTriangle();

    cvs.removeEventListener('mousemove',doMouseMove);
    cvs.removeEventListener('mouseup',doMouseUp);
    cvs.removeEventListener('mousecancel',doMouseUp);
}

function calculateAngle(e) {
    var mx = e.pageX;
    var my = e.pageY;
    var x = Math.floor(mx - cvs.offsetLeft);
    var y = Math.floor(my - cvs.offsetTop);

    var sx = x;
    var sy = y;
    
    var w = cvs.width;
    var h = cvs.height;
    var bd = 20;
    var fs = 32;

    x -= bd;
    y -= h - bd - fs;
    y *= -1;

    angle = Math.atan2(y,x);

    if (e.shiftKey) {
	angle = Math.round(angle/Math.PI*180)/180*Math.PI;
    }

    angle = Math.min(Math.max(Math.PI/180,angle),Math.PI/2 - Math.PI/180);
    
    return [sx,sy];
}

function drawTriangle() {
    ctx.save();
    var w = cvs.width;
    var h = cvs.height;
    ctx.fillStyle = '#eee';
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.rect(0,0,w,h);
    ctx.fill();

    var bd = 20;
    var fs = 32;
    var iw = w - 2*bd;
    var ih = h - 2*bd - fs;

    var s = Math.sin(angle);
    var c = Math.cos(angle);
    var sf = Math.min(ih,iw);
    
    
    ctx.beginPath();
    ctx.moveTo(bd,h-bd-fs);
    ctx.lineTo(bd+sf*c,h-bd-fs);
    ctx.lineTo(bd+sf*c,h-bd-fs-sf*s);
    ctx.lineTo(bd,h-bd-fs);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(bd,h-bd-fs,sf/5,0,-angle,true);
    ctx.stroke();

    ctx.fillStyle = '#000';
    ctx.font = '32px serif';
    ctx.textAlign = 'end';
    ctx.fillText('1',bd+sf*c/2,h-bd-fs-sf*s/2);

    ctx.textAlign = 'start';
    var st = Math.round(s*100000)/100000;
    ctx.fillText(st,1.5*bd+sf*c,h-bd-fs-sf*s/2);

    var at = Math.round(angle*180/Math.PI*100)/100;
    var hs = Math.sin(angle/2);
    var hc = Math.cos(angle/2);
    
    ctx.fillText(at,bd+sf*hc/5,h-bd-fs-sf*hs/5);
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    var ct = Math.round(c*100000)/100000;
    var tw = ctx.measureText("0").width*7;
    if (bd + sf*c/2 - tw/2 < 0) {
	ctx.textAlign = 'start';
    }
    ctx.fillText(ct,bd+sf*c/2,h-bd-fs);
    ctx.restore();
}
