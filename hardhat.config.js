require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://sepolia"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey"
const SELLER_PRIVATE_KEY = process.env.SELLER_PRIVATE_KEY || "0xkey"
const SEPOLIA_ETHERSCAN_API_KEY = process.env.SEPOLIA_ETHERSCAN_API_KEY || "key"
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.8",
    defaultNetwork: "hardhat",
    networks: {
        sepolia: {
            chainId: 11155111,
            blockConfirmations: 6,
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY, SELLER_PRIVATE_KEY],
        },
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
        },
    },
    etherscan: {
        apiKey: {
            sepolia: SEPOLIA_ETHERSCAN_API_KEY,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
            sepolia: 0,
        },
        attacker: {
            default: 1,
        },
        seller: {
            default: 2,
            sepolia: 1,
        },
        wholesaler: {
            default: 3,
        },
        buyer: {
            default: 4,
        },
    },
}
