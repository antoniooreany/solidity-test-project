// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "remix_tests.sol";
import "../contracts/MyToken.sol";

// Helper contract to act as a third-party spender
contract Spender {
    function executeTransferFrom(
        MyToken token,
        address from,
        address to,
        uint256 amount
    ) external returns (bool) {
        return token.transferFrom(from, to, amount);
    }
}

// Helper contract to act as a valid receiver address (fixes dumpStorage error for non-existent accounts)
contract Receiver {
}

contract MyTokenTest {
    MyToken private token;
    Receiver private receiverContract;

    function beforeEach() public {
        token = new MyToken();
        receiverContract = new Receiver();
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
        address receiver = address(receiverContract);
        uint256 amount = 100 * 10**18;
        token.transfer(receiver, amount);
        Assert.equal(token.balanceOf(receiver), amount, "Receiver should get 100 tokens");
    }

    // Spender test
    function checkApproveAndTransferFrom() public {
        Spender spender = new Spender();
        address receiver = address(receiverContract);
        uint256 amount = 50 * 10**18;

        token.approve(address(spender), amount);
        Assert.equal(token.allowance(address(this), address(spender)), amount, "Allowance should be set correctly");

        bool success = spender.executeTransferFrom(token, address(this), receiver, amount);
        Assert.ok(success, "transferFrom should succeed");
        
        Assert.equal(token.balanceOf(receiver), amount, "TransferFrom should move tokens to receiver");
        Assert.equal(token.allowance(address(this), address(spender)), 0, "Allowance should decrease to 0");
    }

    // Negative tests
    function checkTransferFailsExceedingBalance() public {
        address receiver = address(receiverContract);
        uint256 amount = token.balanceOf(address(this)) + 1; // More than balance
        
        // Low-level call to catch revert
        (bool success, ) = address(token).call(
            abi.encodeWithSignature("transfer(address,uint256)", receiver, amount)
        );
        Assert.equal(success, false, "Transfer exceeding balance should revert");
    }

    function checkTransferFromFailsExceedingAllowance() public {
        Spender spender = new Spender();
        address receiver = address(receiverContract);
        uint256 amount = 50 * 10**18;

        token.approve(address(spender), amount);
        
        // Attempt to transfer more than allowance
        uint256 tooMuch = amount + 1;
        (bool success, ) = address(spender).call(
            abi.encodeWithSignature("executeTransferFrom(address,address,address,uint256)", address(token), address(this), receiver, tooMuch)
        );
        Assert.equal(success, false, "transferFrom exceeding allowance should revert");
    }
}
