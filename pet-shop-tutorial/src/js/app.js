App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // Load pets.
    $.getJSON('../pets.json', function (data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');
  
      for (let i = 0; i < data.length; i++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
  
        petsRow.append(petTemplate.html());
      }
    });
  
    // 确保等待initWeb3完成
    await App.initWeb3();
  },
  
  /**
   * 初始化Web3实例
   * 此函数旨在根据用户浏览器环境，正确配置Web3以与以太坊网络通信
   * 它优先使用现代dApp浏览器中的window.ethereum对象，如果不可用，则尝试使用window.web3
   * 如果两者都不可用，它将回退到本地以太坊节点
   * 
   * @returns {Promise} 返回初始化合约的Promise对象
   */
  initWeb3: async function () {
    // 检查是否为现代dApp浏览器
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // 请求用户授权访问以太坊账户
        await window.ethereum.enable();
      } catch (error) {
        // 如果用户拒绝授权，记录错误信息
        console.error("User denied account access:", error);
        throw error; // 抛出错误，以便调用者可以处理
      }
    } else if (window.web3) {
      // 如果是旧版本的dApp浏览器
      App.web3Provider = window.web3.currentProvider;
    } else {
      // 如果浏览器不支持Web3，使用本地以太坊节点
      App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
    }
    // 根据提供的Provider创建Web3实例
    web3 = new Web3(App.web3Provider);
  
    // 初始化智能合约
    return App.initContract();
  },
  
  /**
   * 初始化智能合约功能
   * 
   * 本函数通过加载Adoption.json文件来初始化与智能合约的交互它创建并配置了一个Truffle合同实例，
   * 设置了Web3提供者，并在加载完成后触发标记已领养宠物的状态
   */
  initContract: async function () {
    try {
      // 加载Adoption.json文件，该文件包含了智能合约的相关信息
      const data = await $.getJSON('./Adoption.json');
      // 用Adoption.json数据创建一个可交互的TruffleContract合约实例
      const AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
  
      // 为Truffle合约实例设置Web3提供者，使其能够与以太坊网络通信
      App.contracts.Adoption.setProvider(App.web3Provider);
  
      // 在加载并配置合约后，调用markAdopted函数来标记已领养的状态
      await App.markAdopted();
  
      // 绑定事件监听器
      App.bindEvents();
    } catch (error) {
      console.error("Error initializing contract:", error);
    }
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },
  /**
   * 标记已领养状态的函数
   * 
   * 此函数通过与以太坊合约交互，来更新前端界面，显示宠物已被领养的状态
   * 它首先获取已领养者的地址列表，然后根据这些信息更新网页上的领养按钮状态
   * 
   * @param {Array} adopters - 一个数组，用于接收已领养者的地址列表，虽然此参数在函数内部未使用，但可能在将来用于扩展功能
   * @param {String} account - 用户的以太坊账户地址，用于识别操作者，本例中未直接使用，但可能是未来扩展的一部分
   */
  markAdopted: function () {
    var adoptionInstance;
  
    // 获取已部署的Adoption合约实例
    App.contracts.Adoption.deployed().then(function (instance) {
      adoptionInstance = instance;
  
      // 调用合约的getAdopters(),用call读取信息不用消耗gas
      return adoptionInstance.getAdopters.all();
    }).then(function (adopters) {
      // 遍历所有领养者地址，更新UI以反映领养状态
      for (let i = 0; i < adopters.length; i++) {
        // 检查当前领养者地址是否非空，非空表示该宠物已被领养
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          // 更新对应宠物的领养按钮文本为'Success'，并禁用按钮，防止重复领养
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function (err) {
      // 捕获并记录任何遇到的错误
      console.log(err.message);
    });
  },

  /**
   * 处理宠物领养事件
   * @param {Object} event - 触发的事件对象
   */
  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    // 获取用户账号
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;

        // 发送交易领养宠物
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }
}

$(function () {
  $(window).load(function () {
    App.init();
  });
});