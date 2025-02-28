import Grapher from "./Grapher.js";
const grapher = new Grapher({gui: true, guiWidth: 220});

function generateRandomPoint(radius, Num) {
    const positionArray = [];
    for (let i = 0; i < Num; i++) {
        const randX = Math.random() * 2 - 1;
        const randY = Math.random() * 2 - 1;
        const randZ = Math.random() * 2 - 1;

        const theta = Math.acos(randZ);
        const phi   = Math.random()*2.0*Math.PI;

        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(theta);

        positionArray.push(x, y, z);
    }
    return positionArray;
}
const R = 1.0;
var N = 1e5;
var positions = generateRandomPoint(R,N);
var {geometry: pointGeometry, points} = grapher.addPoints(positions, {
    color: 0xffffff, size: 0.00001
});

// ----------------------------------------------------------------

const params = {
    showAxes: true,
    radius: 1.0,
    numberOfPoints: N,
};

grapher.gui.add(params, 'showAxes').name("Axes").onChange(value => {
    grapher.axesHelper.visible = value;
    grapher.axisLabels.forEach(label => label.visible = value);
});

grapher.gui.add(params, 'radius', 0.1, 2, 0.01).name("radius").onChange(value => {
    positions.forEach((pos, i) => {
        pointGeometry.attributes.position.array[i] = pos * value / R;
    });
    pointGeometry.attributes.position.needsUpdate = true;
});

grapher.gui.add(params, 'numberOfPoints', 10, 200000, 1).name("N").onChange(value => {
    if (points) grapher.scene.remove(points);
    N = Math.floor(value);
    positions = generateRandomPoint(R,N);
    const size = Math.min(0.05, 100/N);
    const pointsDetails = grapher.addPoints(positions, {color: 0xffffff, size: size});
    pointGeometry = pointsDetails.geometry;
    points = pointsDetails.points;
});















