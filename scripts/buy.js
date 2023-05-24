const {getNamedAccounts, ethers} = require("hardhat")

async function main() {
    const {seller} = await getNamedAccounts()
    const {buyer} = await getNamedAccounts()
    const {wholesaler} = await getNamedAccounts()
    let greengrocer = await ethers.getContract("Greengrocer", buyer)
    let products = await ethers.getContract("Products", seller)

    let startingSellerPotatoAmount = await products.balanceOf(seller, "0")
    let startingSellerOnionAmount = await products.balanceOf(seller, "1")

    console.log(
        `Seller's potato amount: ${startingSellerPotatoAmount}\nSeller's onion amount: ${startingSellerOnionAmount}`
    )

    let startingBuyerPotatoAmount = await products.balanceOf(buyer, "0")
    let startingBuyerOnionAmount = await products.balanceOf(buyer, "1")

    console.log(
        `Buyer's potato amount: ${startingBuyerPotatoAmount}\nBuyer's onion amount: ${startingBuyerOnionAmount}`
    )

    const potatoPrice = await greengrocer.prices("0")
    const onionPrice = await greengrocer.prices("1")

    console.log("Buying a potato...")
    const buyPotatoTx = await greengrocer.buyProduct("0", {value: potatoPrice})
    await buyPotatoTx.wait(1)
    console.log("Buying an onion...")
    const buyOnionTx = await greengrocer.buyProduct("1", {value: onionPrice})
    await buyOnionTx.wait(1)
    console.log("Products were bought!")

    console.log(
        "--------------------------------------------------------------------------------"
    )

    let endingSellerPotatoAmount = await products.balanceOf(seller, "0")
    let endingSellerOnionAmount = await products.balanceOf(seller, "1")
    console.log(
        `Seller's potato amount: ${endingSellerPotatoAmount}\nSeller's onion amount: ${endingSellerOnionAmount}`
    )
    let endingBuyerPotatoAmount = await products.balanceOf(buyer, "0")
    let endingBuyerOnionAmount = await products.balanceOf(buyer, "1")
    console.log(
        `Buyer's potato amount: ${endingBuyerPotatoAmount}\nBuyer's onion amount: ${endingBuyerOnionAmount}`
    )

    const sellerFee = await greengrocer.claimableFees(seller)
    const wholesalerFee = await greengrocer.claimableFees(wholesaler)
    console.log(
        `Seller's income: ${sellerFee.toString()}\nWholesaler's income: ${wholesalerFee.toString()}`
    )
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
