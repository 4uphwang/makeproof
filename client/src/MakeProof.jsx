import { useState } from 'react';
import axios from "axios";
// import download from "downloadjs";
const snarkjs = require("snarkjs");


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
    let DOMAIN = "https://yourd-makeproof.herokuapp.com";
    // let DOMAIN = "http://localhost:3001/";
  let wasmFile = await getFileBuffer(`${DOMAIN}/wasmFile.wasm`);
  let zkeyFile = await getFileBuffer(`${DOMAIN}/zkey.zkey`);
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
        const file = JSON.stringify(_proof, null, 2);
        setProof(file);
        axios.post("https://yourdserver.store/proofResult", file).then((res) => alert(res)).catch(err => alert(err));
        // axios.post("http://localhost:8000/proofResult",file);
        // down(file);
      }
    );
    // const down = (proof) => {
    //   const fileName ='proof.json';
    //   download(proof, fileName);
    // }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <input
        id="CurrentLocationInput"
        type="text"
        value={""}
        style={{
          width: "80%",
          height: "32px",
          fontSize: "15px",
          border: "0",
          borderRadius: "15px",
          outline: "none",
          paddingLeft: "10px",
          backgroundColor: "rgb(233, 233, 233)",
        }}
      />
      <button
        id="Verify_Button"
        className="w-btn-outline w-btn-gray-outline"
        onClick={() => {
          console.log("click");
          ButtonClick();
        }}
      >
        <div>makeProof</div>
      </button>
      {proof == null ? (
        <div style={{ display: "flex" }}>none</div>
      ) : (
        <div style={{ fontSize: "6pt" }}>success!</div>
      )}
      {/* <input></input> */}
    </div>
  );
}

export default MakeProof;
