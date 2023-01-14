require('@nomicfoundation/hardhat-toolbox')
require("dotenv").config({path: ".env"})

module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: process.env.QUICKNODE_HTTP_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
}