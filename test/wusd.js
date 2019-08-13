const { time, expectRevert, balance } = require('openzeppelin-test-helpers');

const toSecs        = require('@mblackmblack/to-seconds');
const { BigNumber } = require('bignumber.js');

BigNumber.set({ DECIMAL_PLACES: 0, ROUNDING_MODE: 0 })

const ExampleDaiCoin = artifacts.require("./ExampleDaiCoin.sol");
const ExampleUsdcCoin = artifacts.require("./ExampleUsdcCoin.sol");
const ExampleTusdCoin = artifacts.require("./ExampleTusdCoin.sol");
const ExamplePaxCoin = artifacts.require("./ExamplePaxCoin.sol");
const WUSD = artifacts.require("./WUSD.sol");

const utils = require('./helpers/Utils.js');

const { rateToSec, numToBytes32 } = utils;
const { toWei, fromWei, asciiToHex, hexToNumberString, hexToNumber, padLeft, padRight, numberToHex } = web3.utils;

contract("WUSD", accounts => {
  const account1 = accounts[0]
  const account2 = accounts[1]

  beforeEach(async function () {
    this.dai  = await ExampleDaiCoin.deployed()
    this.usdc = await ExampleUsdcCoin.deployed()
    this.tusd = await ExampleTusdCoin.deployed()
    this.pax  = await ExamplePaxCoin.deployed()
    this.wusd = await WUSD.deployed()

    this.dai.approve(this.wusd.address, toWei('100', 'ether'))
    this.usdc.approve(this.wusd.address, toWei('100', 'ether'))
    this.tusd.approve(this.wusd.address, toWei('100', 'ether'))
    this.pax.approve(this.wusd.address, toWei('100', 'ether'))
  })

  describe('deposit', function() {
    it('should update total supply on deposit', async function() {
      const wusdBalBefore = await this.wusd.balanceOf.call(account1)
      const wusdSupplyBefore = await this.wusd.totalSupply.call()

      this.wusd.deposit(toWei('4', 'ether'))

      const wusdBalAfter = await this.wusd.balanceOf.call(account1)
      const wusdSupplyAfter = await this.wusd.totalSupply.call()

      assert.equal(BigNumber(wusdBalBefore).plus(toWei('4', 'ether')).toFixed(), wusdBalAfter.toString())
      assert.equal(BigNumber(wusdSupplyBefore).plus(toWei('4', 'ether')).toFixed(), wusdSupplyAfter.toString())
    })
  })
})
