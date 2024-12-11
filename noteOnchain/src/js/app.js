App = {
  web3Provider: null,
  contracts: {},
  account: null, // 修改变量名以匹配赋值
  web3: null, // 添加web3实例变量

  // 初始化Web3实例
  initWeb3: async function () {
    try {
      if (window.ethereum) {
        App.web3Provider = window.ethereum;
        await window.ethereum.request({
          method: 'eth_requestAccounts'
        }); // 请求账户权限
        App.web3 = new Web3(App.web3Provider);
        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        }); // 获取账户
        // console.log('Accounts:', accounts);
        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts found. Please check MetaMask connection.');
        }
        App.account = accounts[0];
        // console.log('Connected account:', App.account); 
        return App.initContract();
      } else {
        throw new Error('Ethereum browser extension not detected.');
      }
    } catch (error) {
      console.error("Failed to initialize Web3", error);
    }
  },

  // 初始化智能合约
  initContract: async function () {
    try {
      const data = await $.getJSON('../NoteContract.json');
      App.contracts.noteContract = TruffleContract(data);
      App.contracts.noteContract.setProvider(App.web3Provider);
      const instance = await App.contracts.noteContract.deployed(); // 使用await等待异步操作
      App.noteInstance = instance;
      return App.getNotes();
    } catch (error) {
      console.error('Error getting contract instance:', error);
    }
  },

  // 获取笔记长度
  getNotes: async function () {
    try {
      const len = await App.noteInstance.getNotesLen(App.account);

      // App.noteLength = len;
      if (len > 0) {
        for (let i = len - 1; i >= 0; i--) { // 使用循环代替递归
          await App.loadNote(i);
        }
      }
    } catch (err) {
      console.error('Error getting notes length:', err);
    }
  },

  // 加载笔记
  loadNote: async function (index) {
    try {
      const note = await App.noteInstance.notes(App.account, index);
      const notesElement = document.getElementById("notes");
      const newNoteElement = document.createElement("div");
      const textarea = document.createElement("textarea");
      textarea.value = note;
      newNoteElement.appendChild(textarea);
      notesElement.appendChild(newNoteElement);
    } catch (err) {
      console.error('Error loading note:', err);
    }
  },

  /* // 添加笔记
  addNote: async function (noteContent) {
    try {
      await App.noteInstance.addNote(noteContent, {
        from: App.account
      });
      console.log('Note added');
      return App.watchChange();
    } catch (err) {
      console.error('Error adding note:', err);
    }
  },
  startPolling:function(interval=5000){
    setInterval(async()=>{
      try{
        await App.getNotes();
      }catch(error){
        console.error('Error polling for notes:',error);
      }
    },interval);
  },   */

  // 监听变化
  watchChange: function () {
    if (App.noteInstance.events) {
      App.noteInstance.events.NewNote({
        fromBlock: 'latest'
      })
      .on('data', function (event) {
        console.log('New note added:', event.returnValues);
        App.getNotes();
      })
      .on('error', function (error) {
        console.error('Error watching for new notes:', error);
      });
    } else {
      console.error('Event subscription not supported with this contract instance.');
    }
  },

  addNote: async function (noteContent) {
    try {
      await App.noteInstance.addNote(noteContent, { from: App.account });
      console.log('Note added');
      setTimeout(() => {
        App.getNotes(); // 轮询刷新笔记
      }, 5000); // 5 秒后检查
    } catch (err) {
      console.error('Error adding note:', err);
    }
  },

  // 绑定事件
  bindEvents: function () {
    $("#add_new").on('click', function () {
      var noteContent = $("#new_note").val().trim(); // 获取textarea的值并清理用户输入
      if (noteContent) {
        App.addNote(noteContent).catch(function (err) {
          console.error('Error:', err);
        });
      } else {
        alert("笔记内容不能为空！");
      }
    });
  },

  // 初始化应用程序
  init: function () {
    App.initWeb3().then(function () {
      App.bindEvents();
      App.watchChange();
    }).catch(function (err) {
      console.error('Error initializing app:', err);
    });
  }
};


$(document).ready(function () {
  App.init();
});