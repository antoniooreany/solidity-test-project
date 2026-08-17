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

    function checkTotalSupply() public {
        uint256 expectedSupply = 1000000 * 10**18;
        Assert.equal(token.totalSupply(), expectedSupply, "Total supply should be 1 million with 18 decimals");
    }

    function checkDeployerBalance() public {
        uint256 expectedSupply = 1000000 * 10**18;
        Assert.equal(token.balanceOf(address(this)), expectedSupply, "Deployer should receive all initial tokens");
    }
}
