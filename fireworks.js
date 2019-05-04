/////////////////////////////////////////////////////
//                                                 //
//         CANVAS DESIGNER : RAHUL GUPTA           //
//                                                 //
/////////////////////////////////////////////////////

const fireworks=document.getElementById('fireworks');
fireworks.width=window.innerWidth;
fireworks.height=window.innerHeight;
const ctx1=fireworks.getContext('2d');
window.addEventListener('resize', () => {
  fireworks.width=window.innerWidth;
  fireworks.height=window.innerHeight;
  setup_particles();
  scatter_star();
  stars_add();
});
let particlesArray=[];
let x=[],y=[];
let fireworksColor=[
	'#e954f9',
	'#ffc80a',
	'#fce2c2',
	'white',
	'lightblue',
	'#bb93ff',
	'#7393cb',
	'#7393cb'
];
let starsColor=[
	'#8c9cff',
	'#ffdc79',
	'#e6c2ff',
	'#ff9cfa',
	'white'
]
let arraySize=5;
let nParticle=130;
let gravity=0.04;
let stars=[];
let nStars=20; 
let fireworksFrame;
let fireworks_init=(eachParticle,x,y) => {
	eachParticle.x=x;
	eachParticle.y=y;
	eachParticle.vx=-6+Math.random()*12;
	eachParticle.vy=-6+Math.random()*12;
	eachParticle.size=Math.random()*5;
	eachParticle.color=fireworksColor[Math.floor(Math.random()*fireworksColor.length)];
}
let fireworks_update=() => {
	let i,eachParticle;
	let particles=[];
	for(i=0;i<arraySize;i++)
	{
		particles=[...particlesArray[i]];
		for(j=0;j<particles.length;j++)
		{
			eachParticle=particles[j];
			lastPoint={
				x:eachParticle.x,
				y:eachParticle.y
			}
			eachParticle.vy+=gravity;
			eachParticle.x+=eachParticle.vx;
			eachParticle.y+=eachParticle.vy;
			fireworks_draw(lastPoint,eachParticle);
		}
	}	
}
let fireworks_draw=(lastPoint,eachParticle) => {
	ctx1.beginPath();
	ctx1.moveTo(lastPoint.x,lastPoint.y);
	ctx1.lineTo(eachParticle.x,eachParticle.y);
	ctx1.lineWidth=eachParticle.size;
	ctx1.strokeStyle=eachParticle.color;
	ctx1.stroke();
	ctx1.closePath();
}
let fireworks_add=(particles,x,y) => {
	let eachParticle={};
	if(particles.length<nParticle)
	{
		fireworks_init(eachParticle,x,y);
		particles.push(eachParticle);
	}
}
let setup_particles=() => {
	clear_particles();
	let particles=[],i;
	for(i=0;i<arraySize;i++)
		particlesArray.push(particles);
	i=0;
	recursive_add(particles,i);
}
let recursive_add=(particles,i) => {
	setTimeout(() => {
		particles=[...particlesArray[i]];
		x[i]=fireworks.width/6+Math.random()*(fireworks.width-fireworks.width/3);
		y[i]=fireworks.height/4+Math.random()*(fireworks.height-fireworks.height/2);
		for(let j=0;j<nParticle;j++)
			fireworks_add(particles,x[i],y[i]);		
		particlesArray[i]=[...particles];
		i++;
		if(i<arraySize)
			recursive_add(particles,i);
	},i*400);
}
let clear_particles=() => {
	particlesArray.splice(0,arraySize-1);
}
setInterval(setup_particles,5000);
let stars_init=(star) => {
	star.x=Math.random()*fireworks.width;
	star.y=Math.random()*fireworks.height;
	star.size=1+Math.random()*2;
	star.color=starsColor[Math.floor(Math.random()*starsColor.length)];
}
let stars_update=() => {
	let i,star;
	for(i=0;i<stars.length;i++)
	{
		star=stars[i];
		stars_draw(star);
	}
}
let stars_draw=(star) => {
	ctx1.save();
	ctx1.beginPath();
	ctx1.fillStyle=star.color;
	ctx1.arc(star.x,star.y,star.size,0,2*Math.PI,false);
	ctx1.shadowBlur=15;
	ctx1.shadowColor='white';
	ctx1.fill();
	ctx1.closePath();
	ctx1.restore();
}
let stars_add=() => {
	let star={};
	if(stars.length<nStars)
	{
		stars_init(star);
		stars.push(star);
	}
}
let scatter_star=() => {
	let i;
	clear_stars();
	for(i=0;i<nStars;i++)
		stars_add();
}
let clear_stars=() => {
	stars.splice(0,nStars-1);
}
let fireworks_frame_refresh=() => {
	fireworksFrame=window.requestAnimationFrame(fireworks_frame_refresh);
	ctx1.fillStyle="rgba(0,0,15,0.18)";
	ctx1.fillRect(0,0,fireworks.width,fireworks.height);
	stars_update();
	fireworks_update();
}

//------------------- Call this function wherever you want to use this canvas piece ----------------------

let start_fireworks_effect=() => { 
	scatter_star();
	setup_particles();
	fireworks_frame_refresh();
}
window.addEventListener('load', () => {
  start_fireworks_effect();
})
