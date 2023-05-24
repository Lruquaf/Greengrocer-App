const {network} = require("hardhat")
const {networkConfig, developmentChains} = require("../helper-hardhat-config")
const {verify} = require("../utils/verify")

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()

    const products = await ethers.getContract("Products")

    let {seller} = await getNamedAccounts()
    let {wholesaler} = await getNamedAccounts()

    const chainId = network.config.chainId

    if (!developmentChains.includes(network.name)) {
        seller = networkConfig[chainId]["seller"]
        wholesaler = networkConfig[chainId]["wholesaler"]
    }

    console.log("Deploying contract...")

    const args = [products.address, seller, wholesaler]

    const greengrocer = await deploy("Greengrocer", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.SEPOLIA_ETHERSCAN_API_KEY
    ) {
        await verify(greengrocer.address, args)
    }

    log("--------------------------------------------------------------")
}

module.exports.tags = ["all", "greengrocer"]
