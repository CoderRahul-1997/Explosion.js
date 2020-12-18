/*
* Paricle.js 
* @author thenocturnalguy
* @date 13-12-2020
* @updated 18-12-2020
* @license MIT
*/

(function(window) {
	const MAX_RADIUS = 50;  // Stores the maximum radius of an individual particle
	const MIN_RADIUS = 3;	// Stores the minimum radius of an individual particle

	// Particle object to simulate each particle on the screen
	/*
	* @param (x) 				x-coordinate of the particle
	* @param (y) 				y-coordinate of the particle
	* @param (vx) 				velocity along x-axis of the particle
	* @param (vy) 				velocity along y-axis of the particle
	* @param (radius) 			radius of the particle
	* @param (color) 			color of the particle
	* @param (isInteractive) 	whether to capture mouse-movements for interactive animation
	*/
	function Particle(x, y, vx, vy, radius, color, isInteractive) {
		this.x = x;								// Stores the x-coordinate of the particle
		this.y = y;								// Stores the y-coordinate of the particle
		this.vx = vx;							// Stores the velocity along x-axis for the particle
		this.vy = vy;							// Stores the velocity along y-axis for the particle
		this.radius = radius;					// Stores the radius of the particle
		this.color = color;						// Stores the color of the particle
		this.isInteractive = isInteractive;		// Stores the flag for interactive animation
	}

	Particle.prototype = {

		// Function to update a particle motion on the canvas
		update: function(elem, mouse) {
			// Checking the corner case for horizantal overflow
			if (this.x > (elem.width - this.radius) ||
				this.x < this.radius) {
				this.vx = -this.vx;
			}

			// Checking the corner case for vertical overflow
			if (this.y > (elem.height - this.radius) ||
				this.y < this.radius) {
				this.vy = -this.vy;
			}

			// Updating the position of an individual this object
			this.x += this.vx;
			this.y += this.vy;

			// Expanding and contracting a this on mouse hover
			if (this.isInteractive) {
				if (mouse.x - this.x < MAX_RADIUS && 
					mouse.x - this.x > -MAX_RADIUS && 
					mouse.y - this.y < MAX_RADIUS && 
					mouse.y - this.y > -MAX_RADIUS) {
					if (this.radius < MAX_RADIUS) {
						this.radius += 8;
					}
				}
				else if (this.radius > MIN_RADIUS) {
					this.radius -= 1;
				}
			}
		},

		// Function to draw a particle on the canvas
		draw: function(ctx) {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.closePath();
		}
	}

	// Animate object to perform our desired animation using the particles
	/*
	* @param (elem) 		 	canvas element to visualise the animation
	* @param (ctx) 	 			context of the canvas animation
	* @param (colors) 			colors to be used for each particle 
	* @param (numParticles) 	number of particles to be formed on the canvas
	* @param (isInteractive) 	whether to capture mouse-movements for interactive animation
	*/ 
	function Animate(elem, ctx, colors, numParticles, isInteractive) {

		// Below written variables should be considered as public
		this.elem = elem;						// Stores the canvas html element
		this.ctx = ctx;							// Stores the context variable of the canvas
		this.colors = colors;					// Stores the colors array
		this.numParticles = numParticles;		// Stores the number of particles to be rendered
		this.isInteractive = isInteractive;		// Stores the flag for interactive animation
		
		// Below written variables should be considered as private
		this._particles = [];					// Stores the particle objects to be rendered 
		this._mouse = {};						// Stores the mouse coordinates
		this._frame;							// Stores the frame for animation
	}

	Animate.prototype = {

		/* Utility functions starts here */
		// Helper function to clear the _particles array
		_flush: function() {
			this._particles.splice(0, this.numParticles);
		},

		// Function to prepare the canvas and scatter the particles in the canvas
		_prepare: function() {
			let i, radius;
			this._flush();
			for (i = 0; i < this.numParticles; ++i) {
				radius = Math.random() * 4 + 2;
				this._particles.push(
					new Particle(
						Math.random() * (this.elem.width - 2 * radius) + radius,
						Math.random() * (this.elem.height - 2 * radius) + radius,
						(Math.random() - 0.5) * 1,
						(Math.random() - 0.5) * 1,
						radius,
						this.colors[Math.floor(Math.random() * this.colors.length)],
						this.isInteractive
					)
				);
			}

			// Capturing mouse events for interactive animation
			if (this.isInteractive) {
				(function(self, elem) {
					elem.addEventListener('mousemove', function(event) {
						self._mouse.x = event.clientX;
						self._mouse.y = event.clientY; 
					})
				})(this, this.elem);
			}
		},

		// Function to render the animation on the canvas
		_render: function() {
			this._frame = window.requestAnimationFrame(this._render.bind(this));
			this.ctx.clearRect(0, 0, this.elem.width, this.elem.height);
			this._particles.forEach(particle => {
				particle.update(this.elem, this._mouse);
				particle.draw(this.ctx);
			}); 
		},
		/* Utility functions ends here */

		/* Control functions starts here */
		// Function to start the particle animation
		start: function() {
			this._prepare();
			this._render();
		},

		// Function to stop the particle animation
		stop: function() {
			window.cancelAnimationFrame(this._frame);
			this.ctx.clearRect(0, 0, this.elem.width, this.elem.height);
			this._flush();
		}
		/* Control functions ends here */
	}

	// Our library wrapper to provide abstration and encapsulation to our Particles module
	/*
	* @return {start, stop} 		methods to control the particle animation 
	* @param (parent) 		 		canvas element to visualise the animation
	* @param (dim) 	 				dimension of the canvas
	* @param (colors) 				colors to be used for each particle 
	* @param (numParticles) 	 	number of particles to be formed on the canvas
	* @param (isInteractive) 		whether to capture mouse-movements for interactive animation
	*/ 
	function __lib__(parent, dim, colors, numParticles = 80, isInteractive = true) {

		// Below written variables should be treated as public 
		let elem = document.createElement('canvas');
		elem.width = dim.width;
		elem.height = dim.height;
		parent.appendChild(elem);

		// Below written variables should be treated as private
		let _ctx = elem.getContext('2d');
		let _anim = new Animate(elem, _ctx, colors, numParticles, isInteractive);

		return {
			start: _anim.start.bind(_anim),
			stop: _anim.stop.bind(_anim)
		}
	}

	// Creating an alias of the __lib__ in the global scope 
	window.Particles = __lib__;

})(window);