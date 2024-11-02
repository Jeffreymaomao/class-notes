/**
 * index = (x + y * imgeData.width) * 4;
 * imgeData.data[index + 0] = r;
 * imgeData.data[index + 1] = g;
 * imgeData.data[index + 2] = b;
 * imgeData.data[index + 3] = a;
 **/
/** ---------------------------------------------------------------------------- */
// math function setting
const cos = Math.cos;
const sin = Math.sin;
const floor = Math.floor;
const sqrt = Math.sqrt;
const ceil = Math.ceil;
const pi = Math.PI;
const random = Math.random;
const abs = Math.abs;
const max = Math.max;
const min = Math.min;
const atan2 = Math.atan2;
function round(x,n){
	if(n==undefined){n=0;}
	return Math.round(x * 10**n)/10**n
}
/** ---------------------------------------------------------------------------- */
const canvas = document.getElementById('app');
const ctx = canvas.getContext("2d");
const scale = 0.5;
const offset = 10;
const size = {width: window.innerWidth-offset,height: window.innerHeight-offset};
[canvas.style.width, canvas.style.height] = [`${size.width}px`, `${size.height}px`];
[canvas.width, canvas.height] = [parseInt(canvas.style.width) * scale, parseInt(canvas.style.height) * scale];
const center = {
	x: canvas.width/2, 
	y: canvas.height/2,
	max: max(canvas.width/2,canvas.height/2)
};
/** ---------------------------------------------------------------------------- */
function hsv2rgb(h, s, v){
    /**
     * input argument:
     * 	h: (  0  ~ 360 ) => hue
     * 	s: (  0  ~  1  ) => saturation
     * 	v: (  0  ~  1  ) => v
     * output argument:
     * 	r: (  0  ~  1  ) => red
     * 	g: (  0  ~  1  ) => green
     * 	b: (  0  ~  1  ) => blue
    **/
    var h60 = h / 60.0;
    var h60f = floor(h60);
    var hi = ceil(h60f) % 6;
    var f = h60 - h60f;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    var r, g, b;
    if(hi == 0){
    	[r, g, b] = [v, t, p];
    }else if(hi == 1){
    	[r, g, b] = [q, v, p];
    }else if(hi == 2){
    	[r, g, b] = [p, v, t];
    }else if(hi == 3){
    	[r, g, b] = [p, q, v];
    }else if(hi == 4){
    	[r, g, b] = [t, p, v];
    }else if(hi == 5){
    	[r, g, b] = [v, p, q];
    }
    return [r, g, b]
}
/** ---------------------------------------------------------------------------- */
class complex{
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
	/** ----- */
	add(z){
		return new complex(this.x + z.x,this.y + z.y)
	}
	add_real(x){
		return new complex(this.x + x,this.y)
	}
	add_imag(y){
		return new complex(this.x,this.y + y)
	}
	/** ----- */
	sub(z){
		return new complex(this.x - z.x,this.y - z.y)
	}
	sub_real(x){
		return new complex(this.x - x,this.y)
	}
	sub_imag(y){
		return new complex(this.x,this.y - y)
	}
	/** ----- */
	times(z){
		return new complex(this.x*z.x - this.y*z.y,this.y*z.x + this.x*z.y )
	}
	times_real(x){
		return new complex(this.x*x,this.y*x)
	}
	times_imag(y){
		return new complex(-this.y*y,this.x*y)
	}
	/** ----- */
	divide(z){
		return new complex(
			(this.x * z.x + this.y*z.y)/(z.x**2+z.y**2),
			(this.y*z.x - this.x*z.y)/(z.x**2+z.y**2)
			)
	}
	divide_real(x){
		return new complex(this.x/x,this.y/x)
	}
	divide_imag(y){
		return new complex(this.y/y, -this.x/y)
	}
	/** ----- */
	abs(){
		return sqrt(this.x**2 + this.y**2)
	}
	round(n){
		if(n==undefined){n=1}
		return new complex(round(this.x,n),round(this.y,n))
	}
	distance(z){
		return this.sub(z).abs()
	}
	isEqual(z){
		return (this.x==z.x&&this.y==z.y)
	}
}

/** ---------------------------------------------------------------------------- */
function manipulate(imageData){
	for(i=0;i<imageData.width;i++){
		for(j=0;j<imageData.height;j++){
			index = (i + j * imageData.width) * 4;
			var x = i/imageData.width;
			var y = j/imageData.height;
			var r,g,b;
			[r,g,b] = hsv2rgb(360*x,1,y);

			imageData.data[index + 0] = r*255;
			imageData.data[index + 1] = g*255;
			imageData.data[index + 2] = b*255;
			imageData.data[index + 3] = 255;
		}
	}
}

function f(z){
	return z.times(z).times(z).add_real(1);
}

function dfdz(z){
	return z.times(z).times_real(3)
}

function newton(f,z0,n){
	var z = z0;
	function fprime(z){
		var h = 1e-8;
		/*	fprime = (-f(x+2*h)+8*f(x+h)-8*f(x-h)+f(x-2*h))/12/h 	*/
		return (
				f(z.add_real(2*h)).times_real(-1).add(
					f(z.add_real(h)).times_real(8).add(
						f(z.add_real(-h)).times_real(-8).add(
							f(z.add_real(-2*h))
						)
					)
				)
			).times_real(1/12/h);
	}
	if(n==undefined){n=1;}
	for(var i=0;i<n;i++){
		/*z = z - f(z)/fprime(z);*/
		z = z.sub(f(z).divide(fprime(z)));
	}
	return z
}

function roots(f, rangeX, rangeY, dx, dy){
	if(dx==undefined){dx=0.1;}
	if(dy==undefined){dy=0.1;}
	var nx = ceil((rangeX[1]-rangeX[0])/dx);
	var ny = ceil((rangeY[1]-rangeY[0])/dy);
	var roots_save = [new complex()];
	var roots_uniq = [new complex()];
	for(var i=0;i<nx;i++){
		for(var j=0;j<ny;j++){
			var x = rangeX[0] +  i * dx;
			var y = rangeY[0] +  j * dy;
			var z = newton(f,new complex(i*dx,j*dy),n=50);
			z = z.round(5)
			roots_save.push(z)
		}
	}
	return roots_save;
}
var dis = 0;
function fractal(imageData, kwargs){
	var rangeX=[-1,1];
	var rangeY=[-1,1];
	if(kwargs){rangeX=kwargs.rangeX;}
	if(kwargs){rangeY=kwargs.rangeY;}
	var rangeX_ = [rangeX[0],rangeX[1]];
	var rangeY_ = [rangeY[0],rangeY[1]];
	var ratio1 = imageData.width/imageData.height;
	var ratio2 = imageData.height/imageData.width;
	if(ratio2>((rangeY[1]-rangeY[0])/(rangeX[1]-rangeX[0]))){
		rangeY[0] = (rangeY_[0]+rangeY_[1])/2 - ratio2*(rangeX_[1]-rangeX_[0])/2
		rangeY[1] = (rangeY_[0]+rangeY_[1])/2 + ratio2*(rangeX_[1]-rangeX_[0])/2
	}
	if(ratio1>((rangeX[1]-rangeX[0])/(rangeY[1]-rangeY[0]))){
		rangeX[0] = (rangeX_[0]+rangeX_[1])/2 - ratio1*(rangeY_[1]-rangeY_[0])/2
		rangeX[1] = (rangeX_[0]+rangeX_[1])/2 + ratio1*(rangeY_[1]-rangeY_[0])/2
	}
	var roots = [];
	var distance = [];
	var min_distance=0;
	roots[0] = newton(f, new complex(1,0), 100)
	roots[1] = newton(f, new complex(0,1), 100)
	roots[2] = newton(f, new complex(0,-1), 100)

	distance.length = roots.length;


	var x_=1000;
	for(i=0;i<imageData.width;i++){
		for(j=0;j<imageData.height;j++){
			index = (i + j * imageData.width) * 4;
			var x = rangeX[0] +  (rangeX[1]-rangeX[0])*(i/imageData.width);
			var y = rangeY[0] +  (rangeY[1]-rangeY[0])*(j/imageData.height);
			var r,g,b;
			var z = newton(f,new complex(x,y), 2);

			for(var ir=0;ir<roots.length;ir++){
				distance[ir] = z.distance(roots[ir])
			}
			min_distance = min(...distance);
			for(var ir=0;ir<roots.length;ir++){
				if(min_distance==distance[ir]){
					var s = 0.5 + 0.2*(2-Math.random())/2;
					var v = 0.9 + 0.2*(2-Math.random())/2;
					[r,g,b]=hsv2rgb((ir/roots.length)*360, s, v);
				}
			}

			imageData.data[index + 0] = r*255;
			imageData.data[index + 1] = g*255;
			imageData.data[index + 2] = b*255;
			imageData.data[index + 3] = 255;
		}
	}

}
let imageData = new ImageData(canvas.width, canvas.height);
fractal(imageData)
ctx.putImageData(imageData, 0, 0);


