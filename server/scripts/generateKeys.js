const secp = require('ethereum-cryptography/secp256k1')
const {toHex} = require('ethereum-cryptography/utils')
const { keccak256 } = require('ethereum-cryptography/keccak')

const privateKey = secp.utils.randomPrivateKey()
// Allows us to display the hexidemical 
console.log(`privateKey: ${toHex(privateKey)}`)

const publicKey = secp.getPublicKey(privateKey)
// Allows us to display a shorter publicKey 20bytes
// let newPublicKey = keccak256(publicKey.slice(1)).slice(-20)
console.log(`publicKey: ${toHex(publicKey)}`)