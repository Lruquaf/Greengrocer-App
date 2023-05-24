const {getNamedAccounts} = require("hardhat")

async function main() {
    const {seller} = await getNamedAccounts()
    const {wholesaler} = await getNamedAccounts()

    let greengrocer = await ethers.getContract("Greengrocer", seller)
    const sellerWithdrawTx = await greengrocer.withdraw()
    await sellerWithdrawTx.wait(1)

    greengrocer = await ethers.getContract("Greengrocer", wholesaler)
    const wholesalerWithdrawTx = await greengrocer.withdraw()
    await wholesalerWithdrawTx.wait(1)

    console.log("Fees were withdrawn!")

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
