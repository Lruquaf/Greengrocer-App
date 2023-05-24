// SPDX-License-Identifier: MIT

pragma solidity 0.8.8;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Products is ERC1155, Ownable {
    address public seller;
    address public greengrocer;
    uint256 public constant POTATO = 0;
    string public potatoUri;
    uint256 public constant ONION = 1;
    string public onionUri;

    modifier onlySeller() {
        require(msg.sender == seller, "Caller is not seller!");
        _;
    }

    constructor(
        address _seller,
        string memory _potatoUri,
        string memory _onionUri
    ) ERC1155("") {
        seller = _seller;
        potatoUri = _potatoUri;
        onionUri = _onionUri;
    }

    function setGreengrocer(address _greengrocer) public onlyOwner {
        greengrocer = _greengrocer;
    }

    function getURI(uint256 _id) public view returns (string memory) {
        require(_id == 0 || _id == 1, "Invalid id!");
        return _id == 0 ? potatoUri : onionUri;
    }

    function mint(uint256 _id, uint256 _amount) public onlySeller {
        _mint(msg.sender, _id, _amount, "");
    }

    function burn(uint256 _id, uint256 _amount) public onlySeller {
        _burn(msg.sender, _id, _amount);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        require(
            msg.sender == greengrocer,
            "Tokens are non-transferable except by greengrocer!"
        );
        super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public override {
        require(
            msg.sender == greengrocer,
            "Tokens are non-transferable except by greengrocer!"
        );
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }
}
