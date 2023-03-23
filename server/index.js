const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require('ethereum-cryptography/secp256k1');
const { toHex, utf8ToBytes } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');

app.use(cors());
app.use(express.json());

const balances = {
  "0430747871e4b95e71a7bb2bc3b9554598f0e41292f2ce517ebc0b5441f4342901bd7b27cf6e2c99f5423090f05d78a9e18f257233d157793f797b5570e7b596d9": 100,
  "04052901849cd9cf3a7ca0e4311011dced9e529cb9e4c31c99dbfdbded94701f842fd594d40e535ccae3a16772f32d335ee1850f0d23c8d12e66a2716c233c8d5d": 50,
  "0484594744f122c9b20a05d46d8c8de0fc8824fe78ac38b3663cd48dc0c4f6eb8d13abc84b562994502df533042c460e87f32d779d55a0a0bb22c63dfda580e597": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  // TODO: get a signature from client-side application
  // recover the public address from the signature

  const { sender, recipient, amount, nonce, signTx } = req.body;

  // collect the signature and recovery bit
  const [signature, recoveryBit] = signTx;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const newSignature = Uint8Array.from(Object.values(signature));

  const msgToBytes = utf8ToBytes(recipient + amount + JSON.stringify(nonce));
  const msgHash = toHex(keccak256(msgToBytes));

  const publicKey = await secp.recoverPublicKey(msgHash, newSignature, recoveryBit);

  const verifyTx = secp.verify(newSignature, msgHash, publicKey);

  if(!verifyTx) {
    res.status(400).send({ message: "Invalid Transaction"});
  }

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else if (sender == recipient) {
    res.status(400).send({ message: "Cannot use your same address" })
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
