# Partial delegation contract

- Delegator can delegate a percentage of their ERC-20 token.
- Delegator can undelegate a percentage of their ERC-20 token.
- The delegator can have percentages delegated to multiple delegates.
- Delegator cannot delegate over 100% of their ERC-20 token.
- The delegator cannot be a delegate

## Snapshot strategy
```
{
  "address": "0xF8B53db7136F9Fbf2F7C0a79e4Ff5670f10061c3",
  "symbol": "TACO",
  "decimals": 18,
  "args": ["%{address}", "0xE13FB676E9bdd7AFda91495eC4e027FC63212FC3"],
  "methodABI": {
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      }
    ],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
}
```