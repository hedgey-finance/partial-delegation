import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("PartialDelegation", function () {
  const fixture = async () => {
    const Euro = await ethers.getContractFactory("Euro");
    const euro = await Euro.deploy("1000000");

    const PartialDelegation = await ethers.getContractFactory("PartialDelegation");
    const partialDelegation = await PartialDelegation.deploy();

    return { euro, partialDelegation } ;
  }

  describe("Delegate", function () {
    it("should delegate tokens", async () => {
      const { euro, partialDelegation } = await loadFixture(fixture);
      const [delegator, delegate] = await ethers.getSigners();
      await partialDelegation.delegate(delegate.address, euro.address, "1000");
      const delegateBalance = await partialDelegation.getBalance(delegate.address, euro.address);
      expect(delegateBalance).to.equal("1000");
      await partialDelegation.removeDelegation(delegate.address, euro.address);
      const delegateBalanceAfterRemoval = await partialDelegation.getBalance(delegate.address, euro.address);
      expect(delegateBalanceAfterRemoval).to.equal("0");
    });

    it("should reduce balance when tokens are delegated", async function () {
      const { euro, partialDelegation } = await loadFixture(fixture);
      const [delegator, delegate] = await ethers.getSigners();
      await partialDelegation.delegate(delegate.address, euro.address, "1000");
      const delegateBalance = await partialDelegation.getBalance(delegate.address, euro.address);
      expect(delegateBalance).to.equal("1000");
      const delegatorBalance = await partialDelegation.getBalance(delegator.address, euro.address);
      expect(delegatorBalance).to.equal("999000");
    });

    it("should remove the delegations and restore the balances", async function () {
      const { euro, partialDelegation } = await loadFixture(fixture);
      const [delegator, delegate] = await ethers.getSigners();
      await partialDelegation.delegate(delegate.address, euro.address, "1000");
      await partialDelegation.removeDelegation(delegate.address, euro.address);
      const delegateBalanceAfterRemoval = await partialDelegation.getBalance(delegate.address, euro.address);
      expect(delegateBalanceAfterRemoval).to.equal("0");
      const delegatorBalanceAfterRemoval = await partialDelegation.getBalance(delegator.address, euro.address);
      expect(delegatorBalanceAfterRemoval).to.equal("1000000");
    });
  });
});
