/*
* Paricle.js 
* @author thenocturnalguy
* @date 13-12-2020
* @license MIT
*/

(function(window) {
	'use strict';
	
	// Wrapper function for our library that will contain all our methods
	/*
	* @return {prepare, start, stop} methods to control the particle animation 
	*/
	function _self() {
		// Private variables
		let _ctx, 									// stores the context of the animation
			_frame,									// stores the frame at each frame refresh
			_particles = [],						// stores all the particles on the screen
			_maxRadius,								// stores the maximum radius of expansion
			_minRadius,								// stores the minimum radius of contraction
			_mouse = {};							// stores he coordinates of the mouse pointer

		// Public variables
		let area,									// stores the canvas element
			colors = [],							// stores the color array for the particles
			numParticles,        					// stores the number of particles to be drawn
			shouldCaptureMouse;						// stores whether to animate for mouse-movements

		// Private methods

		// Method to initialize each particle object
		function _init(particle) {
			particle.x = Math.random() * (area.width);
			particle.y = Math.random() * (area.height);
			particle.vx = (Math.random() - 0.5) * 1;
			particle.vy = (Math.random() - 0.5) * 1;
			particle.radius = Math.random() * 4 + 2;
			particle.color = colors[Math.floor(Math.random() * colors.length)];
		}

		// Method to update each individual particle object
		function _update() {
			_particles.forEach(particle => {
				if (particle.x > (area.width - particle.radius) ||
					particle.x < particle.radius) {
					particle.vx = -particle.vx;
				}

				if (particle.y > (area.height - particle.radius) ||
					particle.y < particle.radius) {
					particle.vy = -particle.vy;
				}

				particle.x += particle.vx;
				particle.y += particle.vy;

				if (_mouse.x - particle.x < _maxRadius && 
					_mouse.x - particle.x > -_maxRadius && 
					_mouse.y - particle.y < _maxRadius && 
					_mouse.y - particle.y > -_maxRadius) {
					if (particle.radius < _maxRadius) particle.radius += 8;
				}
				else if (particle.radius > _minRadius) {
					particle.radius -= 1;
				}

				_draw(particle);
			});	
		}

		// Method to draw each particle object on the canvas
		function _draw(particle) {
			_ctx.beginPath();
			_ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
			_ctx.fillStyle = particle.color;
			_ctx.fill();
			_ctx.closePath();
		}

		// Method to add each particle object into the _particles array
		function _add() {
			let particle = {};
			if (_particles.length < numParticles) {
				_init(particle);
				_particles.push(particle);	
			}
		}

		// Method to flush all the particle object from the _particles array
		function _flush() {
			_particles.splice(0, numParticles);
		}

		// Method to add all the created particle object in the _particles array
		function _push() {
			_flush();
			if (area.width < numParticles) {
				_maxRadius = 20;
			} else if (area.width > numParticles) {
				_maxRadius = 50;
			}
		 	for (let i = 0; i < numParticles; ++i) {
		 		_add();
		 	}
		}

		// Method to refresh the canvas frame
		function _refresh() {
			_frame = window.requestAnimationFrame(_refresh);
			_ctx.clearRect(0, 0, area.width, area.height);
			_update();
		}

		// Public methods

		// Method to initialise the required variables
		/*
		* @param (ele) 		 canvas element to visualise the animation
		* @param (width) 	 width of the canvas
		* @param (height) 	 height of the canvas
		* @param (colorsArr)  colors to be used for each particle 
		* @param (nPart) 	 number of particles to be formed on the canvas
		* @param (mouseFlag)  whether to capture mouse-movements for interactive animation
		*/
		function prepare(ele, width, height, colorsArr, nPart = 80, mouseFlag = true) {
			area = ele;
			area.width = width;
			area.height = height;
			colors = colorsArr;
			numParticles = nPart;
			shouldCaptureMouse = mouseFlag;
			_ctx = area.getContext('2d');

			if (shouldCaptureMouse) {
				area.addEventListener('mousemove', function(event) {
					_mouse.x = event.x;
					_mouse.y = event.y;
				});
			}
			_minRadius = Math.random() * 4 + 2;
		}

		// Method to start the particle animation on the canvas
		function start() {
			_push();
			_refresh();
		}

		// Method to stop the particle animation on the canvas
		function stop() {
			window.cancelAnimationFrame(_frame);
			_ctx.clearRect(0, 0, area.width, area.height);
			_flush();
		}

		return {
			prepare: prepare,
			start: start,
			stop: stop
		}
	}

	// Make the library global
	if (typeof(Particles) === 'undefined') {
		window.Particles = _self();
	}
})(window);