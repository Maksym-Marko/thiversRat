window.onload = function(){

/*******************************************************************************
*********************************** vars ***************************************
********************************************************************************/
	/*** Init ***/
	var canvas = document.getElementById( 'canvas' ),
		c = canvas.getContext( '2d' ),
		canvasLeft = canvas.getBoundingClientRect().left,
		canvasTop = canvas.getBoundingClientRect().top;

	/*** Srart game ***/
	var timeCount = document.getElementById( 'timeCount' ),
		mxStart = document.getElementById( 'mxStart' ),
		mxControlPanel = document.getElementById( 'mxControlPanel' ),
		keyStart = false,
		keyFirstBg = true,
		timeGame = 60;

	/*** Dgaw rat-catch ***/
	var countEggs = document.getElementById( 'countEggs' ),
		recordEggs = document.getElementById( 'recordEggs' ),
		countEggsNum = countEggs.innerHTML,
		recordEggsNum = recordEggs.innerHTML,
		intervalMotionRatBack;

		_posCatchRatX = canvas.width + 10,
		_posCatchRatY = canvas.height - 40,
		_posCatchRatW = 10,
		_posCatchRatH = 30;

	/*** Shot ***/
	var throwButton = document.getElementById( 'mx-throw' ),
		powerLine = document.getElementById( 'mx-power_line' ),
		powerSize = 10,
		changePower = 0,			
		changePowerPeriod,
		keyShot = false,
		motionRect,
		keyRect = false,
		TWO_PI = Math.PI * 2,
		SightX = 0,
		SightY = 0,
		SightSize = 20,
		angleSight = 15;

	/*** Sprites ***/
	var allSprites = {};

/*******************************************************************************
*********************************** Sprites ************************************
********************************************************************************/
	// Sprites
	var img = new Image();
	img.src = 'img/sprite.png';

	// Bg
	var imgBg = new Image();
	imgBg.src = 'img/bg1.png';

	function Sprite( img, imgX, imgY, imgW, imgH, ctxX, ctxY, ctxW, ctxH ){
		this.img = img;
		this.imgX = imgX;
		this.imgY = imgY;
		this.imgW = imgW;
		this.imgH = imgH;

		this.ctxX = ctxX;
		this.ctxY = ctxY;
		this.ctxW = ctxW;
		this.ctxH = ctxH;
	}

	Sprite.prototype.draw = function(){
		c.drawImage( this.img, this.imgX, this.imgY, this.imgW, this.imgH,
						this.ctxX, this.ctxY, this.ctxW, this.ctxH );
	}

	// Background
	function BgCanvas(){
		allSprites.bg = [ new Sprite( imgBg, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height ) ];
		allSprites.bg[0].draw();
	}

	// Older rat Stands
	var ros = 0;
	function RatOlderStands(){
		allSprites.ratOlderStands = [
			new Sprite( img, 39, 120, 41, 41, 0, canvas.height - 41, 41, 41 ),
			new Sprite( img, 86, 120, 41, 41, 0, canvas.height - 41, 41, 41 )
		];
		ros += 0.20;
		rosN = parseInt( ros );
		if( rosN > 1 ){
			ros = 0;
			rosN = 0;
		}
		allSprites.ratOlderStands[rosN].draw();
	}
	
	// Older rat Stands whit egg
	function RatOlderThrows(){
		allSprites.ratOlderThrows = [ new Sprite( img, 0, 120, 41, 41, 0, canvas.height - 41, 41, 41 ) ];
		allSprites.ratOlderThrows[0].draw();
	}

	// Draw Sight
	function ВrawSight( sigX, sigY, sigNewW, sigNewH ){
		allSprites.drSight = [ new Sprite( img, 0, 161, 41, 41, sigX, sigY, 50, 50 ) ];
		allSprites.drSight[0].draw();
	}

	// Egg Flies
	var eggf = 0;
	function EggFlies( eggX, eggY ){
		
		allSprites.eggFlies = [ new Sprite( img, 3, 80, 22, 22, eggX, eggY, 22, 22 ),
								new Sprite( img, 27, 80, 22, 22, eggX, eggY, 22, 22)
		];

		eggf += 0.20;
		eggfN = parseInt( eggf );
		if( eggfN > 1 ){
			eggf = 0;
			eggfN = 0;
		}
		
		allSprites.eggFlies[eggfN].draw();
	}
	
	// Egg Broken
	function EggBroken( eggBrX, eggBrY ){
		allSprites.eggBroken = [ new Sprite( img, 54, 79, 40, 30, eggBrX, eggBrY, 40, 30 ) ];
		allSprites.eggBroken[0].draw();
	}

	// Rat Jr Without Egg
	var rjWoE = 0;
	function RatJrWithoutEgg( rjwoeX, rjwoeY ){
		allSprites.ratJrWithoutEgg = [ new Sprite( img, 0, 0, 38, 40, rjwoeX, rjwoeY, 38, 40 ),
								new Sprite( img, 38, 0, 38, 40, rjwoeX, rjwoeY, 38, 40)
		];

		rjWoE += 0.05;
		rjWoEN = parseInt( rjWoE );
		if( rjWoEN > 1 ){
			rjWoE = 0;
			rjWoEN = 0;
		}

		allSprites.ratJrWithoutEgg[rjWoEN].draw();
	}

	// Rat Jr Whit Egg
	var rjWiE = 0;
	function RatJrWhitEgg( rjwieX, rjwieY ){
		allSprites.ratJrWhitEgg = [ new Sprite( img, 0, 40, 34, 40, rjwieX, rjwieY, 34, 40 ),
								new Sprite( img, 35, 40, 34, 40, rjwieX, rjwieY, 34, 40)
		];

		rjWiE += 0.10;
		rjWiEN = parseInt( rjWiE );
		if( rjWiEN > 1 ){
			rjWiE = 0;
			rjWiEN = 0;
		}

		allSprites.ratJrWhitEgg[rjWiEN].draw();
	}

	// rat Jr Stand
	function RatJrStand( ratJSX, ratJSY ){
		allSprites.ratJrStand = [ new Sprite( img, 89, 0, 25, 40, ratJSX, ratJSY, 25, 44 ) ];
		allSprites.ratJrStand[0].draw();
	}
	
/*******************************************************************************
**************************** Subsidiary functions ******************************
********************************************************************************/

	/*** Clear rect ***/
	function clearContext(){		
		BgCanvas();
	}

	/*** Random number ***/
	function RandomNumber( from, to ){
		return Math.floor( ( Math.random() * ( to - from + 1 ) ) + from );
	}
	
	/*** Dgaw rat-catch ***/
	function dgawRatCatch( _posCatchRatX, _posCatchRatY, _posCatchRatW, _posCatchRatH ){		
		RatJrStand( _posCatchRatX, _posCatchRatY );
	}

/*******************************************************************************
************ The calculation of the angle of flight and power shots ************
********************************************************************************/

	/*** Change angle ***/

	function MechanismAngle( mX, mY, mRatius ){
		this.x = mX;
		this.y = mY;
		this.ratius = mRatius;
	}

	MechanismAngle.prototype.createMechanismAngle = function( angleSight ){			
		
		/* Sight */
		angleSight = angleSight || 15;
		sX = this.x + this.ratius * Math.cos( TWO_PI * ( angleSight - 20 ) / 100 ); // 1 - 15
		sY = this.y + this.ratius * Math.sin( TWO_PI * ( angleSight - 20 ) / 100 ); // 1 - 15

		ВrawSight( sX, sY, SightSize, SightSize );

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

		EggFlies( this.x, this.y )

		fieldCatchX = _posCatchRatX - 5,
		fieldCatchSize = 5 + _posCatchRatW;

		if( this.y > canvas.height && this.x < fieldCatchX ||
			this.y > canvas.height && this.x > fieldCatchX + fieldCatchSize	){
			console.log( 'Промах' );
			clearInterval( motionRect );
			mechanismAngle.createMechanismAngle();
			keyRect = false;
			EggBroken( this.x, this.y - 30 );	
		} else{
			if( this.y > canvas.height - _posCatchRatH - 30 && this.x > fieldCatchX && this.x < fieldCatchX + fieldCatchSize ){
				console.log( 'Попал' );
				clearInterval( motionRect );
				keyRect = false;
				countEggsNum++;
				countEggs.innerHTML = countEggsNum;

				if( recordEggsNum < countEggsNum ){
					recordEggs.innerHTML = countEggsNum;
				}

				intervalMotionRatBack = setInterval( function(){
					if( _posCatchRatX < canvas.width + 10 ){
						_posCatchRatX += 6;
						clearContext();
						RatJrWhitEgg( _posCatchRatX, _posCatchRatY );
					} else{
						clearInterval( intervalMotionRatBack );
						MotionRatFront();
					}
					RatOlderStands();

				},30 );

				throwButton.onmousedown = function(){
					return;
				}

			}
		}
	}

/*******************************************************************************
************************ Directed to target and shot ***************************
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
		/* draw rat */
		dgawRatCatch( _posCatchRatX, _posCatchRatY, _posCatchRatW, _posCatchRatH );

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
					RatOlderThrows();
					RatJrStand( _posCatchRatX, _posCatchRatY );

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

		canvas.onmouseup = function(){
			canvas.style.cursor = 'default';
			canvas.onmousemove = function(){
				return;
			}
		}
	}	

	/*** Shot ***/
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

		throwButton.onmouseleave = function(){
			keyRect = false;
			keyShot = false;
			changePower = 0;
			powerLine.style.width = '10px';
			clearInterval( changePowerPeriod );
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

					// Rat stands					
					RatOlderStands();
					RatJrStand( _posCatchRatX, _posCatchRatY );

					flight.powerFlight();					
					setTimeout( function(){
						angleSight = 15;						
					},500 );					
				},30 );
				keyShot = false;
			}			
		}
	}

/*******************************************************************************
*********************************** Catch ***************************************
********************************************************************************/	
	var motionCatcher;

	function PositionCatch( posCatchRatX ){
		this.x = posCatchRatX;
		this.posRatX = _posCatchRatX;
	}

	PositionCatch.prototype.catchMotion = function(){		

		if( this.posRatX >= this.x ){
			this.posRatX -= 14;
		} else{
			clearInterval( motionCatcher );
			_posCatchRatX = this.posRatX;
			
			mechanismAngle.createMechanismAngle();

			/*** Sight ***/
			DirectedToTarget();

			/*** Shot ***/		
			Shot();	
			RatOlderThrows();		
		}

		RatJrStand( this.posRatX, _posCatchRatY );
	}

	/*** Catch rat ***/	
	function MotionRatFront(){
		var positionCatchRat = RandomNumber( 300, canvas.width - 20 );
		var rat = new PositionCatch( positionCatchRat );

		motionCatcher = setInterval( function(){
			clearContext();
			rat.catchMotion();
		},30 );
	}	

/*******************************************************************************
*********************************** Start game *********************************
********************************************************************************/

	function StartBG(){
		if( keyFirstBg == true ){
			c.fillStyle = '#333';
			c.fillRect( 0, 0, canvas.width, canvas.height );
			c.fill();

			c.fillStyle = '#fff';
			c.font = '40px Arial';
			c.fillText( 'НАЧАТЬ ИГРУ', 300, 200 );
			keyFirstBg = false;
		} else{
			c.fillStyle = '#333';
			c.fillRect( 0, 0, canvas.width, canvas.height );
			c.fill();

			c.fillStyle = '#fff';
			c.font = '30px Arial';
			c.fillText( 'НАЧАТЬ ИГРУ ЗАНОВО. РЕКОРД - ' + recordEggs.innerHTML + ' УКРАДЕННЫХ ЯИЦ!', 60, 200 );
		}
		
	}

	function StartGame(){
		StartBG();
		mxStart.onclick = function(){
			if( keyStart == false ){
				keyStart = true;
				mxStart.style.display = 'none';
				mxControlPanel.style.display = 'block';
				MotionRatFront();

				var _time = timeGame;
				var timeGamePeriod = setInterval( function(){					
					if ( _time > 0 ){
						_time--;
					} else{
						clearInterval( motionRect );
						clearInterval( intervalMotionRatBack );
						clearInterval( changePowerPeriod );
						clearInterval( motionCatcher );
						clearInterval( timeGamePeriod );						
						StartBG();
						mxStart.style.display = 'table';
						mxControlPanel.style.display = 'none';
						recordEggsNum = recordEggs.innerHTML;
						countEggs.innerHTML = 0;
						countEggsNum = 0;
						_time = timeGame;
						canvas.onmousemove = function(){
							return;
						}
						_posCatchRatX = canvas.width + 10;
						keyStart = false;
					}
					timeCount.innerHTML = _time;
				},1000 );

			}				
		}		
	}

/*******************************************************************************
*********************************** Init ***************************************
********************************************************************************/
	

	function init(){
		StartGame();
	}	

	init();	
		
}