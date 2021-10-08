import { ethers } from "hardhat"
import { RandomWordsNFT__factory } from "../generated-types/typechain"
import { BigNumber } from "ethers"

const main = async () => {
  const [owner] = await ethers.getSigners()
  const nftContractFactory = new RandomWordsNFT__factory(owner)
  const nftContract = await nftContractFactory.deploy()
  await nftContract.deployed()
  console.log("Contract deployed to:", nftContract.address)

  const tx = await nftContract.makeAnNFT()
  await tx.wait()

  const tx2 = await nftContract.makeAnNFT()
  await tx2.wait()

  const tx3 = await nftContract.makeAnNFT()
  await tx3.wait()
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

runMain()
