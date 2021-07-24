import defaultContracts from "config/contracts";
import { BigNumber, constants, Contract, utils } from "ethers";
import { poolIds, farmIds } from "config/pools";

// QUERIES

// -------- POOL STATS-------------
export async function getPoolPublicData(pid: number, masterChef: Contract) {
  const poolInfo = await masterChef.poolInfo(pid);

  const multiplier = poolInfo.allocPoint.div(100).toString();
  const active = multiplier !== "0";
  const depositFees = BigNumber.from(poolInfo.depositFeeBP).div(100).toNumber();
  const lpAddress = poolInfo.lpToken;

  return {
    multiplier,
    active,
    depositFees,
    lpAddress,
  };
}

export async function getPoolLpInfo(lpContract: Contract) {
  const symbol = await lpContract.symbol();
  const totalStaked = await lpContract.balanceOf(defaultContracts.masterChef.address);

  return { token: symbol, totalStaked };
}

export async function getPoolUserInfo(
  pid: number,
  masterChef: Contract,
  lpContract: Contract,
  address?: string
) {
  const irisEarned = utils.formatEther(await masterChef.pendingIris(pid, address));
  const userInfo = await masterChef.userInfo(pid, address);

  const lpStaked = utils.formatEther(userInfo.amount);
  const hasStaked = !(userInfo.amount as BigNumber).isZero();

  const allowance: BigNumber = await lpContract.allowance(
    address,
    defaultContracts.masterChef.address
  );
  const hasApprovedPool = !allowance.isZero();

  return {
    hasStaked,
    hasApprovedPool,
    irisEarned,
    lpStaked,
  };
}

export async function getPoolData(
  pid: number,
  account: string,
  masterChef: Contract,
  getLpContract: (address: string) => Contract
) {
  const poolPublicData = await getPoolPublicData(pid, masterChef);
  const lpContract = getLpContract(poolPublicData.lpAddress);
  const poolLpData = await getPoolLpInfo(lpContract);
  const poolUserData = await getPoolUserInfo(pid, masterChef, lpContract, account);

  // fetch apy/apr

  return {
    pid,
    ...poolPublicData,
    ...poolUserData,

    lpToken: poolLpData.token,
    totalStaked: poolLpData.totalStaked,

    apr: 0,
    apy: "0",
  };
}

export async function getIrisToHarvest(account: string, masterChefContract: Contract) {
  const totalIrisToHarvest = [...farmIds, ...poolIds].reduce(async (total, pid) => {
    const irisEarned = await masterChefContract.pendingIris(pid, account);
    return total.add(irisEarned);
  }, BigNumber.from(0));

  return totalIrisToHarvest;
}

export async function getIrisStat(irisContract: Contract) {
  const irisPrice = 1; // TODO: get real price

  const maximumSupply = 1_000_000;
  const totalMinted = (await irisContract.totalSupply()) as BigNumber;
  const totalBurned = (await irisContract.balanceOf(constants.AddressZero)) as BigNumber;

  const circulatingSupply = totalMinted.sub(totalBurned);
  const marketCap = circulatingSupply.mul(irisPrice);

  return {
    maximumSupply,
    totalMinted: utils.formatEther(totalMinted),
    totalBurned: utils.formatEther(totalBurned),
    circulatingSupply: utils.formatEther(circulatingSupply),
    marketCap: utils.formatEther(marketCap),
  };
}

// ACTIONS
export async function approveLpContract(lpContract: Contract) {
  const approveTx = await lpContract.approve(
    defaultContracts.masterChef.address,
    constants.MaxUint256
  );
  await approveTx.wait();
}

export async function getTokenBalance(token: Contract, address: string) {
  return utils.formatEther(await token.balanceOf(address));
}

export async function depositIntoPool(
  masterChef: Contract,
  pid: number,
  amount: string,
  referral: string
) {
  const tx = await masterChef.deposit(pid, utils.parseEther(amount), referral);
  await tx.wait();
}

export async function withdrawFromPool(masterChef: Contract, pid: number, amount: string) {
  const tx = await masterChef.withdraw(pid, utils.parseEther(amount));
  await tx.wait();
}

export async function harvestFromAll(masterChef: Contract) {
  return Promise.all(
    [...farmIds, ...poolIds].map(async (pid) => {
      const tx = await masterChef.deposit(pid, utils.parseEther("0"), constants.AddressZero);
      await tx.wait();
    })
  );
}
