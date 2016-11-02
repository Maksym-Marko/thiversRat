window.onload = function(){

	var canvas = document.getElementById( 'canvas' ),
		c = canvas.getContext( '2d' ),
		canvasLeft = canvas.getBoundingClientRect().left,
		canvasTop = canvas.getBoundingClientRect().top,
		motionRect,
		keyRect = false,
		TWO_PI = Math.PI * 2,
		SightX = 0,
		SightY = 0,
		SightSize = 15,
		angleSight = 15;

	/*** Clear rect ***/
	function clearContext(){
		c.fillStyle = 'black';
		c.fillRect( 0, 0, canvas.width, canvas.height );
	}

/*******************************************************************************
************ The calculation of the angle of flight and power shots ************
********************************************************************************/

	/*** Change angle ***/

	function MechanismAngle( mX, mY, mRadius ){
		this.x = mX;
		this.y = mY;
		this.radius = mRadius;
	}

	MechanismAngle.prototype.createMechanismAngle = function( angleSight ){			
		c.beginPath();
		c.strokeStyle = '#fff';
		c.arc( this.x, this.y, this.radius, 0, TWO_PI, false );
		//c.stroke();
		c.closePath();

		/* Sight */
		angleSight = angleSight || 15;
		sX = this.x + this.radius * Math.cos( TWO_PI * ( angleSight - 20 ) / 100 ); // 1 - 15
		sY = this.y + this.radius * Math.sin( TWO_PI * ( angleSight - 20 ) / 100 ); // 1 - 15

		c.beginPath();
		c.fillStyle = '#fff';
		c.fillRect( sX, sY, SightSize, SightSize );
		c.fill();
		c.closePath();

		SightX = sX;
		SightY = sY;

	}

	/*** Flight rect ***/
	function MotionRect( x, y, angle, power ){
		this.x = x;
		this.y = y;
		this.power = power;
		this.angle = angle;
		this.speedX = 1;
		this.speedY = 5;

		if( this.angle == 1 ) this.speedX = 1;
		else if( this.angle == 2 ) this.speedX = 2;
		else if( this.angle == 3 ) this.speedX = 3;
		else if( this.angle == 4 ) this.speedX = 4;
		else if( this.angle == 5 ) this.speedX = 5;
		else if( this.angle == 6 ) this.speedX = 6;
		else if( this.angle == 7 ) this.speedX = 7;
		else if( this.angle == 8 ) this.speedX = 8;
		else if( this.angle == 9 ) this.speedX = 9;
		else if( this.angle == 10 ) this.speedX = 10;
		else if( this.angle == 11 ) this.speedX = 11;
		else if( this.angle == 12 ) this.speedX = 12;
		else if( this.angle == 13 ) this.speedX = 13;
		else if( this.angle == 14 ) this.speedX = 14;
		else if( this.angle == 15 ) this.speedX = 15;
		
		this.gravity = 0.2;
	}

	MotionRect.prototype.powerFlight = function(){
		this.x += this.speedX;
		this.y -= this.speedY;

		if( this.power == 0 ){
			if( this.x >= 10 ){
				this.speedY -= this.gravity;
			}
		} else if( this.power == 1 ){
			if( this.x >= 20 ){
				this.speedY -= this.gravity;
			}
		} else if( this.power == 2 ){
			if( this.x >= 40 ){
				this.speedY -= this.gravity;
			}
		} else if( this.power == 3 ){
			if( this.x >= 60 ){
				this.speedY -= this.gravity;
			}
		} else if( this.power == 4 ){
			if( this.x >= 80 ){
				this.speedY -= this.gravity;
			}
		} else if( this.power == 5 ){
			if( this.x >= 100 ){
				this.speedY -= this.gravity;
			}
		} else if( this.power == 6 ){
			if( this.x >= 120 ){
				this.speedY -= this.gravity;
			}
		} else if( this.power == 7 ){
			if( this.x >= 140 ){
				this.speedY -= this.gravity;
			}
		} else if( this.power == 8 ){
			if( this.x >= 160 ){
				this.speedY -= this.gravity;
			}
		} else if( this.power == 9 ){
			if( this.x >= 180 ){
				this.speedY -= this.gravity;
			}
		} else if( this.power == 10 ){
			if( this.x >= 200 ){
				this.speedY -= this.gravity;
			}
		}

		c.fillStyle = '#fff';
		c.fillRect( this.x, this.y, 5, 5 );
		c.fill();

		if( this.y > canvas.height ){
			console.log( 'Упал' );
			clearInterval( motionRect );
			keyRect = false;
		}
		
	}

	clearContext();

/*******************************************************************************
*********************************** SHOT ***************************************
********************************************************************************/

	var mechanismAngle = new MechanismAngle( 0, canvas.height, 100 );
		
	/*** Find sight ***/
	function PositionMouse( e ){
		return{
			mouseX: e.pageX - canvasLeft,
			mouseY: e.pageY - canvasTop
		} 
	}

	/*** Directed to target ***/
	function DirectedToTarget(){
		canvas.onmousedown = function(){
			var mousePosition = PositionMouse( event );

			if( mousePosition.mouseX < SightX ||
				mousePosition.mouseX > SightX + SightSize ||
				mousePosition.mouseY < SightY ||
				mousePosition.mouseY > SightY + SightSize
			){
				console.log( 0 );
			} else{
				canvas.style.cursor = 'pointer';		
				canvas.onmousemove = function(){		
					clearContext();
					mouseXin = event.pageY - canvasTop;
					if( mouseXin < SightY ){
						angleSight--;
						if( angleSight <= 2 ){
							angleSight = 2;
						}					
					} else if( mouseXin > SightY ){
						angleSight++;
						if( angleSight >= 15 ){
							angleSight = 15;
						}
					}				
					mechanismAngle.createMechanismAngle( angleSight );
				}
				canvas.onmouseleave = function(){
					canvas.style.cursor = 'default';
					canvas.onmousemove = function(){					
						return;
					}
				}		
			}			
		}

		mechanismAngle.createMechanismAngle();

		canvas.onmouseup = function(){
			canvas.style.cursor = 'default';
			canvas.onmousemove = function(){
				return;
			}
		}
	}
	

	/*** Shot ***/
	var throwButton = document.getElementById( 'mx-throw' ),
		powerLine = document.getElementById( 'mx-power_line' ),
		powerSize = 10,
		changePower = 0,			
		changePowerPeriod,
		keyShot = false;

	function Shot(){
		throwButton.onmousedown = function(){
			if( keyRect == false ){
				keyShot = true;
				changePowerPeriod = setInterval( function(){
					if( changePower <= powerSize - 1 ){
						changePower++;
						powerLine.style.width = changePower * 20 + 'px';
					}
				},100 );
			}			
		}

		throwButton.onmouseup = function(){
			if( keyShot == true ){
				keyRect = true;
				var flight = new MotionRect( 0, canvas.height, angleSight, changePower );
				clearInterval( changePowerPeriod );
				powerLine.style.width = '10px';
				changePower = 0;
				motionRect = setInterval( function(){
					clearContext();
					flight.powerFlight();					
					mechanismAngle.createMechanismAngle( angleSight );
					setTimeout( function(){
						angleSight = 15;
						mechanismAngle.createMechanismAngle( angleSight );
					},500 );					
				},30 );
				keyShot = false;
			}
		}
	}

	/*** Init ***/
	DirectedToTarget();			
	Shot();

}