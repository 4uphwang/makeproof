
import { useState } from 'react';
import './App.css';
import download from "downloadjs";
const snarkjs = require("snarkjs");

function App() {
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
    let path = ("http://3.39.237.110:3000");
    let wasmFile = await getFileBuffer(`${path}/wasmFile.wasm`);
    let zkeyFile = await getFileBuffer(`${path}/zkey.zkey`);
    // const verificationKey ="https://gateway.pinata.cloud/ipfs/QmR34ZwdQMj7pZvdVeJz2Lru9zgTkQrX6YDjsQCpcm7xJP";

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
    <div className="App">
      <header className="App-header">
      <button
          title="Verify Button"
          // className="text-xl text-center p-3"
          style={{ width: "100px", height: "50px" }}
          onClick={() => {
            ButtonClick();
          }}
        >
          makeProof
        </button>
        {proof == null ? <div/> : <div style={{fontSize: "12pt"}}>{proof}</div>}
      </header>
    </div>
  );
}

export default App;
