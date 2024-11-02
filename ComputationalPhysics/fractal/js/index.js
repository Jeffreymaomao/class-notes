/**
 * index = (x + y * imgeData.width) * 4;
 * imgeData.data[index + 0] = r;
 * imgeData.data[index + 1] = g;
 * imgeData.data[index + 2] = b;
 * imgeData.data[index + 3] = a;
 **/
/** ---------------------------------------------------------------------------- */
class grapher {
    constructor(id, scale, width, height) {
        if(scale<0.005){scale=0.005};
        this.id = id;
        this.canvas = document.getElementById(this.id);
        this.ctx = this.canvas.getContext("2d");
        this.scale = scale;
        this.width = width;
        this.height = height;

        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.canvas.width = parseInt(this.canvas.style.width) * this.scale;
        this.canvas.height = parseInt(this.canvas.style.height) * this.scale;
        this.center = {
            x: this.width / 2,
            y: this.height / 2,
            max: max(this.width / 2, this.height / 2)
        }
        this.canvas.center = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            max: max(this.canvas.width / 2, this.canvas.height / 2)
        }
        // this.canvas.style.imageRendering = 'crisp-edges';
        this.canvas.style.imageRendering = 'pixelated';
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    changeResolution(scale) {
    	if(scale<0.005){scale=0.005};
        this.scale = scale;
        this.canvas.width = parseInt(this.canvas.style.width) * this.scale;
        this.canvas.height = parseInt(this.canvas.style.height) * this.scale;
        this.canvas.center = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            max: max(this.canvas.width / 2, this.canvas.height / 2)
        }
    }
}
/** ---------------------------------------------------------------------------- */
class complex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /** ----- */
    add(z) {
        return new complex(this.x + z.x, this.y + z.y)
    }
    add_real(x) {
        return new complex(this.x + x, this.y)
    }
    add_imag(y) {
        return new complex(this.x, this.y + y)
    }
    /** ----- */
    sub(z) {
        return new complex(this.x - z.x, this.y - z.y)
    }
    sub_real(x) {
        return new complex(this.x - x, this.y)
    }
    sub_imag(y) {
        return new complex(this.x, this.y - y)
    }
    /** ----- */
    times(z) {
        return new complex(this.x * z.x - this.y * z.y, this.y * z.x + this.x * z.y)
    }
    times_real(x) {
        return new complex(this.x * x, this.y * x)
    }
    times_imag(y) {
        return new complex(-this.y * y, this.x * y)
    }
    /** ----- */
    divide(z) {
        return new complex(
            (this.x * z.x + this.y * z.y) / (z.x ** 2 + z.y ** 2),
            (this.y * z.x - this.x * z.y) / (z.x ** 2 + z.y ** 2)
        )
    }
    divide_real(x) {
        return new complex(this.x / x, this.y / x)
    }
    divide_imag(y) {
        return new complex(this.y / y, -this.x / y)
    }
    /** ----- */
    abs() {
        return sqrt(this.x ** 2 + this.y ** 2)
    }
    round(n) {
        if (n == undefined) { n = 1 }
        return new complex(round(this.x, n), round(this.y, n))
    }
    distance(z) {
        return this.sub(z).abs()
    }
    isEqual(z) {
        return (this.x == z.x && this.y == z.y)
    }
}
/** ---------------------------------------------------------------------------- */
class fractal0{
    constructor(grapher, f, kwargs){
        this.grapher = grapher;
        this.f = f;
        this.rangeX = [-1, 1];
        this.rangeY = [-1, 1];
        this.iterN = 2;
        if(kwargs){
            this.rangeX = kwargs.rangeX;
            this.rangeY = kwargs.rangeY;
            this.iterN = kwargs.iterN;
        }
        this.ratio1 = 1;
        this.ratio2 = 1;
        this.roots = [];
        this.findroot();
        this.update();
    }
    newton(f, z0, n) {
        var z = z0;

        function fprime(z) {
            var h = 1e-8;
            /*  fprime = (-f(x+2*h)+8*f(x+h)-8*f(x-h)+f(x-2*h))/12/h    */
            return (
                f(z.add_real(2 * h)).times_real(-1).add(
                    f(z.add_real(h)).times_real(8).add(
                        f(z.add_real(-h)).times_real(-8).add(
                            f(z.add_real(-2 * h))
                        )
                    )
                )
            ).times_real(1 / 12 / h);
        }
        if (n == undefined) { n = 1; }
        for (var i = 0; i < n; i++) {
            z = z.sub(f(z).divide(fprime(z)));/* z = z - f(z)/fprime(z); */
        }
        return z
    }
    roots(f, rangeX, rangeY, dx, dy) {
        if (dx == undefined) { dx = 0.1; }
        if (dy == undefined) { dy = 0.1; }
        var nx = ceil((rangeX[1] - rangeX[0]) / dx);
        var ny = ceil((rangeY[1] - rangeY[0]) / dy);
        var roots_save = [new complex()];
        var roots_uniq = [new complex()];
        for (var i = 0; i < nx; i++) {
            for (var j = 0; j < ny; j++) {
                var x = rangeX[0] + i * dx;
                var y = rangeY[0] + j * dy;
                var z = this.newton(this.f, new complex(i * dx, j * dy), n = 50);
                z = z.round(5)
                roots_save.push(z)
            }
        }
        return roots_save;
    }
    findroot(){
        this.roots[0] = this.newton(f, new complex(1,  0), 100)
        this.roots[1] = this.newton(f, new complex(0,  1), 100)
        this.roots[2] = this.newton(f, new complex(0, -1), 100)
    }
    update(){
        this.imageData = new ImageData(this.grapher.canvas.width, this.grapher.canvas.height);
        this.rangeX_ = [this.rangeX[0], this.rangeX[1]];
        this.rangeY_ = [this.rangeY[0], this.rangeY[1]];
        this.ratio1 = this.imageData.width / this.imageData.height;
        this.ratio2 = this.imageData.height / this.imageData.width;
        if (this.ratio2 > ((this.rangeY[1] - this.rangeY[0]) / (this.rangeX[1] - this.rangeX[0]))) {
            this.rangeY[0] = (this.rangeY_[0] + this.rangeY_[1]) / 2 - this.ratio2 * (this.rangeX_[1] - this.rangeX_[0]) / 2
            this.rangeY[1] = (this.rangeY_[0] + this.rangeY_[1]) / 2 + this.ratio2 * (this.rangeX_[1] - this.rangeX_[0]) / 2
        }
        if (this.ratio1 > ((this.rangeX[1] - this.rangeX[0]) / (this.rangeY[1] - this.rangeY[0]))) {
            this.rangeX[0] = (this.rangeX_[0] + this.rangeX_[1]) / 2 - this.ratio1 * (this.rangeY_[1] - this.rangeY_[0]) / 2
            this.rangeX[1] = (this.rangeX_[0] + this.rangeX_[1]) / 2 + this.ratio1 * (this.rangeY_[1] - this.rangeY_[0]) / 2
        }
        /* ------------------------------------------------------------------------------ */
        var distance = [];
        distance.length = this.roots.length;
        var min_distance = 0;
        var i,j,r,g,b,s,v,x,y,z,index;

        for (i = 0; i < this.imageData.width; i++) {
            for (j = 0; j < this.imageData.height; j++) {
                index = (i + j * this.imageData.width) * 4;
                x = this.rangeX[0] + (this.rangeX[1] - this.rangeX[0]) * (i / this.imageData.width);
                y = this.rangeY[0] + (this.rangeY[1] - this.rangeY[0]) * (j / this.imageData.height);
                z = this.newton(f, new complex(x, y), this.iterN);

                for (var ir = 0; ir < this.roots.length; ir++) {
                    distance[ir] = z.distance(this.roots[ir])
                }
                min_distance = min(...distance);
                for (var ir = 0; ir < this.roots.length; ir++) {
                    if (min_distance == distance[ir]) {
                        var s = 0.2 + 0.1 * (2 - Math.random()) / 2;
                        var v = 0.9 + 0.1 * (2 - Math.random()) / 2;
                        [r, g, b] = hsv2rgb((ir / this.roots.length) * 360, s, v);
                    }
                }
                this.imageData.data[index + 0] = r * 255;
                this.imageData.data[index + 1] = g * 255;
                this.imageData.data[index + 2] = b * 255;
                this.imageData.data[index + 3] = 255;
            }
        }
    }
    draw(){
        this.grapher.ctx.putImageData(this.imageData, 0,0);
    }
}

/** ---------------------------------------------------------------------------- */
function hsv2rgb(h, s, v) {
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
    if (hi == 0) {
        [r, g, b] = [v, t, p];
    } else if (hi == 1) {
        [r, g, b] = [q, v, p];
    } else if (hi == 2) {
        [r, g, b] = [p, v, t];
    } else if (hi == 3) {
        [r, g, b] = [p, q, v];
    } else if (hi == 4) {
        [r, g, b] = [t, p, v];
    } else if (hi == 5) {
        [r, g, b] = [v, p, q];
    }
    return [r, g, b]
}
/** ---------------------------------------------------------------------------- */
function f(z) {
    return z.times(z).times(z).add_real(1);
}

function fractal(grapher, f, kwargs) {
	var rangeX = [-1, 1];
    var rangeY = [-1, 1];
    var iterN = 2;
	if(kwargs){
		rangeX = kwargs.rangeX;
		rangeY = kwargs.rangeY;
		iterN = kwargs.iterN;
    }

    let imageData = new ImageData(grapher.canvas.width, grapher.canvas.height);

    var rangeX_ = [rangeX[0], rangeX[1]];
    var rangeY_ = [rangeY[0], rangeY[1]];
    var ratio1 = imageData.width / imageData.height;
    var ratio2 = imageData.height / imageData.width;
    if (ratio2 > ((rangeY[1] - rangeY[0]) / (rangeX[1] - rangeX[0]))) {
        rangeY[0] = (rangeY_[0] + rangeY_[1]) / 2 - ratio2 * (rangeX_[1] - rangeX_[0]) / 2
        rangeY[1] = (rangeY_[0] + rangeY_[1]) / 2 + ratio2 * (rangeX_[1] - rangeX_[0]) / 2
    }
    if (ratio1 > ((rangeX[1] - rangeX[0]) / (rangeY[1] - rangeY[0]))) {
        rangeX[0] = (rangeX_[0] + rangeX_[1]) / 2 - ratio1 * (rangeY_[1] - rangeY_[0]) / 2
        rangeX[1] = (rangeX_[0] + rangeX_[1]) / 2 + ratio1 * (rangeY_[1] - rangeY_[0]) / 2
    }
    /* ------------------------------------------------------------------------------ */
    function newton(f, z0, n) {
        var z = z0;

        function fprime(z) {
            var h = 1e-8;
            /*	fprime = (-f(x+2*h)+8*f(x+h)-8*f(x-h)+f(x-2*h))/12/h 	*/
            return (
                f(z.add_real(2 * h)).times_real(-1).add(
                    f(z.add_real(h)).times_real(8).add(
                        f(z.add_real(-h)).times_real(-8).add(
                            f(z.add_real(-2 * h))
                        )
                    )
                )
            ).times_real(1 / 12 / h);
        }
        if (n == undefined) { n = 1; }
        for (var i = 0; i < n; i++) {
            /*z = z - f(z)/fprime(z);*/
            z = z.sub(f(z).divide(fprime(z)));
        }
        return z
    }

    function roots(f, rangeX, rangeY, dx, dy) {
        if (dx == undefined) { dx = 0.1; }
        if (dy == undefined) { dy = 0.1; }
        var nx = ceil((rangeX[1] - rangeX[0]) / dx);
        var ny = ceil((rangeY[1] - rangeY[0]) / dy);
        var roots_save = [new complex()];
        var roots_uniq = [new complex()];
        for (var i = 0; i < nx; i++) {
            for (var j = 0; j < ny; j++) {
                var x = rangeX[0] + i * dx;
                var y = rangeY[0] + j * dy;
                var z = newton(f, new complex(i * dx, j * dy), n = 50);
                z = z.round(5)
                roots_save.push(z)
            }
        }
        return roots_save;
    }
    /* ------------------------------------------------------------------------------ */
    var roots = [];
    var distance = [];
    var min_distance = 0;
    roots[0] = newton(f, new complex(1, 0), 100)
    roots[1] = newton(f, new complex(0, 1), 100)
    roots[2] = newton(f, new complex(0, -1), 100)

    distance.length = roots.length;

    for (i = 0; i < imageData.width; i++) {
        for (j = 0; j < imageData.height; j++) {
            index = (i + j * imageData.width) * 4;
            var x = rangeX[0] + (rangeX[1] - rangeX[0]) * (i / imageData.width);
            var y = rangeY[0] + (rangeY[1] - rangeY[0]) * (j / imageData.height);
            var r, g, b;
            var z = newton(f, new complex(x, y), iterN);

            for (var ir = 0; ir < roots.length; ir++) {
                distance[ir] = z.distance(roots[ir])
            }
            min_distance = min(...distance);
            for (var ir = 0; ir < roots.length; ir++) {
                if (min_distance == distance[ir]) {
                    var s = 0.7 + 0.1 * (2 - Math.random()) / 2;
                    var v = 0.9 + 0.1 * (2 - Math.random()) / 2;
                    [r, g, b] = hsv2rgb((ir / roots.length) * 360, s, v);
                }
            }
            /**
             * index = (x + y * imgeData.width) * 4;
             * imgeData.data[index + 0] = r;
             * imgeData.data[index + 1] = g;
             * imgeData.data[index + 2] = b;
             * imgeData.data[index + 3] = alpha;
             **/
            imageData.data[index + 0] = r * 255;
            imageData.data[index + 1] = g * 255;
            imageData.data[index + 2] = b * 255;
            imageData.data[index + 3] = 255;
        }
    }
    grapher.ctx.putImageData(imageData, 0, 0);
}

var redraw = true;
var scale = 0;
var scaleMax = 0.3;
var inter = 3;

var app = new grapher('app', scale, window.innerWidth, window.innerHeight);
var newfrac = new fractal0(app, f, {
        iterN: inter,
        rangeX: [-1,1],
        rangeY: [-1,1]
    })

/** ------------------------------------------------------------------------------
 * var MQ = MathQuill.getInterface(2);
 * MQ.StaticMath(DOMobject);
 * ------------------------------------------------------------------------------*/
var inter_slider = document.getElementById("inter_slider");
var inter_number = document.getElementById('inter_number');
var scale_slider = document.getElementById('scale_slider');
var scale_number = document.getElementById('scale_number');

inter_slider.addEventListener('input',function() {
    inter_number.innerHTML = this.value;
    inter = Number(this.value);
    scale = 0.01;
    redraw = true;
})

scale_slider.addEventListener('input',function() {
    scale_number.innerHTML = this.value;
    scaleMax = Number(this.value);
    scale = scaleMax;
    scale = 0.01;
    redraw = true;
})

var redraw = true;
var scale = 0;
var scaleMax = 0.3;
var inter = 3;

function draw(){
    fractal(app, f, {
        iterN: inter,
        rangeX: [-1,1],
        rangeY: [-1,1]
    });
    // newfrac.draw();
}

function update(){
    if(scale<=scaleMax){
        redraw = true;
        scale = scale + 0.01;
    }
    if(redraw){
        redraw = false;
        // newfrac.update();
        app.changeResolution(scale);
        draw();
    }
    requestAnimationFrame(update);
}
update()

