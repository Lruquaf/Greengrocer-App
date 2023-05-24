import {ethers} from "./ethers-5.6.esm.min.js"
import {address, abi} from "./constants.js"

const connectButton = document.getElementById("connect")
const refreshButton = document.getElementById("refresh")
const withdrawButton = document.getElementById("withdraw")

let amountParaP = document.getElementById("amountP")
let priceParaP = document.getElementById("priceP")
const buyButtonP = document.getElementById("buyPotato")

let amountParaO = document.getElementById("amountO")
let priceParaO = document.getElementById("priceO")
const buyButtonO = document.getElementById("buyOnion")

connectButton.onclick = connect
refreshButton.onclick = refresh
withdrawButton.onclick = withdraw

buyButtonP.onclick = buyPotato
buyButtonO.onclick = buyOnion

async function connect() {
    if (window.ethereum !== "undefined") {
        console.log("I see a metamask!")
        await window.ethereum.request({method: "eth_requestAccounts"})
        connectButton.innerHTML = "Connected!"
    } else {
        alert("Please install a metamask!")
    }
}
async function refresh() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(address, abi, signer)
        const potatoAmount = await contract.getAmount("0")
        const onionAmount = await contract.getAmount("1")
        const potatoPrice = await contract.getPrice("0")
        const onionPrice = await contract.getPrice("1")

        amountParaP.innerHTML = `Amount: ${potatoAmount}`
        amountParaO.innerHTML = `Amount: ${onionAmount}`
        priceParaP.innerHTML = `Price: ${ethers.utils.formatEther(
            potatoPrice
        )} ETH`
        priceParaO.innerHTML = `Price: ${ethers.utils.formatEther(
            onionPrice
        )} ETH`
    }
}

async function buyPotato() {
    console.log("Buying a potato...")
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(address, abi, signer)
        const potatoPrice = await contract.getPrice("0")
        try {
            const txResponse = await contract.buyProduct("0", {
                value: potatoPrice.toString(),
            })
            await listenForTxMine(txResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
        refresh()
    }
}

async function buyOnion() {
    console.log("Buying an onion...")
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(address, abi, signer)
        const onionPrice = await contract.getPrice("1")
        try {
            const txResponse = await contract.buyProduct("1", {
                value: onionPrice.toString(),
            })
            await listenForTxMine(txResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
        refresh()
    }
}

async function withdraw() {
    console.log("Withdrawing fees...")
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(address, abi, signer)

        try {
            const txResponse = await contract.withdraw()
            await listenForTxMine(txResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
        refresh()
    }
}

function listenForTxMine(txResponse, provider) {
    console.log(`Mining ${txResponse.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(txResponse.hash, (txReceipt) => {
            console.log(
                `Completed with ${txReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}
