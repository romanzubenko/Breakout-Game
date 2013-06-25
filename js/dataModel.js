
(function (window) {
	'use strict'

	function Block(x,y,width,height,destroy,balls) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.destroyable = destroy || false;
		this.color = "rgb(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ","+ parseInt(Math.random() * 255) + ")";
		this.render(balls);
	}
	
	Block.prototype.render = function(balls) {
		balls.ctx.fillStyle = this.color;
		balls.ctx.strokeStyle = this.color;
		balls.ctx.fillRect(this.x,this.y,this.width,this.height);
	}

	Block.prototype.collide = function(ball) {
		var collide = false;
		if (this.x <= ball.position[0] && (this.x + this.width) >= ball.position[0]  &&  (this.y + this.height) >= ball.position[1] && this.y <= ball.position[1]) {
			ball.speed[1] = ball.speed[1] * -1;
			collide = true;
		}

		return collide;
	}

	function Ball(x,y,balls) {
		this.position = [x,y];	
		this.speed = [-2,-8];

		this.render(balls);
	}

	Ball.prototype.render = function(balls) {
		this.position[0] += this.speed[0];
		this.position[1] += this.speed[1];

		if (this.position[0] <= 0  || this.position[0] >= balls.width) {
			this.speed[0] *= -1;
		}

		if (this.position[1] > balls.height) {
			balls.left  -= 1;
			if (balls.left > 0) {
				console.log("-ball")
				$("#ballsleft").html("balls left : " + balls.left);
				this.position[0] = balls.paddle.x;
				this.position[1] = balls.paddle.y - 20;
				this.speed = [-2,-8];
			} else {
				$("#ballsleft").html("Game Over");
			}
		}

		balls.ctx.fillStyle = "rgb(180,0,0)";
		balls.ctx.strokeStyle = "rgb(180,0,0)";
		balls.ctx.beginPath();
		balls.ctx.arc(this.position[0], this.position[1], 10, 0, 2 * Math.PI, false);
		balls.ctx.fill();
		//balls.ctx.fillRect(this.position[0],this.position[1],10,10);
	}

	function Paddle(balls) {
		this.x = parseInt(balls.width / 2);
		this.y = parseInt(balls.height - 10);
		this.width = 100;
		this.height = 10;
		this.render(balls);
	}

	Paddle.prototype.render = function(balls) {
		balls.ctx.fillStyle = "rgb(180,0,0)";
		balls.ctx.strokeStyle = "rgb(180,0,0)";
		balls.ctx.fillRect(this.x,this.y,100,10);
	}

	Paddle.prototype.collide = function(ball) {
		if(this.x <= ball.position[0] && (this.x + this.width) >= ball.position[0] &&  (this.y + this.height) >= ball.position[1] && this.y <= ball.position[1]) {
			console.log("collide paddle")
			ball.speed[1] = ball.speed[1] * -1;
		
			if (ball.speed[0] > 0 && (this.x + this.width/ 4) > ball.position[0]) {
				ball.speed[0] *= -1;
			} else if (ball.speed[0] < 0 && (this.x + this.width- this.width/4) < ball.position[0]) {
				ball.speed[0] *= -1;
			}

		} 



	}


	function Balls(width, height,left) {
		var balls = this;
		this.left = left
		console.log("Balls constructor");
		this.width = width || 1000;
		this.height = height || 500; 
		$("#ballsleft").html("balls left : " + this.left);
		// Visual
		this.canvas = $("<canvas/>").appendTo("body")[0];
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.ctx = this.canvas.getContext('2d'); // canvas context
		
		this.paddle = new Paddle(balls);
		this.ball = new Ball(parseInt(width/2),height-20,balls);
		var bl_width = parseInt(width / 5),
		bl_height = 30;

		this.blocks = [];

		for (var i = 9 * 30; i >= 0; i -=30) {
			for (var j = 5 * bl_width; j >= 0; j -= bl_width) {
				this.blocks.push(new Block(j,i,bl_width,bl_height,true,balls))
			};
		};

		$(document).keydown(function(e) {
			if(e.keyCode == 39) {
				balls.paddle.x += 30;
			}

			if(e.keyCode == 37) {
				balls.paddle.x -=30;
			}

		});

		var app = this;	
		window.setInterval(function() {
			app.ball.speed[1] *= 1.1; 
		},4000);

		window.setInterval(function() {
			app.render();
		},1000/30);
	}


	Balls.prototype.render = function() {
		this.canvas.width = this.width;
		this.ball.render(this);
		for (var i = this.blocks.length - 1; i >= 0; i--) {
			this.blocks[i].render(this);
			if (this.blocks[i].collide(this.ball)) {
				this.blocks.splice(i,1);
			};
		};

		this.paddle.render(this);
		this.paddle.collide(this.ball)
	}


	window.Balls = Balls;
	window.Block = Block;
	window.Ball = Ball;
	window.Paddle = Paddle;

	
})(window);

	