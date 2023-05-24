const {getNamedAccounts, ethers} = require("hardhat")

async function main() {
    const {deployer} = await getNamedAccounts()
    const {seller} = await getNamedAccounts()
    let products = await ethers.getContract("Products", seller)
    const greengrocer = await ethers.getContract("Greengrocer", seller)

    const potatoPrice = ethers.utils.parseEther("0.01")
    const onionPrice = ethers.utils.parseEther("0.02")

    console.log("Setting prices...")

    const setPotatoPriceTx = await greengrocer.setPrice("0", potatoPrice)
    await setPotatoPriceTx.wait(1)
    const setOnionPriceTx = await greengrocer.setPrice("1", onionPrice)
    await setOnionPriceTx.wait(1)

    console.log("Prices were set!")

    console.log("Minting products...")

    const mintPotatoTx = await products.mint("0", "5")
    await mintPotatoTx.wait(1)
    const mintOnionTx = await products.mint("1", "5")
    await mintOnionTx.wait(1)
    const approveTx = await products.setApprovalForAll(greengrocer.address, true)
    await approveTx.wait(1)

    console.log("Products were minted!")

    products = await ethers.getContract("Products", deployer)

    console.log("Setting greengrocer contract...")

    const tx = await products.setGreengrocer(greengrocer.address)
    await tx.wait(1)

    console.log("Greengrocer contract was set!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
