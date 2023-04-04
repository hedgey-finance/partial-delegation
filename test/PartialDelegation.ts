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
      const delegatorBalance = await euro.balanceOf(delegator.address);
      await partialDelegation.delegate(delegate.address, euro.address, 10);
      const delegateBalance = await partialDelegation.getBalance(delegate.address, euro.address);
      expect(delegateBalance).to.equal(delegatorBalance.mul(10).div(100));
    });

    it("should delegate tokens to multiple delegates", async () => {
      const { euro, partialDelegation } = await loadFixture(fixture);
      const [delegator, delegate1, delegate2] = await ethers.getSigners();
      const delegatorBalance = await euro.balanceOf(delegator.address);
      await partialDelegation.delegate(delegate1.address, euro.address, 50);
      await partialDelegation.delegate(delegate2.address, euro.address, 50);
      const delegate1Balance = await partialDelegation.getBalance(delegate1.address, euro.address);
      const delegate2Balance = await partialDelegation.getBalance(delegate2.address, euro.address);
      expect(delegate1Balance).to.equal(delegatorBalance.mul(50).div(100));
      expect(delegate2Balance).to.equal(delegatorBalance.mul(50).div(100));
    });

    it("should fail if delegate address is zero", async () => {
      const { partialDelegation } = await loadFixture(fixture);
      const [delegator] = await ethers.getSigners();
      await expect(partialDelegation.delegate(ethers.constants.AddressZero, ethers.constants.AddressZero, 10)).to.be.revertedWith("Delegate must be a valid address");
    });

    it("should fail if token address is zero", async () => {
      const { partialDelegation } = await loadFixture(fixture);
      const [delegator] = await ethers.getSigners();
      await expect(partialDelegation.delegate(delegator.address, ethers.constants.AddressZero, 10)).to.be.revertedWith("Token must be a valid address");
    });

    it("should fail if delegate percentage is zero", async () => {
      const { partialDelegation } = await loadFixture(fixture);
      const [delegator] = await ethers.getSigners();
      await expect(partialDelegation.delegate(delegator.address, delegator.address, 0)).to.be.revertedWith("Percentage must be greater than 0");
    });

    it("should fail if delegate percentage is greater than 100", async () => {
      const { partialDelegation } = await loadFixture(fixture);
      const [delegator] = await ethers.getSigners();
      await expect(partialDelegation.delegate(delegator.address, delegator.address, 101)).to.be.revertedWith("Percentage must be less than or equal to 100");
    });

    it("should fail if percentage delegated is greater than 100", async () => {
      const { euro, partialDelegation } = await loadFixture(fixture);
      const [delegator, delegate1, delegate2] = await ethers.getSigners();
      const delegatorBalance = await euro.balanceOf(delegator.address);
      await partialDelegation.delegate(delegate1.address, euro.address, 50);
      await expect(partialDelegation.delegate(delegate2.address, euro.address, 60)).to.be.revertedWith("Total delegated is greater than 100%");
    });

    it("should remove delegation", async () => {
      const { euro, partialDelegation } = await loadFixture(fixture);
      const [delegator, delegate] = await ethers.getSigners();
      await partialDelegation.delegate(delegate.address, euro.address, 10);
      await partialDelegation.removeDelegation(delegate.address, euro.address);
      const delegateBalance = await partialDelegation.getBalance(delegate.address, euro.address);
      expect(delegateBalance).to.equal(0);
    });
  });
});
