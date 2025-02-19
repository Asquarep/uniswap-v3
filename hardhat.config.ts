require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/fi4KJ97Uo8YTlaNTnq9z67XyXBKnK6di",
      },
    },
  },
};