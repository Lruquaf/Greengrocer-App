// SPDX-License-Identifier: MIT

pragma solidity 0.8.8;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract Greengrocer {
    address public seller;
    address public wholesaler;
    IERC1155 public products;

    mapping(address => uint256) public claimableFees;
    mapping(uint256 => uint256) public prices;

    event PriceSet(uint256 id, uint256 newPrice);
    event ProductBought(uint256 id, address buyer);
    event Withdrawn(address receiver, uint256 amount);

    constructor(address _products, address _seller, address _wholesaler) {
        products = IERC1155(_products);
        seller = _seller;
        wholesaler = _wholesaler;
    }

    function setPrice(uint256 _id, uint256 _newPrice) public {
        require(msg.sender == seller, "Only seller can change prices!");
        prices[_id] = _newPrice;
        emit PriceSet(_id, _newPrice);
    }

    function buyProduct(uint256 _id) public payable {
        require(msg.value == prices[_id], "Incorrect value!");
        claimableFees[seller] += (msg.value * 9) / 10;
        claimableFees[wholesaler] += (msg.value * 1) / 10;
        products.safeTransferFrom(seller, msg.sender, _id, 1, "");
        emit ProductBought(_id, msg.sender);
    }

    function withdraw() public {
        require(
            msg.sender == seller || msg.sender == wholesaler,
            "Caller is not seller or wholesaler!"
        );
        uint256 amount = claimableFees[msg.sender];
        claimableFees[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed!");
        emit Withdrawn(msg.sender, amount);
    }

    function getAmount(uint256 _id) public view returns (uint256) {
        return products.balanceOf(seller, _id);
    }

    function getPrice(uint256 _id) public view returns (uint256) {
        return prices[_id];
    }
}
