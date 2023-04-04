// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./IERC20.sol";

contract PartialDelegation {
  struct Delegation {
    address delegate;
    address token;
    uint percentage;
  }

  mapping(address => Delegation[]) delegations;
  address[] delegators;

  function delegate(address _delegate, address _token, uint _percentage) public {
    require(_delegate != address(0), "Delegate must be a valid address");
    require(_percentage > 0, "Percentage must be greater than 0");
    require(_percentage <= 100, "Percentage must be less than or equal to 100");
    require(_token != address(0), "Token must be a valid address");
    Delegation[] storage _delegations = delegations[msg.sender];

    uint totalDelegation = 0;
    for (uint256 i = 0; i < _delegations.length; i++) {
      if(_delegations[i].token == _token) {
        totalDelegation += _delegations[i].percentage;
      }
    }
    require(totalDelegation + _percentage <= 100, "Total delegated is greater than 100%");
    for (uint256 i = 0; i < _delegations.length; i++) {
      Delegation storage _delegation = _delegations[i];
      if(_delegation.delegate == _delegate && _delegation.token == _token) {
        uint newPercentage = _delegation.percentage + _percentage;
        require(newPercentage <= 100, "Delegated too much");
        _delegation.percentage = newPercentage;
        return;
      }
    }
    Delegation memory delegation = Delegation(_delegate, _token, _percentage);
    delegations[msg.sender].push(delegation);
    delegators.push(msg.sender);
  }

  function removeDelegation (address _delegate, address _token) public {
    Delegation[] memory _delegations = delegations[msg.sender];
    for (uint256 i = 0; i < _delegations.length; i++) {
      Delegation memory _delegation = _delegations[i];
      if(_delegation.delegate == _delegate && _delegation.token == _token) {
        delete delegations[msg.sender][i];
      }
    }
  }

  function getBalance(address _address, address _token) public view returns (uint256) {
    for (uint256 i = 0; i < delegators.length; i++) {
      address delegator = delegators[i];
      Delegation[] memory _delegations = delegations[delegator];
      for (uint256 j = 0; j < _delegations.length; j++) {
        Delegation memory _delegation = _delegations[j];
        if(_delegation.delegate == _address && _delegation.token == _token) {
          IERC20 token = IERC20(_token);
          uint256 balance = token.balanceOf(delegator);
          return balance * _delegation.percentage / 100;
        }
      }
    }
    return 0;
  }
}