// 为NoteContract.sol合约添加一个部署脚本
//
// 这个脚本的作用是将NoteContract.sol合约部署到区块链网络中
// 通过这种方式，我们可以将合约的二进制代码嵌入到区块链的一个交易中，从而创建合约的一个实例

// 引入NoteContract.sol合约，以便于部署
var Note = artifacts.require("../contracts/NoteContract.sol");

// 定义部署函数，该函数将在部署脚本执行时被调用
// 参数:
// - deployer: 部署工具，提供部署合约的方法
module.exports = function (deployer) {
    // 调用deployer的deploy方法来部署NoteContract.sol合约
    // 这行代码将合约的部署任务添加到部署队列中，当脚本执行时，它将自动执行
    deployer.deploy(Note);
};