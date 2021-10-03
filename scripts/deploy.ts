import { AnimatedNFT__factory } from "../typechain"
import { ethers } from "hardhat"

const main = async () => {
  const [owner] = await ethers.getSigners()
  const nftContractFactory = new AnimatedNFT__factory(owner)
  const nftContract = await nftContractFactory.deploy()
  await nftContract.deployed()
  console.log("Contract deployed to:", nftContract.address)

  const tx = await nftContract.makeAnNFT()
  await tx.wait()
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
