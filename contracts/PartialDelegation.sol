// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./IERC20.sol";
import "hardhat/console.sol";

contract PartialDelegation {
  struct Delegation {
    address delegate;
    address token;
    uint256 amount;
  }

  mapping(address => Delegation[]) delegations;
  address[] delegators;

  function delegate(address _delegate, address _token, uint256 _amount) public {
    IERC20 token = IERC20(_token);
    uint256 tokenBalance = token.balanceOf(msg.sender);
    require(tokenBalance >= _amount, "Not enough balance");
    Delegation[] memory _delegations = delegations[msg.sender];
    uint256 _delegationBalance = 0;
    for (uint256 i = 0; i < _delegations.length; i++) {
      Delegation memory _delegation = _delegations[i];
      if(_delegation.delegate == _delegate && _delegation.token == _token) {
        _delegationBalance += _delegation.amount;
      }
    }
    require(tokenBalance >= _delegationBalance + _amount, "Delegated too much");
    Delegation memory delegation = Delegation(_delegate, _token, _amount);
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

  function isDelegator (address _address) private view returns (bool) {
    for (uint256 i = 0; i < delegators.length; i++) {
      if (delegators[i] == _address) {
        return true;
      }
    }
    return false;
  }

  function getBalance (address _address, address _token) public view returns (uint256) {
    IERC20 token = IERC20(_token);
    uint256 tokenBalance = token.balanceOf(_address);
    for (uint256 i = 0; i < delegators.length; i++) {
      address delegator = delegators[i];
      Delegation[] memory _delegations = delegations[delegator];
      for (uint256 j = 0; j < _delegations.length; j++) {
        Delegation memory _delegation = _delegations[j];
        if(_delegation.delegate == _address && _delegation.token == _token) {
          tokenBalance += _delegation.amount;
        }
      }
    }
    if(isDelegator(_address)) {
      Delegation[] memory _delegations = delegations[_address];
      for (uint256 j = 0; j < _delegations.length; j++) {
        Delegation memory _delegation = _delegations[j];
        if(_delegation.token == _token) {
          tokenBalance -= _delegation.amount;
        }
      }
    }
    return tokenBalance;
  }
}