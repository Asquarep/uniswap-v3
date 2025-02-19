import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const main = async () => {
    const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const positionManagerAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; 
    const poolFee = 3000; 
    
    const theAddressIFoundWithUSDCAndDAI = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";
    
    await helpers.impersonateAccount(theAddressIFoundWithUSDCAndDAI);
    const impersonatedSigner = await ethers.getSigner(theAddressIFoundWithUSDCAndDAI);

    let usdcContract = await ethers.getContractAt("IERC20", USDCAddress);
    let daiContract = await ethers.getContractAt("IERC20", DAIAddress);
    let positionManager = await ethers.getContractAt("INonfungiblePositionManager", positionManagerAddress);

    const usdcBal = await usdcContract.balanceOf(impersonatedSigner.address);
    const daiBal = await daiContract.balanceOf(impersonatedSigner.address);

    console.log("Impersonated account USDC balance:", ethers.formatUnits(usdcBal, 6));
    console.log("Impersonated account DAI balance:", ethers.formatUnits(daiBal, 18));

    let AmtADesired = ethers.parseUnits("100000", 6);
    let AmtBDesired = ethers.parseUnits("100000", 18);

    await usdcContract.connect(impersonatedSigner).approve(positionManagerAddress, AmtADesired);
    await daiContract.connect(impersonatedSigner).approve(positionManagerAddress, AmtBDesired);

    console.log("-------------------------- Adding liquidity to Uniswap V3 -------------");

    let tx = await positionManager.connect(impersonatedSigner).mint({
        token0: USDCAddress,
        token1: DAIAddress,
        fee: poolFee,
        tickLower: -887220,
        tickUpper: 887220,
        amount0Desired: AmtADesired,
        amount1Desired: AmtBDesired,
        amount0Min: ethers.parseUnits("99000", 6),
        amount1Min: ethers.parseUnits("99000", 18),
        recipient: impersonatedSigner.address,
        deadline: await helpers.time.latest() + 500
    });

    await tx.wait();

    console.log("-------------------------- Liquidity added to Uniswap V3 -------------");
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
