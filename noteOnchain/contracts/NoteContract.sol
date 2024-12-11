//SPDX-License-Identifier:MIT
pragma solidity ^0.5.16;

contract NoteContract {
    mapping(address => string[]) public notes;
    address public owner;
    
    constructor() public {
        owner=msg.sender;
    }

    event NewNote(address indexed own, string note);

    //添加记事
    function addNote(string memory note) public {
        notes[msg.sender].push(note);
        emit NewNote(msg.sender, note);
    }

    function getNotesLen(address own) public view returns (uint) {
        return notes[own].length;
    }

    //仅owner可以操作
    modifier onlyowner() {
        require(owner == msg.sender);
        _;
    }

    //修改笔记功能
    event ModifyNote(address indexed own,uint index);
    
    function modifyNote(
        address own,
        uint index,
        string memory note
    ) public onlyowner {
        // require(own==msg.sender);
        require(index<notes[own].length,"Index out of bounds");
        notes[own][index] = note;
        emit ModifyNote(own, index);
    }
}
