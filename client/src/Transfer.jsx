import { useState } from "react";
import server from "./server";
import "./App.scss";

import * as secp from "ethereum-cryptography/secp256k1"
import { utf8ToBytes } from "ethereum-cryptography/utils"
import { keccak256 } from "ethereum-cryptography/keccak"

function Transfer({ address, setBalance, setTransaction, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [nonce, setNonce] = useState(0);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const msgHash = keccak256(utf8ToBytes(recipient + sendAmount + JSON.stringify(nonce)))
    const signTx = await secp.sign(msgHash, privateKey, {recovered: true})

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        nonce,
        signTx
      });
      const data = {
        time: new Date().toLocaleString(),
        amount: parseInt(sendAmount),
        sender: address,
        recipient,
        nonce: parseInt(nonce)
      }

      setTransaction( trans => [...trans, data]);
      setNonce((n) => n + 1)
      setBalance(balance);
    } catch (ex) {

      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
