import { useState } from 'react';
import download from "downloadjs";
// import axios from 'axios';
// import '@babel/polyfill';
// import {wasmFile} from '../assets/wasmFile.wasm';
// const zkeyFile = require('../assets/zkey.zkey');
const snarkjs = require("snarkjs");
window.Buffer = require('buffer/').Buffer;

function MakeProof() {
  const [proof,setProof] = useState(null);
  const makeProof = async (_proofInput, _wasm, _zkey) => {
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      _proofInput,
      _wasm,
      _zkey
    );
    return { proof, publicSignals };
  };

  async function getFileBuffer(filename) {
    let req = await fetch(filename);
    return Buffer.from(await req.arrayBuffer());
  }

  const ButtonClick = async () => {
  //   let DOMAIN = "http://3.39.237.110:3000/";
  // let wasmFile = await getFileBuffer(`${DOMAIN}/wasmFile.wasm`);
  // let zkeyFile = await getFileBuffer(`${DOMAIN}/zkey.zkey`);
    // let wasmFile = await getFileBuffer(`http://13.125.226.19/wasmFile`);
    // let zkeyFile = await getFileBuffer(`http://13.125.226.19/zkeyFile`);
    let path = ("http://localhost:3001");
    let wasmFile = await getFileBuffer(`${path}/wasmFile.wasm`);
    let zkeyFile = await getFileBuffer(`${path}/zkey.zkey`);
    console.log(wasmFile);
    console.log(zkeyFile);
    let proofInput = {
      fashion: ["0", "0", "8", "0", "0", "0", "0", "0"],
      food: ["0", "0", "8", "0", "0", "0", "0", "0"],
      travel: ["0", "0", "8", "0", "0", "0", "0", "0"],
      medical: ["0", "0", "8", "0", "0", "0", "0", "0"],
      education: ["0", "0", "8", "0", "0", "0", "0", "0"],
      exercise: ["0", "0", "8", "0", "0", "0", "0", "0"],
      slotIndex: 2,
      operator: 3,
      valueFashion: 5,
      valueFood: 5,
      valueTravel: 5,
      valueMedical: 5,
      valueEducation: 5,
      valueExercise: 5,
    };

     makeProof(proofInput, wasmFile, zkeyFile).then(
      ({ proof: _proof, publicSignals: _signals }) => {
        // console.log(_proof);
        const file = JSON.stringify(_proof, null, 2);
        // console.log(file);
        setProof(file);
        down(file);
      }
    );
    
    const down = (proof) => {
      const fileName ='proof.json';
      download(proof, fileName);
    }
  };

  return (
    <div style={{display: "flex", justifyContent:"center", alignItems:"center", height: "100vh" , width:"100vw"}}>
      <button
          title="Verify Button"
          // className="text-xl text-center p-3"
          style={{ width: "100px", height: "50px" ,display: "flex", position:"relative" }}
          onClick={() => {
            console.log("click");
            ButtonClick();
          }}
        >
          makeProof
        </button>
        {proof == null ? <div style={{ display: "flex", marginTop:"100px"}}>none</div> : <div style={{fontSize: "12pt"}}>{proof}</div>}
    </div>
  );
}

export default MakeProof;
