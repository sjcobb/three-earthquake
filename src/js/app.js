import Store from './Store.js';
import InstrumentMappings from './InstrumentMappings.js';
import { getInstrumentMappingTemplate, generateInstrMetadata, getInstrByInputNote } from './InstrumentMappings.js';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import Light from './Light.js';
import Physics from './Physics.js';
import Stats from 'stats.js';

/***
 *** SCENE SETUP ***
 * Tone.js: v13.8.4 *
 * Three.js: v97 *
 * TODO: update to most recent of both libs
 ***/

if (Store.view.showStats === true) {
    var stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );
}

const instrument = new InstrumentMappings();

Store.instr = getInstrumentMappingTemplate();

/*** 
 *** 3D ENVIRONMENT ***
 ***/

Store.scene.background = new THREE.Color(0, 0, 0);

Store.camera.position.set(0, 16, 26); 
Store.camera.lookAt(new THREE.Vector3(0, -2.5, 0)); // v0.5

if (Store.view.cameraPositionBehind === true) {
    Store.camera.position.set(Store.view.posBehindX, Store.view.posBehindY, Store.view.posBehindZ);
    // Store.camera.lookAt(new THREE.Vector3(Store.dropPosX, 1, Store.view.posBehindZ));
    // Store.camera.lookAt(new THREE.Vector3(Store.dropPosX, 12, Store.view.posBehindZ));
    Store.camera.lookAt(new THREE.Vector3(Store.dropPosX, 2, Store.view.posBehindZ));
}

if (Store.cameraLookUp === true) {
    Store.camera.lookAt(new THREE.Vector3(Store.dropPosX - 5, 100, Store.view.posBehindZ));
}

if (Store.view.showStaff.treble === true && Store.view.showStaff.bass === true) {
    Store.camera.position.z = 0;
    Store.view.posBehindX -= 10;
}

Store.renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(Store.renderer.domElement);
Store.renderer.domElement.id = 'canvas-scene-primary';

// https://stackoverflow.com/a/16177178/7639084
// Store.renderer.setClearColor(0xffffff, 0); // no effect

////////////////
// BACKGROUND //
////////////////
// Store.scene.background = new THREE.Color( 0xff0000 ); // red
// Store.scene.background = new THREE.Color( 0x00b140 ); // green screen
// Store.scene.background = new THREE.Color( 0x0047bb ); // blue screen

// update viewport on resize
window.addEventListener('resize', function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    Store.renderer.setSize(width, height);
    Store.camera.aspect = width / height; //aspect ratio
    Store.camera.updateProjectionMatrix();
});

// CONTROLS: https://threejs.org/examples/#misc_controls_fly
Store.controls = new FlyControls(Store.camera);
Store.controls.movementSpeed = 1; //prev: 10
Store.controls.domElement = Store.renderer.domElement;
Store.controls.rollSpeed = Math.PI / 40;
Store.controls.autoForward = false;
Store.controls.dragToLook = true;

//*** LOADER ***
Store.loader = new THREE.TextureLoader();

const light = new Light();
light.addLights(Store.renderer);

const physics = new Physics();
physics.initPhysics();

//-----GEOMETRY VARIABLES------//
let box = new THREE.BoxGeometry(1, 1, 1);
let sphere = new THREE.SphereGeometry(0.5, 32, 32);
let torus = new THREE.TorusGeometry(0.5, 0.25, 32, 32, 2 * Math.PI);

//-----MATERIAL VARIABLES------//
let phong = new THREE.MeshPhongMaterial({
    color: 'pink',
    emissive: 0,
    specular: 0x070707,
    shininess: 100
});
let basic = new THREE.MeshBasicMaterial({
    color: 'pink'
});
let lambert = new THREE.MeshPhongMaterial({
    color: 'pink',
    reflectivity: 0.5,
    refractionRatio: 1
});

//-----OBJ FUNCTIONALITY------//
//make the objects and add them to the scene
let currentShape, currentMesh;
currentShape = box;
currentMesh = phong;
const objCenter = new THREE.Mesh(currentShape, currentMesh);
objCenter.position.set(0, 0, Store.view.posBehindZ);
// Store.scene.add(objCenter); //for absolute center reference

//-----SKYBOX (LOAD TEXTURES)------//
// https://github.com/hghazni/Three.js-Skybox/blob/master/js/script.js#L35
// assets: http://www.custommapmakers.org/skyboxes.php

const globalSkyboxTheme = 'nightsky';
// const globalSkyboxTheme = 'hills'; //blurry
// const globalSkyboxTheme = 'island'; //only unsupported .tga currently
// const globalSkyboxTheme = 'bluefreeze';
// const globalSkyboxTheme = 'mercury';

var skyboxGeometry = new THREE.CubeGeometry(1800, 1800, 1800);

var cubeMaterials = [
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(`assets/skybox/${globalSkyboxTheme}/ft.png`), side: THREE.DoubleSide }), //front side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(`assets/skybox/${globalSkyboxTheme}/bk.png`), side: THREE.DoubleSide }), //back side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(`assets/skybox/${globalSkyboxTheme}/up.png`), side: THREE.DoubleSide }), //up side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(`assets/skybox/${globalSkyboxTheme}/dn.png`), side: THREE.DoubleSide }), //down side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(`assets/skybox/${globalSkyboxTheme}/rt.png`), side: THREE.DoubleSide }), //right side
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(`assets/skybox/${globalSkyboxTheme}/lf.png`), side: THREE.DoubleSide }) //left side
];

var cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);
var skyboxCubeMesh = new THREE.Mesh(skyboxGeometry, cubeMaterial); //nightsky skybox

if (Store.view.skybox === true) {
    Store.scene.add(skyboxCubeMesh); //add nightsky skybox
}

//-----MUSIC STAFF------//
function addStaffLines(color = 0x000000, offset, posXstart, posXend, posY, posZ, innerLinePadding, dashedLines = false, middleC = false) {
    const origOffset = offset;
    let staffLineMaterial;
    for (let i = 0; i < 5; i++) {

        offset = origOffset;
        if (i === 0 && middleC === true) {
            offset += 20;
        }

        const staffLineGeo = new THREE.Geometry();
        const zCoord = (posZ + (innerLinePadding * i) + offset);
        staffLineGeo.vertices.push(
            new THREE.Vector3(posXstart, posY, zCoord),
            new THREE.Vector3(posXend, posY, zCoord)
        );
        if (i % 2) {
            staffLineMaterial = new THREE.LineBasicMaterial({
                color: color,
                // color: 0x0000ff, //blue (every other)
                linewidth: 2000, //no effect
            });
        } else {
            staffLineMaterial = new THREE.LineBasicMaterial({
                color: color,
                linewidth: 2000,
                // opacity: 0.1, //no effect
            });
        }
        let staffLine = new THREE.Line(staffLineGeo, staffLineMaterial);
        if (dashedLines === true) {
            // if (i <= 1) {
            if (i === 0 && middleC === true) {
                staffLine = new THREE.Line(staffLineGeo, new THREE.LineDashedMaterial( { color: 0xffffff, dashSize: 1, gapSize: 5 } )); // blue: 0x0000ff
                staffLine.computeLineDistances();
            } else if (i === 3 || i === 4) {
                staffLine = new THREE.Line(staffLineGeo, new THREE.LineDashedMaterial( { color: 0xffffff, dashSize: 1, gapSize: 5 } )); // blue: 0x0000ff
                staffLine.computeLineDistances();
            } else {
                staffLine = new THREE.Line(); // empty line
            }
        }
        Store.scene.add(staffLine);
    }
}

const staffLineLengthEnd = 8000;
const lineYHeight = -0.95;
if (Store.view.showStaff.treble === true) {
    addStaffLines(0xffffff, -10, -1000, staffLineLengthEnd, lineYHeight, 0, 2);
    addStaffLines(0xffffff, -20, -1000, staffLineLengthEnd, lineYHeight, 0, 2, true, true); // two dashed lines above treble clef
}
if (Store.view.showStaff.bass === true) {
    addStaffLines(0xffffff, 2, -1000, staffLineLengthEnd, lineYHeight, 0, 2);
}

Store.screenShake = physics.screenShake();

//-----ANIMATION------//
let animate = () => {

    if (Store.view.showStats === true) {
        stats.begin();
    }

    var delta = Store.clock.getDelta();
    // console.log('delta: ', delta); //hundreths
    // TODO: fix logs - why not updating correctly?
    // console.log('ticks: ', Tone.Transport.ticks); //ex. 10 
    // console.log('position: ', Tone.Transport.position); //ex: 0:0:0.124
    // console.log('seconds: ', Tone.Transport.seconds);
    // console.log(Store.ticks);
    // console.log(Store.clock.elapsedTime);

    if (Store.autoScroll === true) {
        // const ticksMultiplier = 12; // v0.5
        const ticksMultiplier = 12;
        Store.ticks += (delta * ticksMultiplier); // Too fast, balls dropped too far left
        if (Store.view.cameraPositionBehind === true) {
            if (Store.view.cameraAutoStart === true) {
                Store.camera.position.x = Store.view.posBehindX + (Store.ticks);
            }
        } else {
            Store.camera.position.x = (Store.ticks) - 35;
        }
    }

    if (Store.cameraShakeEnabled === true) {
        // https://github.com/felixmariotto/three-screenshake
        Store.screenShake.update(Store.camera);
    }

    physics.updateBodies(Store.world);
    Store.world.step(Store.fixedTimeStep);

    Store.controls.update(delta);

    Store.renderer.render(Store.scene, Store.camera);

    if (Store.view.showStats === true) {
        stats.end();
    }

    requestAnimationFrame(animate);

};

window.onload = () => {
    //-----KEYBOARD MAPPING------//

    document.addEventListener('keydown', (event) => {
        const keyName = event.key;

        if (keyName === 'Control') {
            // do not log when only Control key is pressed.
            return;
        }

        if (event.ctrlKey) {

        } else if (Store.currentNote.keydownPressed === false) {
            let keyMapped = instrument.getKeyboardMapping(keyName);
            switch (keyName) { 
                case ('z'):
                    // physics.addBody(true, Store.dropPosX, keyMapped);
                    // Store.dropPosX -= 1.3;
                    break;
                case(' '):
                    console.error('... SPACEBAR RESET -> polySynth.triggerRelease() ...');
                    if (Store.polySynth) {
                        console.log(Store.polySynth);
                        Store.polySynth.releaseAll();
                    } 
                default:
            }

            if (keyMapped !== undefined) {
                if (keyName === keyMapped.keyInput) {
                    physics.addBody(true, Store.dropPosX, keyMapped);
                } else {}
            }
        }
    }, false);

    animate();

    if (Store.view.showDashboard === true) {
        setTimeout(() => {
            createCharts(false);
        }, 3000);
    }

};

/* 
 * MUSIC VISUALIZATION DASHBOARD
 */

function initDashboardData() {
    for (var key in Store.instr) {
        if (Store.instr.hasOwnProperty(key)) {
            const currentInstr = Store.instr[key];
            // console.log({currentInstr});
            if (currentInstr.note && currentInstr.octave) {
                Store.dashboard.instrData.push(currentInstr.note + currentInstr.octave);
            }
        }
    }
} 

function updateDashboardData() {
    createCharts(true);
}

function createCharts(showGrid = false) {

    Store.dashboard.chart = echarts.init(document.getElementById('chart'), 'shine');
    // Store.dashboard.chart = echarts.init(document.getElementById('chart'), 'dark');
    // Store.dashboard.chart = echarts.init(document.getElementById('chart'), 'vintage');
    // Store.dashboard.chart = echarts.init(document.getElementById('chart'), 'macarons');

    const option = {
        title: {
            // text: 'Song Stats'
        },
        // color: ['#fff000'],
        color: [
            '#FFFF00', // yellow
            // '#64b5f6', // human blue
            '#c12e34','#e6b600','#0098d9','#2b821d',
            '#005eaa','#339ca8','#cda819','#32a487'
        ],
        tooltip: {
            show: false
        },
        legend: {
            // data:['Note']
        },
        // https://www.echartsjs.com/en/option-gl.html#grid3D
        // https://echarts.apache.org/examples/en/editor.html?c=bar3d-punch-card&gl=1
        grid3D: {
            // show: showGrid,
            show: true,
            top: 0,
            // right: 150,
            // bottom: 150,
            // left: 150,
            // boxWidth: 90,
            // boxHidth: 90,
            // boxDepth: 90,
            // boxWidth: 80,
            // boxDepth: 80,
            // width: '90%',
            // height: '90%',
            splitLine: {
                show: false,
            },
            // https://www.echartsjs.com/en/option-gl.html#grid3D.viewControl
            viewControl: {
                // projection: 'perspective', // default
                // projection: 'orthographic',
                // https://www.echartsjs.com/en/option-gl.html#grid3D.viewControl.autoRotate
                autoRotate: true, // false = default
                // autoRotateSpeed: 5,
                autoRotateSpeed: 12, // 10 = default
                autoRotateDirection: 'cw', // default is 'cw' means clockwise from top to bottom, can also use 'ccw' means counterclockwise from top to bottom
                // autoRotateAfterStill: 3,
                // damping: 0.8,
                // rotateSensitivity: 1,
                // zoomSensitivity: 1,
                // orthographicSize: 200,
                // maxOrthographicSize: 200,
                // maxDistance: 400,
                // alpha: 90, // view from top
                alpha: 15,
                // beta: 20,
                distance: 250,
                // distance: 800,
            },
            light: {
                main: {
                    // shadow: true,
                    // intensity: 1.5,
                    // quality: 'ultra',
                },
                // https://www.echartsjs.com/en/option-gl.html#grid3D.light.ambient
                ambient: {
                    // intensity: 0.8, // 0.2 = default
                }
            },
            // https://www.echartsjs.com/en/option-gl.html#grid3D.environment
            // environment: 'asset/starfield.jpg'
            //https://www.echartsjs.com/en/option-gl.html#grid3D.postEffect.colorCorrection
            // postEffect: {
            //     enable: true,
            //     colorCorrection {}
            // }
        },
        // visualMap: {
        //     max: 20,
        //     inRange: {
        //         color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        //     }
        // },
        // https://www.echartsjs.com/en/option-gl.html#yAxis3D
        yAxis3D: {
            show: true,
            type: 'category',
            name: 'Note',
            nameGap: 25,
            nameTextStyle: {
                color: '#fff',
                fontFamily: 'Verdana',
            },
            axisLabel: {
                interval: 0,
                // margin = 8
                fontFamily: 'Verdana',
                textStyle: {
                    color: '#fff',
                },
            },
            // data: Store.dashboard.instrData,
            // data: Store.dashboard.noteCountsDataset.source.note,
        },
        xAxis3D: {
            show: true,
            type: 'category',
            // name: 'Player',
            // name: 'TBD',
            name: 'Octave',
            nameGap: 25,
            nameTextStyle: {
                color: '#fff',
                fontFamily: 'Verdana',
            },
            axisLabel: {
                interval: 0,
                fontFamily: 'Verdana',
                textStyle: {
                    color: '#fff',
                },
            },
            // data: Store.dashboard.noteCountsDataset.source.noteCount,
        },
        zAxis3D: {
            show: false,
            type: 'value',
            name: '',
            nameGap: 20,
            nameTextStyle: {
                color: '#fff',
                fontFamily: 'Verdana',
            },
            axisLine: {
                // show: false,
                lineStyle: {
                    opacity: 0,
                }
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                show: false,
                fontFamily: 'Verdana',
                textStyle: {
                    color: '#fff',
                },
            },
        },
        series: [
            {
                // type: 'bar',
                type: 'bar3D',
                // shading: 'lambert',
                label: {
                    formatter: (value) => {
                        // console.log(value);
                        return value.data.count;
                    }
                },
                encode: {
                    // x: 0,
                    // y: 1,
                    // z: 1,
                    // label: 'note',
                    y: 'note',
                    x: 'octave',
                    // y: 'time',
                    // z: 'noteCount',
                    // z: 'octaveCount',
                    z: 'count',
                    // tooltip: [0, 1, 2, 3, 4]
                },
                itemStyle: {
                    // color: '#900',
                    // opacity: 0.90,
                    opacity: 0.87,
                }
                // data: Store.dashboard.allPlayedNotes,
                // dimensions: Store.dashboard.instrData,
            },
            // { type: 'bar' },
            // {
            //     type: 'line', 
            //     smooth: true, 
            //     seriesLayoutBy: 'row',
            //     //seriesLayoutBy: 'column',
            // },
            // {
            //     type: 'line', 
            //     smooth: true, 
            //     seriesLayoutBy: 'row',
            //     //seriesLayoutBy: 'column',
            // },
            // {
            //     name: 'Note',
            //     type: 'bar',
            //     // data: [5, 20, 36, 10, 10, 20],
            //     seriesLayoutBy: 'row',
            //     // seriesLayoutBy: 'column',
            // },
            // {
            //     type: 'pie',
            //     radius: '30%',
            //     center: ['50%', '25%'],
            //     label: {
            //         formatter: '{b}: {@2012} ({d}%)'
            //     },
            //     encode: {
            //         itemName: 'product',
            //         value: '2012',
            //         // tooltip: '2012'
            //     }
            // }
        ],
        dataset: {
            source: Store.dashboard.noteCountsArr,
            dimensions: ['note', 'octave', 'count'],
            // imensions: ['note', 'noteCount', 'octave', 'octaveCount', 'time'],
        },
    };

    // console.log({option});
    Store.dashboard.chart.setOption(option);
}

// const addDashboard3D = (params={}) => {
function addDashboard3D(params={}) {

    // const chartId = document.getElementById('chart');
    // const chartId = echarts.init(document.getElementById('chart');
    const chartSelector = Store.dashboard.chart;

    // https://threejs.org/docs/#api/en/geometries/BoxGeometry
    // const chartGeometry = new THREE.SphereGeometry(1, 250, 250);
    const chartGeometry = new THREE.BoxGeometry(1, 15, 15);

    // https://threejs.org/docs/#api/en/materials/MeshBasicMaterial
    const vizMesh = new THREE.Mesh(chartGeometry, new THREE.MeshBasicMaterial(
        { 
            map: getChartTexture(chartSelector),
            // map: getChartTexture(myChart),
            // color: 0x00ff00,
            // color: 0x00008b,
            // color: 0xefefef,
            color: 0xffffff,
        }
    ));

    // vizMesh.scale.set(2, 2, 2);
    vizMesh.position.set(0, 10, -25);
    Store.scene.add(vizMesh);
}

// const getChartTexture = (chart) => {
function getChartTexture(chart) {
    // https://stackoverflow.com/questions/37755406/load-textures-from-base64-in-three-js
    // http://bl.ocks.org/MAKIO135/eab7b74e85ed2be48eeb
    // https://dustinpfister.github.io/2018/04/17/threejs-canvas-texture/
    // https://threejsfundamentals.org/threejs/lessons/threejs-canvas-textures.html
    
    const canvasElement = document.querySelector('canvas');

    // https://echarts.apache.org/en/api.html#echartsInstance.getDataURL
    var img = new Image();
    img.src = chart.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff'
    });

    // https://threejs.org/docs/#api/en/textures/Texture
    // https://threejs.org/docs/#api/en/textures/CanvasTexture
    const canvasTexture = new THREE.CanvasTexture(canvasElement); // same as texture.needsUpdate = true;
    // canvasTexture.repeat.set(4, 4);
    // https://threejs.org/docs/#api/en/textures/Texture.rotation
    // https://threejs.org/docs/#api/en/textures/Texture.flipY
    // https://threejs.org/docs/#api/en/textures/Texture.clone
    // https://threejs.org/docs/#api/en/textures/Texture.dispose

    return canvasTexture;
}

if (Store.view.showDashboard === true) {
    initDashboardData();

    setInterval(() => {
        if (Store.dashboard.allPlayedNotes.length !== Store.dashboard.lastNoteLength) {
            updateDashboardData();
            Store.dashboard.lastNoteLength = Store.dashboard.recentPlayedNotes.length;
            // addDashboard3D();
        }
    }, 100);

}