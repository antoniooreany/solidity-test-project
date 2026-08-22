// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "remix_tests.sol";
import "../contracts/Counter.sol";

/// @title Counter Contract Unit Tests
/// @notice Tests for specs/001-counter/spec.md requirements
contract CounterTest {
    Counter private counter;

    /// @dev Deploy a fresh Counter before each test
    function beforeEach() public {
        counter = new Counter();
    }

    // =========================================================================
    // Positive Tests
    // =========================================================================

    /// @dev FR-001: Counter initial value must be zero after deployment
    function checkInitialCountIsZero() public {
        Assert.equal(
            counter.getCount(),
            0,
            "FR-001: Initial count should be 0"
        );
    }

    /// @dev FR-002: Increment must increase counter by exactly 1
    function checkIncrementByOne() public {
        counter.increment();
        Assert.equal(
            counter.getCount(),
            1,
            "FR-002: Count should be 1 after one increment"
        );
    }

    /// @dev FR-002: Multiple increments must each increase by exactly 1
    function checkMultipleIncrements() public {
        counter.increment();
        counter.increment();
        counter.increment();
        Assert.equal(
            counter.getCount(),
            3,
            "FR-002: Count should be 3 after three increments"
        );
    }

    /// @dev FR-003: getCount must return the current counter value
    function checkGetCountReturnsValue() public {
        Assert.equal(
            counter.getCount(),
            0,
            "FR-003: getCount should return 0 initially"
        );
        counter.increment();
        Assert.equal(
            counter.getCount(),
            1,
            "FR-003: getCount should return 1 after increment"
        );
    }

    /// @dev INV-003: After N calls to increment(), getCount() must return N
    function checkCountAfterNIncrements() public {
        uint256 n = 5;
        for (uint256 i = 0; i < n; i++) {
            counter.increment();
        }
        Assert.equal(
            counter.getCount(),
            n,
            "INV-003: Count should equal number of increments"
        );
    }

    /// @dev FR-004: Verify event emission via state change validation
    ///      Note: remix_tests.sol does not support direct event assertion,
    ///      so we validate the state change that accompanies the event.
    function checkIncrementChangesState() public {
        uint256 before_count = counter.getCount();
        counter.increment();
        uint256 after_count = counter.getCount();
        Assert.equal(
            after_count,
            before_count + 1,
            "FR-004: State must change with each increment (event accompanies)"
        );
    }

    /// @dev FR-005: Any address can call increment (no access control)
    ///      In Remix tests, the test contract itself is the caller.
    ///      This test validates that calling increment does not revert.
    function checkAnyAddressCanIncrement() public {
        // The test contract (this) acts as the caller.
        // If access were restricted, this call would revert.
        counter.increment();
        Assert.equal(
            counter.getCount(),
            1,
            "FR-005: Any address should be able to increment"
        );
    }

    // =========================================================================
    // Invariant / Property Tests
    // =========================================================================

    /// @dev INV-001: Counter value must never decrease
    function checkCounterNeverDecreases() public {
        uint256 previousCount = counter.getCount();
        for (uint256 i = 0; i < 3; i++) {
            counter.increment();
            uint256 currentCount = counter.getCount();
            Assert.ok(
                currentCount >= previousCount,
                "INV-001: Counter must never decrease"
            );
            previousCount = currentCount;
        }
    }

    /// @dev INV-002: Counter value must only change via increment()
    ///      Verified structurally: no other state-changing functions exist.
    ///      This test confirms getCount is view-only (does not modify state).
    function checkGetCountIsReadOnly() public {
        counter.increment();
        uint256 count1 = counter.getCount();
        uint256 count2 = counter.getCount();
        Assert.equal(
            count1,
            count2,
            "INV-002: Calling getCount multiple times must return same value"
        );
    }
}
