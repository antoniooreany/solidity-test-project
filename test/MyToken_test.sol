// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "remix_tests.sol";
import "remix_accounts.sol";
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
        address receiver = TestsAccounts.getAccount(1);
        uint256 amount = 100 * 10**18;
        token.transfer(receiver, amount);
        Assert.equal(token.balanceOf(receiver), amount, "Receiver should get 100 tokens");
    }

    function checkApproveAndTransferFrom() public {
        // Test contract approves ITSELF to spend its own tokens, 
        // to test approve + transferFrom logic without needing a separate spender contract.
        address spender = address(this);
        address receiver = TestsAccounts.getAccount(1);
        uint256 amount = 50 * 10**18;

        token.approve(spender, amount);
        Assert.equal(token.allowance(address(this), spender), amount, "Allowance should be set correctly");

        bool success = token.transferFrom(address(this), receiver, amount);
        Assert.ok(success, "transferFrom should succeed");
        
        Assert.equal(token.balanceOf(receiver), amount, "TransferFrom should move tokens to receiver");
        Assert.equal(token.allowance(address(this), spender), 0, "Allowance should decrease to 0");
    }

    // Negative tests
    function checkTransferFailsExceedingBalance() public {
        address receiver = TestsAccounts.getAccount(1);
        uint256 amount = token.balanceOf(address(this)) + 1; // More than balance
        
        // Low-level call to catch revert
        (bool success, ) = address(token).call(
            abi.encodeWithSignature("transfer(address,uint256)", receiver, amount)
        );
        Assert.equal(success, false, "Transfer exceeding balance should revert");
    }

    function checkTransferFromFailsExceedingAllowance() public {
        address spender = address(this);
        address receiver = TestsAccounts.getAccount(1);
        uint256 amount = 50 * 10**18;

        token.approve(spender, amount);
        
        // Attempt to transfer more than allowance
        uint256 tooMuch = amount + 1;
        (bool success, ) = address(token).call(
            abi.encodeWithSignature("transferFrom(address,address,uint256)", address(this), receiver, tooMuch)
        );
        Assert.equal(success, false, "transferFrom exceeding allowance should revert");
    }

    function checkTransferToZeroAddressFails() public {
        uint256 amount = 100 * 10**18;
        
        (bool success, ) = address(token).call(
            abi.encodeWithSignature("transfer(address,uint256)", address(0), amount)
        );
        Assert.equal(success, false, "Transfer to zero address should revert");
    }

    function checkApproveToZeroAddressFails() public {
        uint256 amount = 100 * 10**18;
        
        (bool success, ) = address(token).call(
            abi.encodeWithSignature("approve(address,uint256)", address(0), amount)
        );
        Assert.equal(success, false, "Approve to zero address should revert");
    }

    // =========================================================================
    // Invariant / Property Tests
    // =========================================================================

    function checkInvariantTotalSupplyConstant() public {
        uint256 initialSupply = token.totalSupply();
        
        address receiver = TestsAccounts.getAccount(1);
        token.transfer(receiver, 100 * 10**18);
        
        Assert.equal(token.totalSupply(), initialSupply, "INV-001: Total supply must never change");
    }

    function checkInvariantBalancesSum() public {
        uint256 initialSupply = token.totalSupply();
        address receiver = TestsAccounts.getAccount(1);
        
        // Before transfer
        uint256 sumBefore = token.balanceOf(address(this)) + token.balanceOf(receiver);
        Assert.equal(sumBefore, initialSupply, "INV-002: Sum of balances must equal total supply before transfer");
        
        // Transfer
        token.transfer(receiver, 100 * 10**18);
        
        // After transfer
        uint256 sumAfter = token.balanceOf(address(this)) + token.balanceOf(receiver);
        Assert.equal(sumAfter, initialSupply, "INV-002: Sum of balances must equal total supply after transfer");
    }
}
