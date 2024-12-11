pragma solidity ^0.5.0;

contract TodoList {
    uint public taskCount = 0;
    uint public taskId = 0;
    uint[] public activeIds;


    struct Task {
        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Task) public tasks;

    event TaskCreated(
        uint id,
        string content,
        bool completed
    );

    event TaskCompleted(
        uint id,
        bool completed
    );

    constructor() public {
        createTask("Drink some water");
        createTask("Buy groceries for the week");
        createTask("Complete assignment");
    }

    function getActiveIds() public view returns (uint[] memory) {
        return activeIds;
    }

    function deleteTask(uint _id) public {
        // Task memory _task = tasks[_id];
        delete tasks[_id];
        uint removeIndex = 0;
        for(uint i = 0; i < activeIds.length; i++) {
            if(activeIds[i] == _id) {
                removeIndex = i;
                break;
            }
        }
        for(uint i = removeIndex+1; i < activeIds.length; i++) {
            activeIds[i-1] = activeIds[i];
        }
        activeIds.pop();
    }

    function createTask(string memory _content) public {
        taskCount ++;
        taskId ++;
        tasks[taskId] = Task(taskId, _content, false);
        activeIds.push(taskId);
        emit TaskCreated(taskId, _content, false);
    }

    function toggleCompleted(uint _id) public {
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit TaskCompleted(_id, _task.completed);
    }
}