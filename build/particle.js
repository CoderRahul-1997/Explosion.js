/*
* Paricle.js 
* @author thenocturnalguy
* @date 13-12-2020
* @updated 16-12-2020
* @license MIT
*/

(function(window) {
	'use strict';

	// Particles module to display the particle floating animation on the canvas
	/*
	* @param (ele) 		 			canvas element to visualise the animation
	* @param (width) 	 			width of the canvas
	* @param (height) 	 			height of the canvas
	* @param (colors) 				colors to be used for each particle 
	* @param (numParticles) 	 	number of particles to be formed on the canvas
	* @param (shouldCaptureMouse) 	whether to capture mouse-movements for interactive animation
	*/
	function Particles(ele, width, height, colors, numParticles = 80, shouldCaptureMouse = true) {

		// Below written variables should be treated as public variables
		this.area = document.createElement('canvas');   // stores the canvas element
		this.area.setAttribute('class', '_particlesCanvas_');
		this.area.width = width;
		this.area.height = height;
		this.colors = colors;                           // stores the color array for the particles
		this.numParticles = numParticles;				// stores the number of particles to be drawn
		this.shouldCaptureMouse = shouldCaptureMouse;	// stores whether to animate for mouse-movements

		// Below written variables should be treated as private variables
		this._ctx = this.area.getContext('2d');			// stores the context of the animation
		this._particles = [];							// stores all the particles on the screen
		this._maxRadius;								// stores the maximum radius of expansion
		this._minRadius = Math.random() * 4 + 2;		// stores the minimum radius of contraction
		this._mouse = {};								// stores he coordinates of the mouse pointer
		this._frame;									// stores the frame at each frame refresh

		ele.appendChild(this.area);

		// Capturing the mouse events for interactive animation
		if (this.shouldCaptureMouse) {
			(function(self, ele) {
				ele.addEventListener('mousemove', function(event) {
					self._mouse.x = event.x;
					self._mouse.y = event.y;
				});
			})(this, this.area);
		}
	}

	// Adding functionalities to the module prototype
	Particles.prototype = {

		/* Utility functions starts here */
		// Method to initialize each particle object
		_init: function(particle) {
			particle.x = Math.random() * (this.area.width);
			particle.y = Math.random() * (this.area.height);
			particle.vx = (Math.random() - 0.5) * 1;
			particle.vy = (Math.random() - 0.5) * 1;
			particle.radius = Math.random() * 4 + 2;
			particle.color = this.colors[Math.floor(Math.random() * this.colors.length)];
		},

		// Method to update each individual particle object
		_update: function() {
			this._particles.forEach(particle => {
				// Checking the corner case for horizantal overflow
				if (particle.x > (this.area.width - particle.radius) ||
					particle.x < particle.radius) {
					particle.vx = -particle.vx;
				}

				// Checking the corner case for vertical overflow
				if (particle.y > (this.area.height - particle.radius) ||
					particle.y < particle.radius) {
					particle.vy = -particle.vy;
				}

				// Updating the position of an individual particle object
				particle.x += particle.vx;
				particle.y += particle.vy;

				// Expanding and contracting a particle on mouse hover
				if (this.shouldCaptureMouse) {
					if (this._mouse.x - particle.x < this._maxRadius && 
						this._mouse.x - particle.x > -this._maxRadius && 
						this._mouse.y - particle.y < this._maxRadius && 
						this._mouse.y - particle.y > -this._maxRadius) {
						if (particle.radius < this._maxRadius) {
							particle.radius += 8;
						}
					}
					else if (particle.radius > this._minRadius) {
						particle.radius -= 1;
					}
				}
				// Finally, drawing the updated particle on the canvas
				this._draw(particle);
			});	
		},

		// Method to draw each particle object on the canvas
		_draw: function(particle) {
			this._ctx.beginPath();
			this._ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
			this._ctx.fillStyle = particle.color;
			this._ctx.fill();
			this._ctx.closePath();
		},

		// Method to add each particle object into the _particles array
		_add: function() {
			let particle = {};
			if (this._particles.length < this.numParticles) {
				this._init(particle);
				this._particles.push(particle);	
			}
		},

		// Method to flush all the particle object from the _particles array
		_flush: function() {
			this._particles.splice(0, this.numParticles);
		},

		// Method to add all the created particle object in the _particles array
		_push: function() {
			this._flush();
			if (this.area.width < this.numParticles) {
				this._maxRadius = 20;
			} else if (this.area.width > this.numParticles) {
				this._maxRadius = 50;
			}
		 	for (let i = 0; i < this.numParticles; ++i) {
		 		this._add();
		 	}
		},

		// Method to refresh the canvas frame
		_refresh: function() {
			this._frame = window.requestAnimationFrame(this._refresh.bind(this));
			this._ctx.clearRect(0, 0, this.area.width, this.area.height);
			this._update();
		},
		/* Utility functions ends here */

		/* Control functions starts here */
		// Method to start the particle animation on the canvas
		start: function() {
			this._push();
			this._refresh();
		},

		// Method to stop the particle animation on the canvas
		stop: function() {
			window.cancelAnimationFrame(this._frame);
			this._ctx.clearRect(0, 0, this.area.width, this.area.height);
			this._flush();
		}
		/* Control functions ends here */
	}

	// Our library wrapper to provide abstration and encapsulation to our Particles module
	/*
	* @return {start, stop} 		methods to control the particle animation 
	* @param (ele) 		 			canvas element to visualise the animation
	* @param (width) 	 			width of the canvas
	* @param (height) 	 			height of the canvas
	* @param (colors) 				colors to be used for each particle 
	* @param (numParticles) 	 	number of particles to be formed on the canvas
	* @param (shouldCaptureMouse) 	whether to capture mouse-movements for interactive animation
	*/ 
	function _wrapper_(ele, width, height, colors, numParticles = 80, shouldCaptureMouse = true) {
		// Creating the instance of the Particles module
		let particles = new Particles(ele, width, height, colors, numParticles, shouldCaptureMouse);

		return {
			start: particles.start.bind(particles),
			stop: particles.stop.bind(particles)
		}
	}

	// Create an alias of your library in the global scope
	window.Particles = _wrapper_;

})(window);
