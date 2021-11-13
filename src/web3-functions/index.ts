import defaultContracts from "config/contracts";
import { BigNumber, constants, Contract, utils } from "ethers";

// QUERIES
export async function getFarmStats(poolContracts: Contract[], farmContracts: Contract[]) {
  // in this function we're assuming all tokens are worth 1$

  const totalValueInPools: BigNumber = await poolContracts.reduce(async (_total, lpContract) => {
    const tokenPrice = 0; // TODO: get real price

    const total = await _total;
    const totalLpStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);
    return total.add(totalLpStaked.mul(tokenPrice));
  }, Promise.resolve(BigNumber.from(0)));

  const totalValueInFarms: BigNumber = await farmContracts.reduce(async (_total, lpContract) => {
    const tokenPrice = 0; // TODO: get real price

    const total = await _total;
    const totalLpStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);
    return total.add(totalLpStaked.mul(tokenPrice));
  }, Promise.resolve(BigNumber.from(0)));

  const tvl = totalValueInPools.add(totalValueInFarms);

  return {
    tvl: utils.formatEther(tvl),
    totalValueInFarms: utils.formatEther(totalValueInFarms),
    totalValueInPools: utils.formatEther(totalValueInPools),
  };
}

export async function getPresaleInfo(fenixContract: Contract, currentBlock: number) {
  const fenixRemaining = await fenixContract.fenixRemaining();
  const fenixPrice = await fenixContract.salePriceE35();
  const maxFenix = await fenixContract.fenixMaximumSupply();
  const maxFenixToPurchase = await fenixContract.maxFenixPurchase();

  const presaleStartBlock = await fenixContract.startBlock();
  const presaleEndBlock = await fenixContract.endBlock();

  const timeToStartPresale = presaleStartBlock.sub(currentBlock || 0).toNumber();
  const timeToEndPresale = presaleEndBlock.sub(currentBlock || 0).toNumber();

  return {
    fenixRemaining: utils.formatEther(fenixRemaining),
    fenixPrice: utils.formatUnits(fenixPrice, 35),
    maxFenix: utils.formatEther(maxFenix),
    maxFenixToPurchase: utils.formatEther(maxFenixToPurchase),
    presaleStartBlock,
    presaleEndBlock,
  };
}

export async function getRedeemInfo(
  redeem: Contract,
  fenix: Contract,
  plutus: Contract,
  currentBlock: number,
  address: string
) {
  const redeemBalance = await plutus.balanceOf(defaultContracts.redeem.address);
  const redeemStartBlock = await redeem.startBlock();
  const timeToStartRedeem = redeemStartBlock.sub(currentBlock || 0).toNumber();

  let allowance = BigNumber.from(0);
  if (address) {
    allowance = await fenix.allowance(address, defaultContracts.redeem.address);
  }

  return {
    redeemBalance: utils.formatEther(redeemBalance),
    blockToRedeem: timeToStartRedeem,
    hasApprovedPool: !allowance.isZero(),
  };
}

export async function getReferralCount(referral: Contract, address: string) {
  const referralCount = await referral.referralsCount(address);
  return referralCount.toNumber();
}

// ACTIONS
export async function approveLpContract(lpContract: Contract, address: string) {
  const approveTx = await lpContract.approve(address, constants.MaxUint256);
  await approveTx.wait();
}

export async function approveFenixContract(lpContract: Contract) {
  const approveTx = await lpContract.approve(defaultContracts.redeem.address, constants.MaxUint256);
  await approveTx.wait();
}

export async function getTokenBalance(token: Contract, address: string, decimals = 18) {
  return utils.formatUnits(await token.balanceOf(address), decimals);
}

export async function depositIntoPool(
  masterChef: Contract,
  pid: number,
  amount: string,
  referral: string,
  decimals: number
) {
  const tx = await masterChef.deposit(pid, utils.parseUnits(amount, decimals), referral);
  await tx.wait();
}

export async function withdrawFromPool(
  masterChef: Contract,
  pid: number,
  amount: string,
  decimals: number
) {
  const tx = await masterChef.withdraw(pid, utils.parseUnits(amount, decimals));
  await tx.wait();
}

export async function purchaseFenix(fenixContract: Contract, amount: string) {
  const tx = await fenixContract.buyFenix({ value: utils.parseEther(amount) });
  await tx.wait();
}

export async function swapFenix(redeemContract: Contract, amount: string) {
  const tx = await redeemContract.swapFenixForPlutus(utils.parseEther(amount));
  await tx.wait();
}
