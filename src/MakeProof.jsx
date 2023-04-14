import { useState } from "react";
import axios from "axios";
// import download from "downloadjs";
const snarkjs = require("snarkjs");
const DOMAIN = "http://localhost:3001";
const Server = "http://localhost:8000";
// const DOMAIN = "https://yourd-makeproof.herokuapp.com";
// const Server = "https://www.yourdserver.store";

function MakeProof() {
  const [proof, setProof] = useState(null);
  const [inputvalue, setInpuValue] = useState("");

  const makeProof = async (_proofInput, _wasm, _zkey) => {
      let { proof, publicSignals } = await snarkjs.groth16.fullProve(
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

  const handler = (e) => {
    setInpuValue(e.target.value);
  };

  const ButtonClick = async () => {
    const wasmFile = await getFileBuffer(`${DOMAIN}/distance.wasm`);
    const zkeyFile = await getFileBuffer(`${DOMAIN}/distance_0001.zkey`);
    const input = document.getElementById("CurrentLocationInput").value;

    const value = JSON.parse(input);
    async function sendDataToServer(Input, adscid, account, wasmFile, zkeyFile) {
      switch (Input[1]) {
        case "100m":
          Input[1] = 100;
          break;
        case "200m":
          Input[1] = 200;
          break;
        case "500m":
          Input[1] = 500;
          break;
        case "1km":
          Input[1] = 1000;
          break;
        case "2km":
          Input[1] = 2000;
          break;
        case "5km":
          Input[1] = 5000;
          break;
        default:
          break;
      }
      const proofInput = {
        distance: Input[0],
        radius: Input[1],
      };
      
    
      const { proof: _proof, publicSignals: _signals } = await makeProof(
        proofInput,
        wasmFile,
        zkeyFile
      );
      const prooffile = JSON.stringify(_proof);
      const sigfile = JSON.stringify(_signals);
      if (prooffile !== null) {
        const res = await axios.post(`${Server}/adslist`, {
          proof: prooffile,
          publicSignals: sigfile,
          AdsCid: adscid,
          Account: account,
        });
        if (res.data === "false") alert("false");
      }
    }
    
    (async () => {
      for (const dis of value) {
        const input = [dis[0], dis[1]];
        await sendDataToServer(input, dis[2], dis[3], wasmFile, zkeyFile);
      }
    })();
    
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
        value={inputvalue}
        onChange={handler}
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
      {/* <input 
      id="AdsCid"
      type="text"
      value=""
      style={{display:"none"}}
      /> */}
      <button
        id="Verify_Button"
        className="w-btn-outline w-btn-gray-outline"
        onClick={() => {
          ButtonClick();
        }}
      >
        <div>makeProof</div>
      </button>
      {proof == null ? (
        <div style={{ display: "flex" }}>none</div>
      ) : (
        <div style={{ fontSize: "6pt" }}>{proof}</div>
      )}
      {/* <input></input> */}
    </div>
  );
}

export default MakeProof;
