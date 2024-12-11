module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    develop: {
      port: 8545
    },
  }
};

// module.exports = {
//   // See <http://truffleframework.com/docs/advanced/configuration> 
//   // for more about customizing your Truffle configuration!
//   networks: {
//     sepolia: {
//       provider: function () {
//         var HDWalletProvider = require('@truffle/hdwallet-provider');
//         var mnemonic = "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";
//         return new HDWalletProvider(mnemonic, "https://sepolia.infura.io/v3/afddfa59b26d4eac8ce0244c1f548ad1");
//       },
//       network_id: 11155111,
//       gas: 7003605,
//       gasPrice: 10000000000,
//     }
//   }
// };



