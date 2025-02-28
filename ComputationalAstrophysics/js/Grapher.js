class Grapher {
    constructor(config={gui:false}) {
        this.scene = new THREE.Scene();
        this.axisLength = 1.2;
        this.axisLabels = [undefined, undefined, undefined];

        if(config.gui) {
            var guiWidth = 245;
            if(config.guiWidth) guiWidth =config.guiWidth
            this.gui = new dat.GUI({ autoPlace: false, width: guiWidth})
            this.gui.domElement.id = 'gui';
            document.querySelector('header').appendChild(this.gui.domElement);
        }

        window.addEventListener('load', () => {
            this.init();
        });
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    init() {
        this.initRenderer();
        this.initCamera()
        this.initAxis();
        this.initLabel();
        this.initControls();
        this.initAnimation();
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(1.8, 1.8, 1.8);
        this.camera.up.set(0, 0, 1);
        this.camera.lookAt(0, 0, 0);

    }

    initLabel() {
        this.labelRenderer = new THREE.CSS2DRenderer();
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0px';
        this.labelRenderer.domElement.style.pointerEvents = 'none';
        document.body.appendChild(this.labelRenderer.domElement);
    }

    initControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 5;
    }

    initAxis() {
        this.axesHelper = new THREE.AxesHelper(this.axisLength);
        this.scene.add(this.axesHelper);
        this.axisLabels[0] = this.createLabel("x", new THREE.Vector3(this.axisLength, 0.0, 0.0), {class:'axis'});
        this.axisLabels[1] = this.createLabel("y", new THREE.Vector3(0.0, this.axisLength, 0.0), {class:'axis'});
        this.axisLabels[2] = this.createLabel("z", new THREE.Vector3(0.0, 0.0, this.axisLength), {class:'axis'});
    }

    createLabel(text, position, config={}) {
        const div = document.createElement('div');
        div.className = 'label';
        if(config.class) div.classList.add(config.class);
        div.style.color = config.color || 'white';
        if(katex){
            katex.render(text, div, {
                displayMode: true,
                output: this.katexOutput,
                throwOnError: true,
                trust: true
            });
        } else {
            div.textContent = text;
        }
        const label = new THREE.CSS2DObject(div);
        label.position.copy(position);
        this.scene.add(label);
        return label;
    }

    animate() {
        // This is for custom animations.
    }

    initAnimation() {
        const animate = ()=>{
            requestAnimationFrame(animate);
            this.animate();
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
            this.labelRenderer.render(this.scene, this.camera);
        }
        animate();
    }
}

Grapher.prototype.addPoints = function(pos, config={color: 0xffffff, size: 0.0001}) {
    const geometry = new THREE.BufferGeometry();
    const positionAttribute = new THREE.Float32BufferAttribute(pos, 3);
    geometry.setAttribute('position', positionAttribute);
    const material = new THREE.PointsMaterial({
        color: config.color,
        size: config.size
    });
    const points = new THREE.Points(geometry, material);
    this.scene.add(points);
    return {geometry,points}
};

Grapher.prototype.addLine = function(pos_i, pos_f, config={color: 0xffffff, linewidth: 1}) {
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(pos_i[0], pos_i[1], pos_i[2]),
        new THREE.Vector3(pos_f[0], pos_f[1], pos_f[2])
    ]);
    const lineMaterial = new THREE.LineBasicMaterial({
        color: config.color,
        linewidth: config.linewidth
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    this.scene.add(line);
};

export default Grapher;