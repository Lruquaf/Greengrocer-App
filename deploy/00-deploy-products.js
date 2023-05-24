const {network} = require("hardhat")
const {networkConfig, developmentChains} = require("../helper-hardhat-config")
const {verify} = require("../utils/verify")

const potatoUri = "potato.com"
const onionUri = "onion.com"

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId

    let {seller} = await getNamedAccounts()

    if (!developmentChains.includes(network.name)) {
        seller = networkConfig[chainId]["seller"]
    }

    const args = [seller, potatoUri, onionUri]

    console.log("Deploying contract...")

    const products = await deploy("Products", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.SEPOLIA_ETHERSCAN_API_KEY
    ) {
        await verify(products.address, args)
    }

    log("--------------------------------------------------------------")
}

module.exports.tags = ["all", "products"]
