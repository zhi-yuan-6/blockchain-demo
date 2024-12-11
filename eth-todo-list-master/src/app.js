App = {
    contracts: {},
    loading: false,

    initialize: async () => {
        await App.loadWeb3()
        await App.loadContract()
        await App.render()      
    },

    loadWeb3: async () => {
        if (window.ethereum) {
            try {
                // Request account access if needed
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                App.web3Provider = window.ethereum;
                window.web3 = new Web3(window.ethereum);
                App.account = accounts[0];
            } catch (error) {
                // User denied account access...
                console.error("User denied account access");
            }
        } else {
            window.alert("Please connect to Metamask.");
        }
    },

    loadContract: async () => {
        // Create a JavaScript version of the smart contract
        const todoList = await $.getJSON('TodoList.json')
        App.contracts.TodoList = TruffleContract(todoList)
        App.contracts.TodoList.setProvider(App.web3Provider)

        // Hydrate the smart contract with values from the blockchain
        App.todoList = await App.contracts.TodoList.deployed()
    },    

    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
            loader.show()
            content.hide()
        } else {
            loader.hide()
            content.show()
        }
    },

    renderTasks: async () => {
        const $taskTemplate = $('.taskTemplate')
        
        const activeIds = await App.todoList.getActiveIds();
        for (const id of activeIds) {
            const i = id.toNumber()
            // Fetch the task data from the blockchain
            const task = await App.todoList.tasks(i)
            const taskId = task[0].toNumber()
            const taskContent = task[1]
            const taskCompleted = task[2]
        
            // Create the html for the task
            const $newTaskTemplate = $taskTemplate.clone()
            $newTaskTemplate.find('.content').html(taskContent)
            $newTaskTemplate.find('input')
                            .prop('name', taskId)
                            .prop('checked', taskCompleted)
                            .on('click', App.toggleCompleted)
            $newTaskTemplate.find('.close')
                            .prop('name', taskId)
                            .on('click', App.deleteTask)
        
            // Put the task in the correct list
            if (taskCompleted) {
                $('#completedTaskList').append($newTaskTemplate)
            } else {
                $('#taskList').append($newTaskTemplate)
            }
        
            // Show the task
            $newTaskTemplate.show()
        }
      },

    createTask: async () => {
        App.setLoading(true)
        const content = $('#newTask').val()
        await App.todoList.createTask(content, {from:App.account})
        window.location.reload()
    },

    
    deleteTask: async (e) => {
        App.setLoading(true);
        const taskId = $(e.target).closest('.close').prop('name');
        await App.todoList.deleteTask(taskId, {from: App.account});
        window.location.reload();
    },

    toggleCompleted: async (e) => {
        App.setLoading(true)
        const taskId = e.target.name
        await App.todoList.toggleCompleted(taskId, {from:App.account})
        window.location.reload()
    },

    logEntireTaskList: async () => {
        const activeIds = await App.todoList.getActiveIds();
        activeIds.forEach(async (id) => {
            const task = await App.todoList.tasks(id.toNumber())
            const taskId = task[0].toNumber()
            const taskContent = task[1]
            const taskCompleted = task[2]
            console.log("taskid:" + taskId)
            console.log("taskContent: " + taskContent)
            console.log("taskCompleted: " + taskCompleted)
        })

    },

    render: async() => {
        // prevent double render
        if (App.loading) {
            return 
        }

        App.setLoading(true)

        // Render Account
        $('#account').html(App.account)

        // Render Tasks
        await App.renderTasks()

        // for debug
        // App.logEntireTaskList()
        App.setLoading(false)
        
    },
    
}

$(() => {
    $(window).load(() => {
        App.initialize()
    })
})