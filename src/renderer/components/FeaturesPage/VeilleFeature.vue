<template>
  <canvas id="veille_render"></canvas>
</template>

<script>
  /* eslint-disable */
  var canvas,
    c;
  var dots = [];
  var dot_count = 30;
  var dot_radius = 20;
  var dot_stroke_color = 'hsla(0,50,100,0.8)';
  var dot_stroke_weight = 5;
  var dot_speed = 3;
  var dot_speed_max = 4;
  var dot_speed_min = 1;
  var dot_turn = 2;
  var dot_gravity = 0.0009;
  var dot_avoidance_distance = 0.1;
  var dot_avoidance_strength = 0.1;

  var	screenWidth = window.innerWidth;
  var screenHeight = window.innerHeight;
  var screenMin = (screenWidth < screenHeight) ? screenWidth : screenHeight;



  let img = new Image();
  img.src = 'static/dot.png';


  function setup() {
    frameRate = 25;
    setupCanvas();
    makeDots(dot_count);
  }

  function makeDots(count) {
    for(var i = 0; i < count; i++) {
      var r = randomInteger(0,screenMin*0.4);
      var d = randomInteger(0,60);
      dots.push(new Dot(r, d, i));
    }
  }

  function draw() {
    c.clearRect(-screenWidth/2, -screenHeight/2, screenWidth, screenHeight);

    c.strokeStyle = dot_stroke_color;
    c.lineWidth = dot_stroke_weight;
    for(var i = 0; i < dots.length; i++) {
      var dot = dots[i];
      dot.update(canvas);
      dot.draw(c);
    }
  }

  let Dot = function(r, d, index) {

    var pos = this.pos = new Vector2(r,0).rotate(d);
    var vel = this.vel = new Vector2(dot_speed,0);
    var ang = this.ang = 180-pos.angle();
    var dir = this.dir = randomInteger(0,1);
    var index = this.index;

    vel.rotate(ang);

    this.update = function(canvas) {

      // randomly change clockwiseness
      if (randomInteger(0,100) == 0) {
        dir = (dir == 1) ? 0 : 1;
      }

      // rotate
      if (dir) {
        vel.rotate(dot_turn);
      } else {
        vel.rotate(-dot_turn);
      }

      // gravity
      var change_gravity = new Vector2(pos.x*dot_gravity,pos.y*dot_gravity);
      vel.minusEq(change_gravity);

      // dot avoidance
      for (var i = 0; i < dots.length; i++) {
        var adot = dots[i];
        if (i != this.index) {
          var delta = adot.pos.minusNew(this.pos);
          var delta_mag = Math.sqrt((delta.x*delta.x)+(delta.y*delta.y));
          if (delta_mag < dot_avoidance_distance) {
            delta.multiplyEq((dot_avoidance_distance-delta_mag)/dot_avoidance_distance*dot_avoidance_strength);
            pos.minusEq(delta);
          }
        }
      }

      // edge avoidance
      if (pos.x > screenWidth*0.4) {
        vel.x += -0.3;
      } else if (pos.x < -screenWidth*0.4) {
        vel.x += 0.3;
      }
      if (pos.y > screenHeight*0.4) {
        vel.y += -0.3;
      } else if (pos.y < -screenHeight*0.4) {
        vel.y += 0.3;
      }

      // min and max speeds
      var mag = Math.sqrt((vel.x*vel.x)+(vel.y*vel.y));
      if (mag < dot_speed_min) {
        vel.multiplyEq(dot_speed_min/mag);
      } else if (mag > dot_speed_max) {
        vel.multiplyEq(dot_speed_max/mag);
      }


      // add velocity to position
      pos.plusEq(vel);
    };

    this.draw = function(c) {


      // save the current canvas state
      c.save();

      // move to where the particle should be
      c.translate(pos.x, pos.y);

      // scale it dependent on the size of the particle
      var s = 0.9;
      c.scale(s,s);

      //c.rotate(ang);
      // move the draw position to the center of the image
      c.translate(img.width*-0.5, img.width*-0.5);

      // set the composition mode
      c.globalCompositeOperation = this.compositeOperation;

      // and draw it!
      c.drawImage(img,0,0);

      // and restore the canvas state
      c.restore();


    };

  };

  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'visu-feature',

    computed: {
      ...mapState({
        modifier: state => state.feature.modifier
      }),
      ...mapGetters([
        'getModifierState'
      ])
    },

    mounted: async function () {
      this.canvas = document.getElementById('veille_render')
      this.ctx = this.canvas.getContext('2d')

      await this.constructer()

      this.watcher = this.$store.watch(
        () => this.getModifierState,
        () => {
          this.destroyer()
          this.constructer()
        }
      )
    },

    beforeDestroy: function () {
      this.watcher()
      this.destroyer()
    },

    methods: {
      constructer: async function () {
        canvas = document.createElement('veille_render');
        c = canvas.getContext('2d');
        canvas.width = screenWidth;
        canvas.height = screenHeight;
        document.body.appendChild(canvas);
        c.globalCompositeOperation = "lighter";

        c.translate(screenWidth/2, screenHeight/2);
      },

      destroyer: function () {
        window.cancelAnimationFrame(this.frameRequestId)
      },

      frameLooper: function () {
        return window.requestAnimationFrame(this.frameLooper)
      }
    }
  }


  var Vector2 = function (x,y) {

    this.x= x || 0;
    this.y = y || 0;

  };

  Vector2.prototype = {

    reset: function ( x, y ) {

      this.x = x;
      this.y = y;

      return this;

    },

    toString : function (decPlaces) {
      decPlaces = decPlaces || 3;
      var scalar = Math.pow(10,decPlaces);
      return "[" + Math.round (this.x * scalar) / scalar + ", " + Math.round (this.y * scalar) / scalar + "]";
    },

    clone : function () {
      return new Vector2(this.x, this.y);
    },

    copyTo : function (v) {
      v.x = this.x;
      v.y = this.y;
    },

    copyFrom : function (v) {
      this.x = v.x;
      this.y = v.y;
    },

    magnitude : function () {
      return Math.sqrt((this.x*this.x)+(this.y*this.y));
    },

    magnitudeSquared : function () {
      return (this.x*this.x)+(this.y*this.y);
    },

    normalise : function () {

      var m = this.magnitude();

      this.x = this.x/m;
      this.y = this.y/m;

      return this;
    },

    reverse : function () {
      this.x = -this.x;
      this.y = -this.y;

      return this;
    },

    plusEq : function (v) {
      this.x+=v.x;
      this.y+=v.y;

      return this;
    },

    plusNew : function (v) {
      return new Vector2(this.x+v.x, this.y+v.y);
    },

    minusEq : function (v) {
      this.x-=v.x;
      this.y-=v.y;

      return this;
    },

    minusNew : function (v) {
      return new Vector2(this.x-v.x, this.y-v.y);
    },

    multiplyEq : function (scalar) {
      this.x*=scalar;
      this.y*=scalar;

      return this;
    },

    multiplyNew : function (scalar) {
      var returnvec = this.clone();
      return returnvec.multiplyEq(scalar);
    },

    divideEq : function (scalar) {
      this.x/=scalar;
      this.y/=scalar;
      return this;
    },

    divideNew : function (scalar) {
      var returnvec = this.clone();
      return returnvec.divideEq(scalar);
    },

    dot : function (v) {
      return (this.x * v.x) + (this.y * v.y) ;
    },

    angle : function (useRadians) {

      return Math.atan2(this.y,this.x) * (useRadians ? 1 : Vector2Const.TO_DEGREES);

    },

    rotate : function (angle, useRadians) {

      var cosRY = Math.cos(angle * (useRadians ? 1 : Vector2Const.TO_RADIANS));
      var sinRY = Math.sin(angle * (useRadians ? 1 : Vector2Const.TO_RADIANS));

      Vector2Const.temp.copyFrom(this);

      this.x= (Vector2Const.temp.x*cosRY)-(Vector2Const.temp.y*sinRY);
      this.y= (Vector2Const.temp.x*sinRY)+(Vector2Const.temp.y*cosRY);

      return this;
    },

    equals : function (v) {
      return((this.x==v.x)&&(this.y==v.y));
    },

    isCloseTo : function (v, tolerance) {
      if(this.equals(v)) return true;

      Vector2Const.temp.copyFrom(this);
      Vector2Const.temp.minusEq(v);

      return(Vector2Const.temp.magnitudeSquared() < tolerance*tolerance);
    },

    rotateAroundPoint : function (point, angle, useRadians) {
      Vector2Const.temp.copyFrom(this);
      Vector2Const.temp.minusEq(point);
      Vector2Const.temp.rotate(angle, useRadians);
      Vector2Const.temp.plusEq(point);
      this.copyFrom(Vector2Const.temp);
    },

    isMagLessThan : function (distance) {
      return(this.magnitudeSquared()<distance*distance);
    },

    isMagGreaterThan : function (distance) {
      return(this.magnitudeSquared()>distance*distance);
    }


    // still to fix :
    // public function projectOnto(v:Vector2) : Vector2
    // {
    // 		var dp:Number = dot(v);
    //
    // 		var f:Number = dp / ( v.x*v.x + v.y*v.y );
    //
    // 		return new Vector2( f*v.x , f*v.y);
    // 	}
    //
    //
    // public function convertToNormal():void
    // {
    // 	var tempx:Number = x;
    // 	x = -y;
    // 	y = tempx;
    //
    //
    // }
    // public function getNormal():Vector2
    // {
    //
    // 	return new Vector2(-y,x);
    //
    // }
    //
    //
    //
    // public function getClosestPointOnLine ( vectorposition : Point, targetpoint : Point ) : Point
    // {
    // 	var m1 : Number = y / x ;
    // 	var m2 : Number = x / -y ;
    //
    // 	var b1 : Number = vectorposition.y - ( m1 * vectorposition.x ) ;
    // 	var b2 : Number = targetpoint.y - ( m2 * targetpoint.x ) ;
    //
    // 	var cx : Number = ( b2 - b1 ) / ( m1 - m2 ) ;
    // 	var cy : Number = m1 * cx + b1 ;
    //
    // 	return new Point ( cx, cy ) ;
    // }
    //

  };

  const Vector2Const = {
    TO_DEGREES : 180 / Math.PI,
    TO_RADIANS : Math.PI / 180,
    temp : new Vector2()
  };

  // canvas augmentation!

  var p = CanvasRenderingContext2D.prototype;
  p.circle = function(x, y, radius) {
    this.beginPath();
    this.arc(x, y, radius, 0, Math.PI*2, true);
  };
  p.fillCircle = function(x, y, radius) {
    this.circle(x, y, radius);
    this.fill();
    this.beginPath();
  };
  p.strokeCircle = function(x, y, radius) {
    this.circle(x, y, radius);
    this.stroke();
    this.beginPath();
  };
  p.ellipse = function(x, y, width, height) {
    this.beginPath();
    for(var i=0;i<Math.PI*2;i+=Math.PI/16) {
      this.lineTo(x+(Math.cos(i)*width/2), y+(Math.sin(i)*height/2));

    }
    this.closePath();
  };
  p.fillEllipse = function(x, y, width, height) {
    this.ellipse(x,y,width, height);
    this.fill();
    this.beginPath();
  };
  p.strokeEllipse = function(x, y, width, height) {
    this.ellipse(x,y,width, height);
    this.stroke();
    this.beginPath();
  };

  p.line = function (x1, y1, x2, y2){
    this.beginPath();
    this.moveTo(x1,y1);
    this.lineTo(x2,y2);
    this.stroke();
    this.beginPath();
  };

  function radians(deg) {return deg*Math.PI/180;};
  function degrees(rad) {return rad*180/Math.PI;};
  function rgb(r, g, b) { return 'rgb('+clamp(Math.round(r),0,255)+', '+clamp(Math.round(g),0,255)+', '+clamp(Math.round(b),0,255)+')';};
  function rgba(r, g, b, a) { return 'rgba('+clamp(Math.round(r),0,255)+', '+clamp(Math.round(g),0,255)+', '+clamp(Math.round(b),0,255)+', '+clamp(a,0,1)+')';};
  function hsl(h, s, l) { return 'hsl('+h+', '+clamp(s,0,100)+'%, '+clamp(l,0,100)+'%)';};
  function hsla(h, s, l, a) { return 'hsla('+h+', '+clamp(s,0,100)+'%, '+clamp(l,0,100)+'%, '+clamp(a,0,1)+')';};

  function randomInteger(min, max) {
    if(max===undefined) {
      max = min;
      min = 0;
    }
    return Math.floor(Math.random() * (max+1-min)) +min;
  }
  function random(min, max) {
    if(min===undefined) {
      min = 0;
      max = 1;
    } else if(max=== undefined) {
      max = min;
      min = 0;
    }
    return (Math.random() * (max-min)) + min;
  };

  function map(value, min1, max1, min2, max2, clampResult) {
    var returnvalue = ((value-min1) / (max1 - min1) * (max2-min2)) + min2;
    if(clampResult) return clamp(returnvalue, min2, max2);
    else return returnvalue;
  };

  function clamp(value, min, max) {
    if(max<min) {
      var temp = min;
      min = max;
      max = temp;

    }
    return Math.max(min, Math.min(value, max));
  };

  function dist(x1, y1, x2, y2) {
    x2-=x1; y2-=y1;
    return Math.sqrt((x2*x2) + (y2*y2));
  }

  var mouseX = 0,
    mouseY = 0,
    lastMouseX = 0,
    lastMouseY = 0,
    frameRate = 60,
    lastUpdate = Date.now(),
    mouseDown = false;

  function cjsloop() {

    var now = Date.now();
    var elapsedMils = now - lastUpdate;


    if((typeof window.draw == 'function') && (elapsedMils>=(1000/window.frameRate))) {
      window.draw();

      lastUpdate = now - elapsedMils % (1000/window.frameRate );
      lastMouseX = mouseX;
      lastMouseY = mouseY;
    }

    requestAnimationFrame(cjsloop);

  };




  // requestAnimationFrame
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

  // requestAnimationFrame polyfill by Erik Möller
  // fixes from Paul Irish and Tino Zijdel

  (function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
        || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };

    if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
  }());
</script>

<style scoped>
  canvas {
    background: transparent;
  }
</style>
