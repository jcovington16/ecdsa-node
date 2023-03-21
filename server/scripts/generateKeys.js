const secp = require('ethereum-cryptography/secp256k1')
const {toHex} = require('ethereum-cryptography/utils')
const privateKey = secp.utils.randomPrivateKey()

// Allows us to display the hexidemical 
console.log(`privateKey: ${toHex(privateKey)}`)