import { useState } from "react";
import axios from "axios";
// import download from "downloadjs";
const snarkjs = require("snarkjs");

function MakeProof() {
  const [proof, setProof] = useState(null);


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

  const ButtonClick = async () => {
    let DOMAIN = "https://yourd-makeproof.herokuapp.com";
    // let DOMAIN = "http://localhost:3001";
    const wasmFile = await getFileBuffer(`${DOMAIN}/distance.wasm`);
    const zkeyFile = await getFileBuffer(`${DOMAIN}/distance_0001.zkey`);
    const dis = document.getElementById('CurrentLocationInput');

    let proofInput = {
      distance: dis.value,
      radius: "50",
    };

    const account = "6xZw2r77fqQcbVZRAeR4CN4HfCKqUX4Bcd8zvKh5Wsux";
    const adscid = "QmR1w7Rg28z2WmJhKYc98EbzohnZtDrWo77QH38rJrzBHi";

    makeProof(proofInput, wasmFile, zkeyFile).then(
      ({ proof: _proof, publicSignals: _signals }) => {
        const prooffile = JSON.stringify(_proof, null, 2);
        const sigfile = JSON.stringify(_signals);
        setProof(prooffile);
        if (prooffile !== null) {
          axios.post("https://www.yourdserver.store/proofResult", {proof:prooffile, publicSignals: sigfile, AdsCid: adscid, Account: account,}).then((res) => alert(res)).catch(err => alert(err));
          // axios
          //   .post("http://localhost:8000/proofResult", {
          //     proof: prooffile,
          //     publicSignals: sigfile,
          //     AdsCid: adscid,
          //     Account: account,
          //   })
          //   .then((res) => alert(res))
          //   .catch((err) => alert(err));
        }
      }
    );
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
