// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import 'remix_tests.sol';
import '../contracts/SimpleStorage.sol';
import 'remix_accounts.sol';

contract SimpleStorageTest {
  SimpleStorage private simpleStorage;

  // Run before each test
  function beforeEach() public {
    simpleStorage = new SimpleStorage();
  }

  // Test 1: Initial value is empty string
  function checkInitialValueIsEmpty() public {
    Assert.equal(simpleStorage.getValue(), '', 'Initial value should be empty string');
  }

  // Test 2: Owner is correctly set
  function checkOwnerIsDeployer() public {
    // In Remix tests, the test contract itself acts as the deployer
    Assert.equal(
      simpleStorage.owner(),
      address(this),
      'Owner should be the test contract deployer'
    );
  }

  // Test 3: Owner can update the value
  function checkOwnerCanSetValue() public {
    simpleStorage.setValue('Hello Web3');
    Assert.equal(simpleStorage.getValue(), 'Hello Web3', 'Value should be updated to Hello Web3');
  }

  // Test 4: Overwriting state works correctly
  function checkSubsequentUpdatesReplaceValue() public {
    simpleStorage.setValue('First Update');
    simpleStorage.setValue('Second Update');
    Assert.equal(
      simpleStorage.getValue(),
      'Second Update',
      'State should replace value, not append'
    );
      // Test 5: Non-owner cannot update the value
    function checkNonOwnerCannotSetValue() public {
        address nonOwner = TestsAccounts.getAccount(1);
        // Attempt to call setValue from a non-owner using low‑level call
        (bool success, ) = address(simpleStorage).call(
            abi.encodeWithSignature("setValue(string)", "hacked")
        );
        Assert.equal(success, false, "Non-owner must not be able to set value");
    }
}

}
