// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "remix_tests.sol";
import "../contracts/MyToken.sol";

contract MyTokenTest {
    MyToken private token;

    function beforeEach() public {
        token = new MyToken();
    }

    function checkNameAndSymbol() public {
        Assert.equal(token.name(), "TestToken", "Name should be TestToken");
        Assert.equal(token.symbol(), "TTK", "Symbol should be TTK");
    }

    function checkDecimals() public {
        Assert.equal(token.decimals(), 18, "Decimals should be 18");
    }

    function checkTotalSupply() public {
        uint256 expectedSupply = 1_000_000 * 10**18;
        Assert.equal(token.totalSupply(), expectedSupply, "Total supply should be 1 million with 18 decimals");
    }

    function checkDeployerBalance() public {
        uint256 expectedSupply = 1_000_000 * 10**18;
        Assert.equal(token.balanceOf(address(this)), expectedSupply, "Deployer should receive all initial tokens");
    }

    function checkTransfer() public {
        address receiver = address(0x123);
        uint256 amount = 100 * 10**18;
        
        token.transfer(receiver, amount);
        
        Assert.equal(token.balanceOf(receiver), amount, "Receiver should get 100 tokens");
        Assert.equal(token.balanceOf(address(this)), (1_000_000 - 100) * 10**18, "Sender balance should decrease");
    }

    function checkApproveAndTransferFrom() public {
        address spender = address(this); // in a real scenario this is a different contract
        address receiver = address(0x123);
        uint256 amount = 50 * 10**18;

        token.approve(spender, amount);
        Assert.equal(token.allowance(address(this), spender), amount, "Allowance should be set correctly");

        token.transferFrom(address(this), receiver, amount);
        Assert.equal(token.balanceOf(receiver), amount, "TransferFrom should move tokens to receiver");
    }
}
