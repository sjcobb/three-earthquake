import Tone from 'Tone';
import { Transport, Player, Players, Part, Time, Volume } from 'Tone';

import { generateInstrMetadata } from './InstrumentMappings.js';

// import Transport from 'Tone/core/Transport';
// import Volume from 'Tone/component/Volume';

import Store from './Store.js';

import InstrumentMappings from './InstrumentMappings.js';
import { getInstrByNote } from './InstrumentMappings.js';

import Physics from './Physics.js';
import Flame from './Flame.js';

//-----TONE------//
// Tone.Transport.bpm.value = 200; //PREV
// Tone.Transport.bpm.value = 120;
Tone.Transport.bpm.value = Store.bpm;
// Tone.Transport.bpm.rampTo(120, 10);

// https://tonejs.github.io/docs/r13/Transport#timesignature
// Tone.Transport.timeSignature = 12; // v0.4, v0.5
Tone.Transport.timeSignature = 20;

// Tone.Transport.timeSignature = 4;     // DEFAULT

// Tone.Transport.setLoopPoints(0, "13m"); //starts over at beginning
// Tone.Transport.loop = true; //TODO: *** clear all addBody objects if Transport loop true

//-----SYNTH ASSETS------//
// https://tonejs.github.io/examples/polySynth.html
// https://tonejs.github.io/docs/13.8.25/PolySynth

// var polySynth = new Tone.PolySynth(6, Tone.Synth, {
// Store.polySynth = new Tone.PolySynth(4, Tone.Synth, { // default
Store.polySynth = new Tone.PolySynth(10, Tone.Synth, {
    // oscillator: {
    //     type: "triangle", // sine, square, sawtooth, triangle (default), custom
    //     // frequency: 440 ,
    //     // detune: 0 ,
    //     // phase: 0 ,
    //     // partials: [] ,
    //    partialCount: 0
    // },
    // // https://tonejs.github.io/docs/13.8.25/Envelope
    envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 1,
        // attack: 0.1,
        // decay: 0.2,
        // sustain: 1, // v0.5
        // sustain: 0.5, 
        // release: 0.8,
    },
    // // https://tonejs.github.io/docs/13.8.25/Filter#type
    // filter: {
	// 	// type: "highpass", // lowpass, highpass, bandpass, lowshelf, highshelf, notch, allpass, peaking
	// },
}).toMaster();

Store.polySynth.volume.value = -8; // v0.4, v0.5
// Store.polySynth.volume.value = -24;

// Store.polySynth.set("detune", +1200); // octave = 12 semitones of 100 cents each
// Store.polySynth.set("detune", +1200);

const bounceSynth = new Tone.Synth();
bounceSynth.volume.value = 2;
bounceSynth.toMaster();

var toneSnare = new Tone.NoiseSynth({
    "volume": -5.0,
    "envelope": {
        "attack": 0.001,
        "decay": 0.2,
        "sustain": 0
    },
    "filterEnvelope": {
        "attack": 0.001,
        "decay": 0.1,
        "sustain": 0
    }
}).toMaster();

// const player808HiHat = new Player(`${sampleBaseUrl}/808-hihat-vh.mp3`).toMaster();
// const playerHiHatOpen = new Tone.Player("./assets/sounds/drum-kits/dubstep/hihat-open.mp3").toMaster(); //PREV
const playerHiHatOpen = new Player("./assets/sounds/drum-kits/dubstep/hihat-open.mp3").toMaster();
const playerHiHat = new Player("./assets/sounds/drum-kits/dubstep/hihat-closed.mp3").toMaster();
playerHiHatOpen.volume.value = -2;
playerHiHat.volume.value = -2;

// const playerKick = new Player("./assets/sounds/drum-kits/analog/kick.mp3").toMaster(); //aka dubstep - 808?
// const playerKick = new Player("./assets/sounds/drum-kits/dubstep/kick.mp3").toMaster(); //aka analog - PREV
// const playerKick = new Player("./assets/sounds/drum-kits/electronic/kick.mp3").toMaster(); //guitar pluck
// const playerKick = new Player("./assets/sounds/drum-kits/percussion/kick.mp3").toMaster(); //normal

// const playerKick = new Player("./assets/sounds/drum-kits/808/808-kick-vh.mp3").toMaster(); // high
// const playerKick = new Player("./assets/sounds/drum-kits/808/808-kick-vm.mp3").toMaster(); // medium
// const playerKick = new Player("./assets/sounds/drum-kits/808/808-kick-vl.mp3").toMaster(); // low

// console.log('Store.assets.kick: ', Store.assets.kick);
const playerKick = new Player(Store.assets.kick).toMaster();

// const playerKick = new Player("./assets/sounds/drum-kits/hiphop/kick.mp3").toMaster(); //v2, v3, v4 (boring, but not distorted)
// playerKick.volume.value = +2; // v0.5
playerKick.volume.value = -6; // v0.6
// playerKick.volume.value = +2;
// playerKick.volume.value = -20;

// playerKick.volume.value = -6; // -6 broken
// playerKick.input.value = -4; //err
// {
//     onload: Tone.noOp ,
//     playbackRate: 1 ,
//     loop: false ,
//     autostart: false ,
//     loopStart: 0 ,
//     loopEnd: 0 ,
//     reverse: false ,
//     fadeIn: 0 ,
//     fadeOut: 0
// }

// console.log({playerKick});

const playerKickSecondary = new Player(Store.assets.kick).toMaster();
// const playerKickSecondary = new Player("./assets/sounds/drum-kits/electronic/tom-high.mp3").toMaster();
playerKickSecondary.volume.value = -6;

// input: AudioParam {value: 1, automationRate: "a-rate", defaultValue: 1, minValue: -3.4028234663852886e+38, maxValue: 3.4028234663852886e+38}

const playerCrash = new Player("./assets/sounds/drum-kits/hiphop/clap.mp3").toMaster(); //hand clap echo
// const playerCrash = new Player("./assets/sounds/drum-kits/percussion/clap.mp3").toMaster(); //stick click

// const playerRide = new Player("./assets/sounds/drum-kits/dubstep/ride.wav").toMaster(); //drum stick click
const playerRide = new Player("./assets/sounds/drum-kits/hiphop/ride.mp3").toMaster(); //cool click pop
// const playerRide = new Player("./assets/sounds/drum-kits/electronic/ride.mp3").toMaster(); //high tick metal
// const playerRide = new Player("./assets/sounds/drum-kits/percussion/ride.mp3").toMaster(); //weird low squeak 
// const playerRide = new Player("./assets/sounds/drum-kits/analog/ride.mp3").toMaster(); // drum stick click

const playerTomHigh = new Player("./assets/sounds/drum-kits/electronic/tom-high.mp3").toMaster();
const playerTomMid = new Player("./assets/sounds/drum-kits/electronic/tom-mid.mp3").toMaster();
// const playerTomLow = new Player("./assets/sounds/drum-kits/electronic/tom-low.mp3").toMaster();

// let flameFirst = new Flame();

export default class Trigger {
    constructor() {
        // super();
    }
    
    triggerNote(obj) {
        // console.log({obj});
        // console.log(obj.userData.opts);

        const physics = new Physics();

        const instrument = new InstrumentMappings();

        Store.musicActive = true; //remove?

        // console.log('Store.inputMidi: ', Store.inputMidi);
        if (Store.inputMidi === true) {

        } else {

        }
        // console.log('Trigger -> addBody - opts: ', obj.userData.opts);
        
        let triggerObj = {};
        let combinedNote = 'C1';
        if (obj.userData.opts.type !== 'drum') {
            combinedNote = obj.userData.opts.note ? (obj.userData.opts.note + obj.userData.opts.octave) : 'C4';
            // console.log({combinedNote});

            Store.dashboard.lastNote = combinedNote;

            Store.dashboard.allPlayedNotes.push(combinedNote);
            // Store.dashboard.allPlayedNotes.push(obj.userData.opts.note);
            // Store.dashboard.allPlayedOctaves.push(obj.userData.opts.octave);
            // // Store.dashboard.noteCountsDataset.source.note.push(obj.userData.opts.note);
            // // Store.dashboard.noteCountsDataset.source.octave.push(obj.userData.opts.octave);

            // const noteDatum = {

            // };
            // Store.dashboard.noteCounts.push(
            //     {
            //         note: obj.userData.opts.note,
            //         octave: obj.userData.opts.octave,
            //         count: 1
            //     }
            // )

            // if (Store.instr[obj.userData.opts.objName].count != null) {
            //     Store.instr[obj.userData.opts.objName].count++;
            // } else {
            //     Store.instr[obj.userData.opts.objName].count = 1;
            // }

            if (Store.dashboard.noteCountsObj[combinedNote] != null) {
                Store.dashboard.noteCountsObj[combinedNote].count++;
            } else {
                Store.dashboard.noteCountsObj[combinedNote] = {
                    note: obj.userData.opts.note,
                    octave: obj.userData.opts.octave,
                    count: 1,
                };
                // Store.dashboard.noteCountsObj[combinedNote].count = 1;
            }
            // console.log(Object.entries(Store.dashboard.noteCountsObj));
            // Store.dashboard.noteCountsArr = Object.entries(Store.dashboard.noteCountsObj);

            Store.dashboard.noteCountsArr = [];
            for (let key in Store.dashboard.noteCountsObj){
                // console.log({key});
                Store.dashboard.noteCountsArr.push(Store.dashboard.noteCountsObj[key]);
            }

            // https://stackoverflow.com/a/8900824/7639084
            Store.dashboard.noteCountsArr.sort(function(a, b) {
                // console.log(a, b);
                var textA = a.note.toUpperCase();
                var textB = b.note.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            // console.log('triggerNote -> Store.dashboard.allPlayedNotes: ', Store.dashboard.allPlayedNotes);

            Store.dashboard.recentPlayedNotes.push(combinedNote);
            // console.log('triggerNote -> Store.dashboard.recentPlayedNotes: ', Store.dashboard.recentPlayedNotes);

            triggerObj = obj.userData.opts;

        } else {
            triggerObj = instrument.getNoteMapping(obj); //ORIG
        }
        
        // console.log('Trigger -> combinedNote: ', combinedNote);
        let drumIndex = 0;
        if (triggerObj.type === 'drum') {
            if (triggerObj.variation === 'kick') {
                // console.log('trigger -> playerKick: ', playerKick);
                playerKick.start();
                // toneKick.triggerAttackRelease("C2"); //deep
            } else if (triggerObj.variation === 'kick-sec') {
                playerKickSecondary.start();
            } else if (triggerObj.variation === 'hihat') {
                playerHiHat.start();
            } else if (triggerObj.variation === 'hihat-open') {
                playerHiHatOpen.start();
            } else if (triggerObj.variation === 'snare') {
                toneSnare.triggerAttackRelease();
            } else if (triggerObj.variation === 'crash') {
                playerCrash.start();
                // toneCrash.triggerAttackRelease("C4"); //laser
            } else if (triggerObj.variation === 'ride') {
                playerRide.start();
            } else if (triggerObj.variation === 'tom-high') {
                playerTomHigh.start(); // key: 7
                // flameFirst.create(obj.initPosition);
            } else {
                // console.log('UNDEF variation - triggerNote() -> triggerObj (drum): ', triggerObj);
                playerHiHat.start();
            }
            drumIndex++;
        } else if (triggerObj.type === 'chord') { // TODO: rename, universal chord / note accessor
            // console.log('triggerNote (chord) -> combinedNote: ', combinedNote);
            // console.log('triggerNote (chord) -> triggerObj: ', triggerObj);

            // console.log('triggerNote (chord) -> obj.userData.opts.duration: ', obj.userData.opts.duration);
            const noteLength = obj.userData.opts.duration ? obj.userData.opts.duration : 0.15;
            Store.polySynth.triggerAttackRelease(combinedNote, noteLength);
        } else {
            bounceSynth.triggerAttackRelease(combinedNote, "8n");
            // console.log('triggerNote -> ballDesc: ', triggerObj.ballDesc, ', note: ', combinedNote);
        }

        Store.musicActive = false; //remove?

        if (Store.configColorAnimate === true && triggerObj.color) {
            // console.log("configColorAnimate -> GLOBALS: ", globals);
            if (triggerObj.type !== 'drum') {
                Store.activeInstrColor = triggerObj.color;
            }
        }
    }

}



//-----RECORDING------//
// https://codepen.io/gregh/project/editor/aAexRX

const physics = new Physics();

// const recordingNotes = Store.dashboard.midiConvertData.source;

// const recordingNotes = [{"duration":0.8,"name":"A#4","time":0,"velocity":1},{"duration":0.08333333333333326,"name":"A#4","time":1.0666666666666667,"velocity":1},{"duration":0.08749999999999991,"name":"A#4","time":1.2,"velocity":1},{"duration":0.08916666666666662,"name":"A#4","time":1.3291666666666666,"velocity":1},{"duration":0.08333333333333326,"name":"A#4","time":1.4666666666666666,"velocity":1},{"duration":0.12916666666666665,"name":"A#4","time":1.5999999999999999,"velocity":1},{"duration":0.08333333333333326,"name":"G#4","time":1.8666666666666665,"velocity":1},{"duration":0.5333333333333334,"name":"A#4","time":1.9999999999999998,"velocity":1},{"duration":0.08333333333333348,"name":"A#4","time":2.6666666666666665,"velocity":1},{"duration":0.08749999999999991,"name":"A#4","time":2.8,"velocity":1},{"duration":0.08916666666666684,"name":"A#4","time":2.9291666666666663,"velocity":1},{"duration":0.08333333333333348,"name":"A#4","time":3.0666666666666664,"velocity":1},{"duration":0.12916666666666687,"name":"A#4","time":3.1999999999999997,"velocity":1},{"duration":0.08333333333333348,"name":"G#4","time":3.466666666666667,"velocity":1},{"duration":0.5958333333333337,"name":"A#4","time":3.6,"velocity":1},{"duration":0.08333333333333304,"name":"A#4","time":4.2666666666666675,"velocity":1},{"duration":0.08750000000000036,"name":"A#4","time":4.4,"velocity":1},{"duration":0.0891666666666664,"name":"A#4","time":4.529166666666668,"velocity":1},{"duration":0.08333333333333304,"name":"A#4","time":4.666666666666668,"velocity":1},{"duration":0.12916666666666643,"name":"A#4","time":4.800000000000001,"velocity":1},{"duration":0.0625,"name":"F4","time":5.000000000000001,"velocity":1},{"duration":0.0625,"name":"F4","time":5.1000000000000005,"velocity":1},{"duration":0.12916666666666643,"name":"F4","time":5.2,"velocity":1},{"duration":0.0625,"name":"F4","time":5.4,"velocity":1},{"duration":0.0625,"name":"F4","time":5.5,"velocity":1},{"duration":0.12916666666666643,"name":"F4","time":5.6,"velocity":1},{"duration":0.0625,"name":"F4","time":5.8,"velocity":1},{"duration":0.0625,"name":"F4","time":5.8999999999999995,"velocity":1},{"duration":0.12916666666666643,"name":"F4","time":5.999999999999999,"velocity":1},{"duration":0.12916666666666643,"name":"F4","time":6.199999999999999,"velocity":1},{"duration":0.2625000000000002,"name":"A#4","time":6.3999999999999995,"velocity":1},{"duration":0.1299999999999999,"name":"D4","time":6.8,"velocity":0.8661417322834646},{"duration":0.13416666666666632,"name":"D4","time":6.93,"velocity":0.8661417322834646},{"duration":0.13333333333333375,"name":"C4","time":7.066666666666666,"velocity":0.8661417322834646},{"duration":0.2999999999999998,"name":"D4","time":7.2,"velocity":0.8661417322834646},{"duration":0.09999999999999964,"name":"A#4","time":7.5,"velocity":1},{"duration":0.09166666666666679,"name":"A#4","time":7.6,"velocity":1},{"duration":0.09166666666666679,"name":"C5","time":7.7,"velocity":1},{"duration":0.09166666666666679,"name":"D5","time":7.800000000000001,"velocity":1},{"duration":0.09166666666666679,"name":"D#5","time":7.900000000000001,"velocity":1},{"duration":0.2916666666666661,"name":"F5","time":8.000000000000002,"velocity":1},{"duration":0.09166666666666679,"name":"A#4","time":8.3,"velocity":0.8661417322834646},{"duration":0.09166666666666679,"name":"A#4","time":8.4,"velocity":0.8661417322834646},{"duration":0.09166666666666679,"name":"C5","time":8.5,"velocity":0.8661417322834646},{"duration":0.09166666666666679,"name":"D5","time":8.6,"velocity":0.8661417322834646},{"duration":0.09166666666666679,"name":"D#5","time":8.7,"velocity":0.8661417322834646},{"duration":0.1999999999999993,"name":"F5","time":8.799999999999999,"velocity":0.8661417322834646},{"duration":0.1999999999999993,"name":"F5","time":8.999999999999998,"velocity":1},{"duration":0.12916666666666643,"name":"F5","time":9.199999999999998,"velocity":1},{"duration":0.1349999999999998,"name":"F#5","time":9.329166666666664,"velocity":1},{"duration":0.13333333333333286,"name":"G#5","time":9.466666666666663,"velocity":1},{"duration":0.2916666666666661,"name":"A#5","time":9.599999999999996,"velocity":1},{"duration":0.09166666666666679,"name":"F#4","time":9.899999999999995,"velocity":0.8661417322834646},{"duration":0.09166666666666679,"name":"F#4","time":9.999999999999995,"velocity":0.8661417322834646},{"duration":0.09166666666666679,"name":"G#4","time":10.099999999999994,"velocity":0.8661417322834646},{"duration":0.09166666666666679,"name":"A#4","time":10.199999999999994,"velocity":0.8661417322834646},{"duration":0.09166666666666679,"name":"C5","time":10.299999999999994,"velocity":0.8661417322834646},{"duration":0.19166666666666643,"name":"C#5","time":10.399999999999993,"velocity":0.8661417322834646},{"duration":0.13083333333333336,"name":"A#5","time":10.52916666666666,"velocity":1},{"duration":0.125,"name":"A#5","time":10.666666666666659,"velocity":1},{"duration":0.125,"name":"A#5","time":10.799999999999992,"velocity":1},{"duration":0.13083333333333336,"name":"G#5","time":10.929166666666658,"velocity":1},{"duration":0.125,"name":"F#5","time":11.066666666666658,"velocity":1},{"duration":0.12916666666666643,"name":"G#5","time":11.19999999999999,"velocity":1},{"duration":0.125,"name":"F#5","time":11.466666666666656,"velocity":1},{"duration":0.13000000000000078,"name":"G#4","time":11.599999999999989,"velocity":0.8661417322834646},{"duration":0.1341666666666672,"name":"G#4","time":11.72999999999999,"velocity":0.8661417322834646},{"duration":0.13333333333333286,"name":"F#4","time":11.866666666666656,"velocity":0.8661417322834646},{"duration":0.2666666666666675,"name":"G#4","time":11.99999999999999,"velocity":0.8661417322834646},{"duration":0.13333333333333286,"name":"G#4","time":12.266666666666657,"velocity":0.8661417322834646},{"duration":0.13000000000000078,"name":"G#4","time":12.39999999999999,"velocity":0.8661417322834646},{"duration":0.1341666666666672,"name":"F#4","time":12.52999999999999,"velocity":0.8661417322834646},{"duration":0.13333333333333286,"name":"G#4","time":12.666666666666657,"velocity":0.8661417322834646},{"duration":0.19166666666666643,"name":"D#5","time":12.79999999999999,"velocity":1},{"duration":0.09166666666666679,"name":"D#5","time":12.99999999999999,"velocity":1},{"duration":0.09166666666666679,"name":"F5","time":13.099999999999989,"velocity":1},{"duration":0.7999999999999989,"name":"F#5","time":13.199999999999989,"velocity":1},{"duration":0.09999999999999964,"name":"F#4","time":13.399999999999988,"velocity":0.8661417322834646},{"duration":0.09999999999999964,"name":"G#4","time":13.499999999999988,"velocity":0.8661417322834646},{"duration":0.40000000000000036,"name":"A#4","time":13.599999999999987,"velocity":0.8661417322834646},{"duration":0.1999999999999993,"name":"F5","time":13.999999999999988,"velocity":1},{"duration":0.1999999999999993,"name":"D#5","time":14.199999999999987,"velocity":1},{"duration":0.19166666666666643,"name":"C#5","time":14.399999999999986,"velocity":1},{"duration":0.09166666666666679,"name":"C#5","time":14.599999999999985,"velocity":1},{"duration":0.09166666666666679,"name":"D#5","time":14.699999999999985,"velocity":1},{"duration":0.7999999999999989,"name":"F5","time":14.799999999999985,"velocity":1},{"duration":0.09999999999999964,"name":"F4","time":14.999999999999984,"velocity":0.8661417322834646},{"duration":0.09999999999999964,"name":"F#4","time":15.099999999999984,"velocity":0.8661417322834646},{"duration":0.40000000000000036,"name":"G#4","time":15.199999999999983,"velocity":0.8661417322834646},{"duration":0.19166666666666643,"name":"D#5","time":15.599999999999984,"velocity":1},{"duration":0.19166666666666643,"name":"C#5","time":15.799999999999983,"velocity":1},{"duration":0.10000000000000142,"name":"C5","time":15.999999999999982,"velocity":1},{"duration":0.09166666666666501,"name":"C5","time":16.199999999999985,"velocity":1},{"duration":0.09166666666666501,"name":"D5","time":16.299999999999983,"velocity":1},{"duration":0.8000000000000043,"name":"E5","time":16.39999999999998,"velocity":1},{"duration":0.10000000000000142,"name":"E4","time":16.59999999999998,"velocity":0.8661417322834646},{"duration":0.10000000000000142,"name":"F4","time":16.69999999999998,"velocity":0.8661417322834646},{"duration":0.1999999999999993,"name":"G4","time":16.799999999999983,"velocity":0.8661417322834646},{"duration":0.10000000000000142,"name":"G4","time":16.999999999999982,"velocity":0.8661417322834646},{"duration":0.10000000000000142,"name":"A4","time":17.099999999999984,"velocity":0.8661417322834646},{"duration":0.3999999999999986,"name":"G5","time":17.199999999999985,"velocity":1},{"duration":0.1999999999999993,"name":"C5","time":17.399999999999984,"velocity":0.8661417322834646},{"duration":0.12916666666666643,"name":"F5","time":17.599999999999984,"velocity":1},{"duration":0.0625,"name":"F4","time":17.799999999999983,"velocity":1},{"duration":0.0625,"name":"F4","time":17.899999999999984,"velocity":1},{"duration":0.12916666666666643,"name":"F4","time":17.999999999999986,"velocity":1},{"duration":0.0625,"name":"F4","time":18.199999999999985,"velocity":1},{"duration":0.0625,"name":"F4","time":18.299999999999986,"velocity":1},{"duration":0.12916666666666643,"name":"F4","time":18.399999999999988,"velocity":1},{"duration":0.0625,"name":"F4","time":18.599999999999987,"velocity":1},{"duration":0.0625,"name":"F4","time":18.69999999999999,"velocity":1},{"duration":0.12916666666666643,"name":"F4","time":18.79999999999999,"velocity":1},{"duration":0.12916666666666643,"name":"F4","time":18.99999999999999,"velocity":1},{"duration":0.2624999999999993,"name":"A#4","time":19.19999999999999,"velocity":1},{"duration":0.129999999999999,"name":"D4","time":19.599999999999987,"velocity":0.7480314960629921},{"duration":0.13416666666666544,"name":"D4","time":19.729999999999986,"velocity":0.7480314960629921},{"duration":0.13333333333333286,"name":"C4","time":19.866666666666653,"velocity":0.7480314960629921},{"duration":0.3000000000000007,"name":"D4","time":19.999999999999986,"velocity":0.7480314960629921},{"duration":0.09166666666666501,"name":"A#4","time":20.299999999999986,"velocity":1},{"duration":0.09166666666666501,"name":"A#4","time":20.399999999999984,"velocity":1},{"duration":0.09166666666666501,"name":"C5","time":20.499999999999982,"velocity":1},{"duration":0.09166666666666501,"name":"D5","time":20.59999999999998,"velocity":1},{"duration":0.09166666666666501,"name":"D#5","time":20.699999999999978,"velocity":1},{"duration":0.29166666666666785,"name":"F5","time":20.799999999999976,"velocity":1},{"duration":0.09166666666666501,"name":"A#4","time":21.099999999999977,"velocity":0.8661417322834646},{"duration":0.09166666666666501,"name":"A#4","time":21.199999999999974,"velocity":0.8661417322834646},{"duration":0.09166666666666501,"name":"C5","time":21.299999999999972,"velocity":0.8661417322834646},{"duration":0.09166666666666501,"name":"D5","time":21.39999999999997,"velocity":0.8661417322834646},{"duration":0.09166666666666501,"name":"D#5","time":21.499999999999968,"velocity":0.8661417322834646},{"duration":0.19166666666666643,"name":"F5","time":21.599999999999966,"velocity":0.8661417322834646},{"duration":0.1999999999999993,"name":"F5","time":21.799999999999965,"velocity":1},{"duration":0.125,"name":"F5","time":21.999999999999964,"velocity":1},{"duration":0.13083333333333158,"name":"F#5","time":22.12916666666663,"velocity":1},{"duration":0.125,"name":"G#5","time":22.26666666666663,"velocity":1},{"duration":1.1916666666666664,"name":"A#5","time":22.399999999999963,"velocity":1},{"duration":0.3916666666666657,"name":"C#6","time":23.599999999999962,"velocity":1},{"duration":0.3999999999999986,"name":"C6","time":23.99999999999996,"velocity":1},{"duration":0.6625000000000014,"name":"A5","time":24.39999999999996,"velocity":1},{"duration":0.3916666666666657,"name":"F5","time":25.19999999999996,"velocity":1},{"duration":1.1999999999999993,"name":"F#5","time":25.59999999999996,"velocity":1},{"duration":0.3916666666666657,"name":"A#5","time":26.799999999999958,"velocity":1},{"duration":0.12916666666666643,"name":"F4","time":27.199999999999957,"velocity":1},{"duration":0.8000000000000007,"name":"F5","time":27.599999999999955,"velocity":1},{"duration":0.3916666666666657,"name":"F5","time":28.399999999999956,"velocity":1},{"duration":1.1999999999999993,"name":"F#5","time":28.799999999999955,"velocity":1},{"duration":0.3916666666666657,"name":"A#5","time":29.999999999999954,"velocity":1},{"duration":0.12916666666666643,"name":"F4","time":30.399999999999952,"velocity":1},{"duration":0.7916666666666679,"name":"F5","time":30.79999999999995,"velocity":1},{"duration":0.3999999999999986,"name":"D5","time":31.59999999999995,"velocity":1},{"duration":1.2000000000000028,"name":"D#5","time":31.99999999999995,"velocity":1},{"duration":0.3916666666666657,"name":"F#5","time":33.19999999999995,"velocity":1},{"duration":0.3999999999999986,"name":"F5","time":33.59999999999995,"velocity":1},{"duration":0.7916666666666643,"name":"C#5","time":33.99999999999995,"velocity":1},{"duration":0.3916666666666657,"name":"A#4","time":34.79999999999995,"velocity":1},{"duration":0.19166666666666998,"name":"C5","time":35.199999999999946,"velocity":1},{"duration":0.09166666666666856,"name":"C5","time":35.39999999999995,"velocity":1},{"duration":0.09166666666666856,"name":"D5","time":35.49999999999995,"velocity":1},{"duration":0.8000000000000114,"name":"E5","time":35.59999999999995,"velocity":1},{"duration":0.10000000000000142,"name":"E4","time":35.799999999999955,"velocity":0.8661417322834646},{"duration":0.10000000000000142,"name":"F4","time":35.899999999999956,"velocity":0.8661417322834646},{"duration":0.20000000000000284,"name":"G4","time":35.99999999999996,"velocity":0.8661417322834646},{"duration":0.10000000000000142,"name":"G4","time":36.19999999999996,"velocity":0.8661417322834646},{"duration":0.10000000000000142,"name":"A4","time":36.29999999999996,"velocity":0.8661417322834646},{"duration":0.20000000000000284,"name":"A#4","time":36.39999999999996,"velocity":0.8661417322834646},{"duration":0.20000000000000284,"name":"C5","time":36.599999999999966,"velocity":0.8661417322834646},{"duration":0.12916666666666998,"name":"F5","time":36.79999999999997,"velocity":1},{"duration":0.0625,"name":"F4","time":36.99999999999997,"velocity":1},{"duration":0.0625,"name":"F4","time":37.09999999999997,"velocity":1},{"duration":0.12916666666666998,"name":"F4","time":37.199999999999974,"velocity":1},{"duration":0.0625,"name":"F4","time":37.39999999999998,"velocity":1},{"duration":0.0625,"name":"F4","time":37.49999999999998,"velocity":1},{"duration":0.12916666666666998,"name":"F4","time":37.59999999999998,"velocity":1},{"duration":0.0625,"name":"F4","time":37.79999999999998,"velocity":1},{"duration":0.0625,"name":"F4","time":37.899999999999984,"velocity":1},{"duration":0.12916666666666998,"name":"F4","time":37.999999999999986,"velocity":1},{"duration":0.12916666666666998,"name":"F4","time":38.19999999999999,"velocity":1},{"duration":1.6000000000000014,"name":"A#4","time":38.39999999999999,"velocity":1}];

const recordingFirstNotes = [
    {
        "duration": 0.7494791666666667,
        "durationTicks": 1439,
        "midi": 54,
        "name": "F#3",
        "ticks": 351,
        "time": 0.1828125,
        "velocity": 0.49606299212598426
    },
    {
        "duration": 0.5427083333333332,
        "durationTicks": 1042,
        "midi": 57,
        "name": "A3",
        "ticks": 881,
        "time": 0.4588541666666667,
        "velocity": 0.5748031496062992
    },
    {
        "duration": 0.7463541666666668,
        "durationTicks": 1433,
        "midi": 64,
        "name": "E4",
        "ticks": 1842,
        "time": 0.959375,
        "velocity": 0.6771653543307087
    },
    {
        "duration": 0.6880208333333335,
        "durationTicks": 1321,
        "midi": 54,
        "name": "F#3",
        "ticks": 3491,
        "time": 1.8182291666666666,
        "velocity": 0.47244094488188976
    },
    {
        "duration": 0.41979166666666634,
        "durationTicks": 806,
        "midi": 57,
        "name": "A3",
        "ticks": 4313,
        "time": 2.246354166666667,
        "velocity": 0.5354330708661418
    },
    {
        "duration": 0.6776041666666668,
        "durationTicks": 1301,
        "midi": 62,
        "name": "D4",
        "ticks": 5127,
        "time": 2.6703125,
        "velocity": 0.6299212598425197
    },
    {
        "duration": 0.46510416666666643,
        "durationTicks": 893,
        "midi": 54,
        "name": "F#3",
        "ticks": 6719,
        "time": 3.4994791666666667,
        "velocity": 0.5118110236220472
    },
    {
        "duration": 0.36875000000000036,
        "durationTicks": 708,
        "midi": 57,
        "name": "A3",
        "ticks": 7489,
        "time": 3.900520833333333,
        "velocity": 0.6377952755905512
    },
    {
        "duration": 0.18385416666666643,
        "durationTicks": 353,
        "midi": 64,
        "name": "E4",
        "ticks": 8291,
        "time": 4.318229166666667,
        "velocity": 0.6377952755905512
    },
    {
        "duration": 0.18541666666666679,
        "durationTicks": 356,
        "midi": 64,
        "name": "E4",
        "ticks": 9071,
        "time": 4.724479166666667,
        "velocity": 0.6850393700787402
    },
    {
        "duration": 0.44947916666666643,
        "durationTicks": 863,
        "midi": 54,
        "name": "F#3",
        "ticks": 9845,
        "time": 5.127604166666667,
        "velocity": 0.5354330708661418
    },
    {
        "duration": 0.4307291666666666,
        "durationTicks": 827,
        "midi": 57,
        "name": "A3",
        "ticks": 10605,
        "time": 5.5234375,
        "velocity": 0.6377952755905512
    },
    {
        "duration": 0.6078124999999996,
        "durationTicks": 1167,
        "midi": 62,
        "name": "D4",
        "ticks": 11407,
        "time": 5.941145833333334,
        "velocity": 0.6456692913385826
    }
];

const recordingSecondNotes = [
    {
        "duration": 0.39114583333333336,
        "durationTicks": 751,
        "midi": 69,
        "name": "A4",
        "ticks": 32,
        "time": 0.016666666666666666,
        "velocity": 0.6377952755905512
    },
    {
        "duration": 0.44531249999999994,
        "durationTicks": 855,
        "midi": 67,
        "name": "G4",
        "ticks": 781,
        "time": 0.40677083333333336,
        "velocity": 0.6535433070866141
    },
    {
        "duration": 0.40104166666666674,
        "durationTicks": 770,
        "midi": 66,
        "name": "F#4",
        "ticks": 1522,
        "time": 0.7927083333333333,
        "velocity": 0.4881889763779528
    },
    {
        "duration": 0.2802083333333334,
        "durationTicks": 538,
        "midi": 64,
        "name": "E4",
        "ticks": 2242,
        "time": 1.1677083333333333,
        "velocity": 0.5354330708661418
    },
    {
        "duration": 0.390625,
        "durationTicks": 750,
        "midi": 69,
        "name": "A4",
        "ticks": 3024,
        "time": 1.575,
        "velocity": 0.6299212598425197
    },
    {
        "duration": 0.39166666666666683,
        "durationTicks": 752,
        "midi": 67,
        "name": "G4",
        "ticks": 3731,
        "time": 1.9432291666666666,
        "velocity": 0.6299212598425197
    },
    {
        "duration": 0.39687499999999964,
        "durationTicks": 762,
        "midi": 66,
        "name": "F#4",
        "ticks": 4420,
        "time": 2.3020833333333335,
        "velocity": 0.5669291338582677
    },
    {
        "duration": 0.4328124999999998,
        "durationTicks": 831,
        "midi": 64,
        "name": "E4",
        "ticks": 5096,
        "time": 2.654166666666667,
        "velocity": 0.5354330708661418
    },
    {
        "duration": 0.3927083333333332,
        "durationTicks": 754,
        "midi": 69,
        "name": "A4",
        "ticks": 5875,
        "time": 3.0598958333333335,
        "velocity": 0.6377952755905512
    },
    {
        "duration": 0.4088541666666665,
        "durationTicks": 785,
        "midi": 67,
        "name": "G4",
        "ticks": 6584,
        "time": 3.4291666666666667,
        "velocity": 0.6299212598425197
    },
    {
        "duration": 0.35468750000000027,
        "durationTicks": 681,
        "midi": 66,
        "name": "F#4",
        "ticks": 7327,
        "time": 3.816145833333333,
        "velocity": 0.6141732283464567
    },
    {
        "duration": 0.4286458333333334,
        "durationTicks": 823,
        "midi": 64,
        "name": "E4",
        "ticks": 7991,
        "time": 4.161979166666667,
        "velocity": 0.6062992125984252
    },
    {
        "duration": 1.2182291666666671,
        "durationTicks": 2339,
        "midi": 62,
        "name": "D4",
        "ticks": 8830,
        "time": 4.598958333333333,
        "velocity": 0.5748031496062992
    },
    {
        "duration": 0.39114583333333286,
        "durationTicks": 751,
        "midi": 69,
        "name": "A4",
        "ticks": 12920,
        "time": 6.729166666666667,
        "velocity": 0.6377952755905512
    },
    {
        "duration": 0.4453125,
        "durationTicks": 855,
        "midi": 67,
        "name": "G4",
        "ticks": 13669,
        "time": 7.119270833333333,
        "velocity": 0.6535433070866141
    },
    {
        "duration": 0.40104166666666696,
        "durationTicks": 770,
        "midi": 66,
        "name": "F#4",
        "ticks": 14410,
        "time": 7.505208333333333,
        "velocity": 0.4881889763779528
    },
    {
        "duration": 0.2802083333333334,
        "durationTicks": 538,
        "midi": 64,
        "name": "E4",
        "ticks": 15130,
        "time": 7.880208333333333,
        "velocity": 0.5354330708661418
    },
    {
        "duration": 0.390625,
        "durationTicks": 750,
        "midi": 69,
        "name": "A4",
        "ticks": 15912,
        "time": 8.2875,
        "velocity": 0.6299212598425197
    },
    {
        "duration": 0.3916666666666657,
        "durationTicks": 752,
        "midi": 67,
        "name": "G4",
        "ticks": 16619,
        "time": 8.655729166666667,
        "velocity": 0.6299212598425197
    },
    {
        "duration": 0.3968750000000014,
        "durationTicks": 762,
        "midi": 66,
        "name": "F#4",
        "ticks": 17308,
        "time": 9.014583333333333,
        "velocity": 0.5669291338582677
    },
    {
        "duration": 0.43281249999999893,
        "durationTicks": 831,
        "midi": 64,
        "name": "E4",
        "ticks": 17984,
        "time": 9.366666666666667,
        "velocity": 0.5354330708661418
    },
    {
        "duration": 0.392708333333335,
        "durationTicks": 754,
        "midi": 69,
        "name": "A4",
        "ticks": 18763,
        "time": 9.772395833333333,
        "velocity": 0.6377952755905512
    },
    {
        "duration": 0.4088541666666661,
        "durationTicks": 785,
        "midi": 67,
        "name": "G4",
        "ticks": 19472,
        "time": 10.141666666666667,
        "velocity": 0.6299212598425197
    },
    {
        "duration": 0.35468749999999893,
        "durationTicks": 681,
        "midi": 66,
        "name": "F#4",
        "ticks": 20215,
        "time": 10.528645833333334,
        "velocity": 0.6141732283464567
    },
    {
        "duration": 0.4286458333333325,
        "durationTicks": 823,
        "midi": 64,
        "name": "E4",
        "ticks": 20879,
        "time": 10.874479166666667,
        "velocity": 0.6062992125984252
    },
    {
        "duration": 1.2182291666666671,
        "durationTicks": 2339,
        "midi": 62,
        "name": "D4",
        "ticks": 21718,
        "time": 11.311458333333333,
        "velocity": 0.5748031496062992
    },
    {
        "duration": 0.22604166666666714,
        "durationTicks": 434,
        "midi": 69,
        "name": "A4",
        "ticks": 25808,
        "time": 13.441666666666666,
        "velocity": 0.6141732283464567
    },
    {
        "duration": 0.1671875000000007,
        "durationTicks": 321,
        "midi": 69,
        "name": "A4",
        "ticks": 26653,
        "time": 13.881770833333333,
        "velocity": 0.6062992125984252
    },
    {
        "duration": 0.48593750000000036,
        "durationTicks": 933,
        "midi": 67,
        "name": "G4",
        "ticks": 27356,
        "time": 14.247916666666667,
        "velocity": 0.6771653543307087
    },
    {
        "duration": 0.14791666666666536,
        "durationTicks": 284,
        "midi": 66,
        "name": "F#4",
        "ticks": 28896,
        "time": 15.05,
        "velocity": 0.6692913385826772
    },
    {
        "duration": 0.2791666666666668,
        "durationTicks": 536,
        "midi": 66,
        "name": "F#4",
        "ticks": 29660,
        "time": 15.447916666666666,
        "velocity": 0.6692913385826772
    },
    {
        "duration": 0.5921874999999996,
        "durationTicks": 1137,
        "midi": 64,
        "name": "E4",
        "ticks": 30380,
        "time": 15.822916666666666,
        "velocity": 0.6062992125984252
    },
    {
        "duration": 0.15156249999999716,
        "durationTicks": 291,
        "midi": 69,
        "name": "A4",
        "ticks": 31880,
        "time": 16.604166666666668,
        "velocity": 0.5354330708661418
    },
    {
        "duration": 0.16822916666666643,
        "durationTicks": 323,
        "midi": 69,
        "name": "A4",
        "ticks": 32657,
        "time": 17.008854166666666,
        "velocity": 0.6062992125984252
    },
    {
        "duration": 0.13697916666666643,
        "durationTicks": 263,
        "midi": 67,
        "name": "G4",
        "ticks": 33397,
        "time": 17.394270833333334,
        "velocity": 0.6692913385826772
    },
    {
        "duration": 0.203125,
        "durationTicks": 390,
        "midi": 66,
        "name": "F#4",
        "ticks": 34149,
        "time": 17.7859375,
        "velocity": 0.5669291338582677
    },
    {
        "duration": 0.9458333333333329,
        "durationTicks": 1816,
        "midi": 64,
        "name": "E4",
        "ticks": 34900,
        "time": 18.177083333333332,
        "velocity": 0.6377952755905512
    },
    {
        "duration": 0.16875000000000284,
        "durationTicks": 324,
        "midi": 69,
        "name": "A4",
        "ticks": 38786,
        "time": 20.201041666666665,
        "velocity": 0.6456692913385826
    },
    {
        "duration": 0.14010416666666714,
        "durationTicks": 269,
        "midi": 62,
        "name": "D4",
        "ticks": 38805,
        "time": 20.2109375,
        "velocity": 0.6377952755905512
    },
    {
        "duration": 0.203125,
        "durationTicks": 390,
        "midi": 69,
        "name": "A4",
        "ticks": 39567,
        "time": 20.6078125,
        "velocity": 0.5905511811023622
    },
    {
        "duration": 0.5755208333333321,
        "durationTicks": 1105,
        "midi": 67,
        "name": "G4",
        "ticks": 40288,
        "time": 20.983333333333334,
        "velocity": 0.6299212598425197
    },
    {
        "duration": 0.17447916666666785,
        "durationTicks": 335,
        "midi": 66,
        "name": "F#4",
        "ticks": 41799,
        "time": 21.7703125,
        "velocity": 0.4015748031496063
    },
    {
        "duration": 0.15208333333333357,
        "durationTicks": 292,
        "midi": 66,
        "name": "F#4",
        "ticks": 42545,
        "time": 22.158854166666668,
        "velocity": 0.6299212598425197
    },
    {
        "duration": 0.552604166666665,
        "durationTicks": 1061,
        "midi": 64,
        "name": "E4",
        "ticks": 43325,
        "time": 22.565104166666668,
        "velocity": 0.6299212598425197
    },
    {
        "duration": 0.18124999999999858,
        "durationTicks": 348,
        "midi": 64,
        "name": "E4",
        "ticks": 44782,
        "time": 23.323958333333334,
        "velocity": 0.5905511811023622
    },
    {
        "duration": 0.28177083333333286,
        "durationTicks": 541,
        "midi": 64,
        "name": "E4",
        "ticks": 45516,
        "time": 23.70625,
        "velocity": 0.6062992125984252
    },
    {
        "duration": 0.17916666666666714,
        "durationTicks": 344,
        "midi": 66,
        "name": "F#4",
        "ticks": 46224,
        "time": 24.075,
        "velocity": 0.6141732283464567
    },
    {
        "duration": 0.205208333333335,
        "durationTicks": 394,
        "midi": 67,
        "name": "G4",
        "ticks": 46990,
        "time": 24.473958333333332,
        "velocity": 0.6456692913385826
    },
    {
        "duration": 0.9328125000000007,
        "durationTicks": 1791,
        "midi": 69,
        "name": "A4",
        "ticks": 47796,
        "time": 24.89375,
        "velocity": 0.6062992125984252
    },
    {
        "duration": 0.20156249999999787,
        "durationTicks": 387,
        "midi": 69,
        "name": "A4",
        "ticks": 51627,
        "time": 26.8890625,
        "velocity": 0.6535433070866141
    },
    {
        "duration": 0.1281250000000007,
        "durationTicks": 246,
        "midi": 62,
        "name": "D4",
        "ticks": 51648,
        "time": 26.9,
        "velocity": 0.6141732283464567
    },
    {
        "duration": 0.1770833333333357,
        "durationTicks": 340,
        "midi": 69,
        "name": "A4",
        "ticks": 52391,
        "time": 27.286979166666665,
        "velocity": 0.6456692913385826
    },
    {
        "duration": 0.1380208333333357,
        "durationTicks": 265,
        "midi": 69,
        "name": "A4",
        "ticks": 53184,
        "time": 27.7,
        "velocity": 0.6377952755905512
    },
    {
        "duration": 0.18072916666666572,
        "durationTicks": 347,
        "midi": 69,
        "name": "A4",
        "ticks": 53944,
        "time": 28.095833333333335,
        "velocity": 0.6377952755905512
    },
    {
        "duration": 0.1671875000000007,
        "durationTicks": 321,
        "midi": 67,
        "name": "G4",
        "ticks": 54691,
        "time": 28.484895833333333,
        "velocity": 0.6771653543307087
    },
    {
        "duration": 0.1328125,
        "durationTicks": 255,
        "midi": 62,
        "name": "D4",
        "ticks": 54701,
        "time": 28.490104166666665,
        "velocity": 0.6377952755905512
    },
    {
        "duration": 0.12604166666666572,
        "durationTicks": 242,
        "midi": 67,
        "name": "G4",
        "ticks": 55432,
        "time": 28.870833333333334,
        "velocity": 0.6692913385826772
    },
    {
        "duration": 0.12343750000000142,
        "durationTicks": 237,
        "midi": 67,
        "name": "G4",
        "ticks": 56199,
        "time": 29.2703125,
        "velocity": 0.6692913385826772
    },
    {
        "duration": 0.10885416666666714,
        "durationTicks": 209,
        "midi": 67,
        "name": "G4",
        "ticks": 56938,
        "time": 29.655208333333334,
        "velocity": 0.6692913385826772
    },
    {
        "duration": 0.12916666666666643,
        "durationTicks": 248,
        "midi": 66,
        "name": "F#4",
        "ticks": 57717,
        "time": 30.0609375,
        "velocity": 0.6771653543307087
    },
    {
        "duration": 0.12916666666666998,
        "durationTicks": 248,
        "midi": 62,
        "name": "D4",
        "ticks": 57746,
        "time": 30.076041666666665,
        "velocity": 0.6299212598425197
    },
    {
        "duration": 0.130729166666665,
        "durationTicks": 251,
        "midi": 66,
        "name": "F#4",
        "ticks": 58430,
        "time": 30.432291666666668,
        "velocity": 0.5590551181102362
    },
    {
        "duration": 0.14999999999999858,
        "durationTicks": 288,
        "midi": 66,
        "name": "F#4",
        "ticks": 59209,
        "time": 30.838020833333335,
        "velocity": 0.6299212598425197
    },
    {
        "duration": 0.1848958333333357,
        "durationTicks": 355,
        "midi": 66,
        "name": "F#4",
        "ticks": 59966,
        "time": 31.232291666666665,
        "velocity": 0.6456692913385826
    },
    {
        "duration": 0.9494791666666664,
        "durationTicks": 1823,
        "midi": 64,
        "name": "E4",
        "ticks": 60757,
        "time": 31.644270833333334,
        "velocity": 0.6299212598425197
    },
    {
        "duration": 0.13177083333333428,
        "durationTicks": 253,
        "midi": 62,
        "name": "D4",
        "ticks": 64502,
        "time": 33.594791666666666,
        "velocity": 0.6692913385826772
    },
    {
        "duration": 0.16614583333333144,
        "durationTicks": 319,
        "midi": 69,
        "name": "A4",
        "ticks": 64503,
        "time": 33.5953125,
        "velocity": 0.6456692913385826
    },
    {
        "duration": 0.15260416666666288,
        "durationTicks": 293,
        "midi": 69,
        "name": "A4",
        "ticks": 65245,
        "time": 33.981770833333336,
        "velocity": 0.6062992125984252
    },
    {
        "duration": 0.1328125,
        "durationTicks": 255,
        "midi": 69,
        "name": "A4",
        "ticks": 66051,
        "time": 34.4015625,
        "velocity": 0.6535433070866141
    },
    {
        "duration": 0.125,
        "durationTicks": 240,
        "midi": 69,
        "name": "A4",
        "ticks": 66782,
        "time": 34.782291666666666,
        "velocity": 0.6456692913385826
    },
    {
        "duration": 0.13177083333333428,
        "durationTicks": 253,
        "midi": 67,
        "name": "G4",
        "ticks": 67536,
        "time": 35.175,
        "velocity": 0.6771653543307087
    },
    {
        "duration": 0.11927083333333854,
        "durationTicks": 229,
        "midi": 67,
        "name": "G4",
        "ticks": 68284,
        "time": 35.56458333333333,
        "velocity": 0.6299212598425197
    },
    {
        "duration": 0.10989583333333286,
        "durationTicks": 211,
        "midi": 67,
        "name": "G4",
        "ticks": 69033,
        "time": 35.9546875,
        "velocity": 0.6850393700787402
    },
    {
        "duration": 0.1041666666666643,
        "durationTicks": 200,
        "midi": 67,
        "name": "G4",
        "ticks": 69774,
        "time": 36.340625,
        "velocity": 0.6535433070866141
    },
    {
        "duration": 0.15260416666666288,
        "durationTicks": 293,
        "midi": 66,
        "name": "F#4",
        "ticks": 70556,
        "time": 36.74791666666667,
        "velocity": 0.6456692913385826
    },
    {
        "duration": 0.20156250000000142,
        "durationTicks": 387,
        "midi": 64,
        "name": "E4",
        "ticks": 71257,
        "time": 37.11302083333333,
        "velocity": 0.6299212598425197
    },
    {
        "duration": 0.125,
        "durationTicks": 240,
        "midi": 62,
        "name": "D4",
        "ticks": 72015,
        "time": 37.5078125,
        "velocity": 0.6141732283464567
    },
    {
        "duration": 0.22604166666666714,
        "durationTicks": 434,
        "midi": 64,
        "name": "E4",
        "ticks": 72785,
        "time": 37.908854166666664,
        "velocity": 0.6456692913385826
    },
    {
        "duration": 1.0130208333333357,
        "durationTicks": 1945,
        "midi": 61,
        "name": "C#4",
        "ticks": 73532,
        "time": 38.297916666666666,
        "velocity": 0.6062992125984252
    },
    {
        "duration": 0.39114583333333286,
        "durationTicks": 751,
        "midi": 69,
        "name": "A4",
        "ticks": 77383,
        "time": 40.303645833333334,
        "velocity": 0.6377952755905512
    },
    {
        "duration": 0.4453125,
        "durationTicks": 855,
        "midi": 67,
        "name": "G4",
        "ticks": 78132,
        "time": 40.69375,
        "velocity": 0.6535433070866141
    },
    {
        "duration": 0.4010416666666714,
        "durationTicks": 770,
        "midi": 66,
        "name": "F#4",
        "ticks": 78873,
        "time": 41.0796875,
        "velocity": 0.4881889763779528
    },
    {
        "duration": 0.2802083333333343,
        "durationTicks": 538,
        "midi": 64,
        "name": "E4",
        "ticks": 79593,
        "time": 41.4546875,
        "velocity": 0.5354330708661418
    },
    {
        "duration": 0.390625,
        "durationTicks": 750,
        "midi": 69,
        "name": "A4",
        "ticks": 80375,
        "time": 41.861979166666664,
        "velocity": 0.6299212598425197
    },
    {
        "duration": 0.3916666666666728,
        "durationTicks": 752,
        "midi": 67,
        "name": "G4",
        "ticks": 81082,
        "time": 42.23020833333333,
        "velocity": 0.6299212598425197
    },
    {
        "duration": 0.3968750000000014,
        "durationTicks": 762,
        "midi": 66,
        "name": "F#4",
        "ticks": 81771,
        "time": 42.5890625,
        "velocity": 0.5669291338582677
    },
    {
        "duration": 0.43281250000000426,
        "durationTicks": 831,
        "midi": 64,
        "name": "E4",
        "ticks": 82447,
        "time": 42.94114583333333,
        "velocity": 0.5354330708661418
    },
    {
        "duration": 0.39270833333333854,
        "durationTicks": 754,
        "midi": 69,
        "name": "A4",
        "ticks": 83226,
        "time": 43.346875,
        "velocity": 0.6377952755905512
    },
    {
        "duration": 0.4088541666666643,
        "durationTicks": 785,
        "midi": 67,
        "name": "G4",
        "ticks": 83935,
        "time": 43.716145833333336,
        "velocity": 0.6299212598425197
    },
    {
        "duration": 0.35468750000000426,
        "durationTicks": 681,
        "midi": 66,
        "name": "F#4",
        "ticks": 84678,
        "time": 44.103125,
        "velocity": 0.6141732283464567
    },
    {
        "duration": 0.4286458333333343,
        "durationTicks": 823,
        "midi": 64,
        "name": "E4",
        "ticks": 85342,
        "time": 44.44895833333333,
        "velocity": 0.6062992125984252
    },
    {
        "duration": 1.2182291666666671,
        "durationTicks": 2339,
        "midi": 62,
        "name": "D4",
        "ticks": 86181,
        "time": 44.8859375,
        "velocity": 0.5748031496062992
    },
    {
        "duration": 0.39114583333333286,
        "durationTicks": 751,
        "midi": 69,
        "name": "A4",
        "ticks": 90234,
        "time": 46.996875,
        "velocity": 0.6377952755905512
    },
    {
        "duration": 0.4453125,
        "durationTicks": 855,
        "midi": 67,
        "name": "G4",
        "ticks": 90983,
        "time": 47.38697916666667,
        "velocity": 0.6535433070866141
    },
    {
        "duration": 0.4010416666666643,
        "durationTicks": 770,
        "midi": 66,
        "name": "F#4",
        "ticks": 91724,
        "time": 47.77291666666667,
        "velocity": 0.4881889763779528
    },
    {
        "duration": 0.2802083333333343,
        "durationTicks": 538,
        "midi": 64,
        "name": "E4",
        "ticks": 92444,
        "time": 48.14791666666667,
        "velocity": 0.5354330708661418
    },
    {
        "duration": 0.390625,
        "durationTicks": 750,
        "midi": 69,
        "name": "A4",
        "ticks": 93226,
        "time": 48.55520833333333,
        "velocity": 0.6299212598425197
    },
    {
        "duration": 0.3916666666666657,
        "durationTicks": 752,
        "midi": 67,
        "name": "G4",
        "ticks": 93933,
        "time": 48.9234375,
        "velocity": 0.6299212598425197
    },
    {
        "duration": 0.3968750000000014,
        "durationTicks": 762,
        "midi": 66,
        "name": "F#4",
        "ticks": 94622,
        "time": 49.282291666666666,
        "velocity": 0.5669291338582677
    },
    {
        "duration": 0.43281250000000426,
        "durationTicks": 831,
        "midi": 64,
        "name": "E4",
        "ticks": 95298,
        "time": 49.634375,
        "velocity": 0.5354330708661418
    },
    {
        "duration": 0.39270833333333144,
        "durationTicks": 754,
        "midi": 69,
        "name": "A4",
        "ticks": 96077,
        "time": 50.040104166666666,
        "velocity": 0.6377952755905512
    },
    {
        "duration": 0.4088541666666714,
        "durationTicks": 785,
        "midi": 67,
        "name": "G4",
        "ticks": 96786,
        "time": 50.409375,
        "velocity": 0.6299212598425197
    },
    {
        "duration": 0.35468749999999716,
        "durationTicks": 681,
        "midi": 66,
        "name": "F#4",
        "ticks": 97529,
        "time": 50.79635416666667,
        "velocity": 0.6141732283464567
    },
    {
        "duration": 0.4286458333333343,
        "durationTicks": 823,
        "midi": 64,
        "name": "E4",
        "ticks": 98193,
        "time": 51.1421875,
        "velocity": 0.6062992125984252
    },
    {
        "duration": 1.2182291666666671,
        "durationTicks": 2339,
        "midi": 62,
        "name": "D4",
        "ticks": 99032,
        "time": 51.579166666666666,
        "velocity": 0.5748031496062992
    }
];

// console.log({recordingNotes});

const recordingPart = new Tone.Part(function(time, datum){
    // console.log(time);
    // console.log(datum);

    const instrMapped = generateInstrMetadata(datum.name);

    // instrMapped.color = '#008b8b';
    instrMapped.color = '#64b5f6'; // human blue

    // instrMapped.originalPosition.z -= 15;
    instrMapped.originalPosition.z -= 10;

    instrMapped.duration = datum.duration / 2;


    physics.addBody(true, Store.dropPosX, instrMapped, 0);

}, recordingFirstNotes);      // twinkle twinkle little star
// }, recordingSecondNotes);  // bah bah black sheep
// }, recordingThirdNotes);  // alphabet song

recordingPart.loop = true;
recordingPart.start("0:0:0");

const recordingSecondPart = new Tone.Part(function(time, datum){
    // console.log(time);
    // console.log(datum);

    const instrMapped = generateInstrMetadata(datum.name);

    // instrMapped.color = '#0000cd';
    // instrMapped.color = '#003366'; 

    instrMapped.color = '#64b5f6'; // human blue

    instrMapped.originalPosition.z += 15;

    instrMapped.duration = datum.duration / 2;


    physics.addBody(true, Store.dropPosX, instrMapped, 0);

}, recordingSecondNotes);  // bah bah black sheep

// recordingSecondPart.loop = true;
// recordingSecondPart.start("0:0:0");
recordingSecondPart.start("1:0:0");