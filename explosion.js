
/*
--------------------------------------------------
|                                                |
|		Code Written By : Rahul Gupta.           |
|  *** Explsoion Animation using JavaScript***   |
|                                                |
--------------------------------------------------
*/

const canvas=document.getElementById('canvas');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
const ctx=canvas.getContext('2d');
window.addEventListener('resize',() => {
	canvas.width=window.innerWidth;
	canvas.height=window.innerHeight;
	startExplosion();
});
var particles=[],nParticles=1000;
var gravity=0.05;
var colors=[
	'skyblue',
	'white',
	'#7affff',
	'#3589ff',
	'#56cfff',
	'#7c9bff',
	'lightyellow',
	'white',
	'#7cd3ff',
	'#b5fffc',
	'#e8fcff'
]
var main_explosion=() => {
	refreshFrame();
	startExplosion();
	setInterval(startExplosion,8000);
}
var startExplosion=() => {
	var i;
	clearParticles();
	for(i=0;i<this.nParticles;i++)
		add();
}
var clearParticles=() => {
	this.particles.splice(0,nParticles-1);
}
var refreshFrame=() => {
	var mainFrame=window.requestAnimationFrame(refreshFrame);
	ctx.fillStyle='rgba(0,0,0,0.15)';
	ctx.fillRect(0,0,canvas.width,canvas.height);
	update();
}
var init=(particle) => {
	particle.x=canvas.width/2;
	particle.y=canvas.height/2;
	particle.vx=-14+Math.random()*28;
	particle.vy=-13+Math.random()*20;
	particle.radius=Math.random()*6;
	particle.color=this.colors[Math.floor(Math.random()*this.colors.length)];
}
var update=() => {
	var i,particle;
	for(i=0;i<this.particles.length;i++)
	{
		particle=this.particles[i];
		const lastPoint={
			x:particle.x,
			y:particle.y
		}
		particle.vy+=this.gravity;
		particle.x+=particle.vx;
		particle.y+=particle.vy;
		draw(particle,lastPoint);
	}
}
var draw=(particle,lastPoint) => {
	ctx.beginPath();
	ctx.moveTo(lastPoint.x,lastPoint.y);
	ctx.lineTo(particle.x,particle.y);
	ctx.strokeStyle=particle.color;
	ctx.lineWidth=particle.radius;
	ctx.stroke();
	ctx.closePath();
	
}
var add=() => {
	var i,particle={};
	init(particle);
	this.particles.push(particle);
}