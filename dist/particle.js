/*
* Paricle.js 
* @author thenocturnalguy
* @date 13-12-2020
* @license MIT
*/

!function(t){"use strict";"undefined"==typeof Particles&&(t.Particles=function(){let i,n,a,e,o,r,h,d=[],u={},c=[];function s(){d.forEach(t=>{(t.x>o.width-t.radius||t.x<t.radius)&&(t.vx=-t.vx),(t.y>o.height-t.radius||t.y<t.radius)&&(t.vy=-t.vy),t.x+=t.vx,t.y+=t.vy,u.x-t.x<a&&u.x-t.x>-a&&u.y-t.y<a&&u.y-t.y>-a?t.radius<a&&(t.radius+=8):t.radius>e&&(t.radius-=1),function(t){i.beginPath(),i.arc(t.x,t.y,t.radius,0,2*Math.PI,!1),i.fillStyle=t.color,i.fill(),i.closePath()}(t)})}function f(){let t={};d.length<r&&(function(t){t.x=Math.random()*o.width,t.y=Math.random()*o.height,t.vx=1*(Math.random()-.5),t.vy=1*(Math.random()-.5),t.radius=4*Math.random()+2,t.color=c[Math.floor(Math.random()*c.length)]}(t),d.push(t))}function l(){d.splice(0,r)}function y(){n=t.requestAnimationFrame(y),i.clearRect(0,0,o.width,o.height),s()}return{prepare:function(t,n,a,d,s=80,f=!0){(o=t).width=n,o.height=a,c=d,r=s,h=f,i=o.getContext("2d"),h&&o.addEventListener("mousemove",function(t){u.x=t.x,u.y=t.y}),e=4*Math.random()+2},start:function(){!function(){l(),o.width<r?a=20:o.width>r&&(a=50);for(let t=0;t<r;++t)f()}(),y()},stop:function(){t.cancelAnimationFrame(n),i.clearRect(0,0,o.width,o.height),l()}}}())}(window);