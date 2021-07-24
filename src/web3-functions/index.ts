import Erc20ABI from "abis/ERC20.json";
import { ContractInfo, defaultContracts } from "hooks/wallet";
import { BigNumber, constants, Contract, utils } from "ethers";

// CONFIG
const farmIds = [];
const poolIds = [0];

// TYPES
export type PoolInfo = {
  pid: number;
  active: boolean;
  staked: boolean; // requires user
  hasApprovedPool: boolean;
  token: string;
  multiplier: string;
  apy: string;
  apr: string;
  earn: string;
  depositFees: number;
  irisEarned: string; // requires user
  lpStaked: string; // requires user
  totalLiquidity: string;
  userLiquidity: string; // requires user
  lpAddress: string;
};

// HELPER
const BLOCKS_PER_YEAR = 15768000;
async function calculateAPR_V1(pool: any, contract: Contract) {
  const amount = utils.parseEther("1");
  const depositFeesInPercent = BigNumber.from(pool.depositFeeBP / 100);
  const fees = amount.mul(depositFeesInPercent).div(100);

  const multiplier = BigNumber.from(BLOCKS_PER_YEAR);
  const allocPoint = pool.allocPoint as BigNumber;
  const accIrisPerShare = pool.accIrisPerShare as BigNumber;
  const irisPerBlock = (await contract.irisPerBlock()) as BigNumber;
  const totalAllocPoint = (await contract.totalAllocPoint()) as BigNumber;

  const interest = multiplier
    .mul(allocPoint)
    .mul(accIrisPerShare)
    .mul(irisPerBlock)
    .mul(amount)
    .div(totalAllocPoint);

  console.log(interest.toString());

  const numberOfDays = BigNumber.from(365);

  const apr = fees.add(interest).div(amount).div(numberOfDays).mul(365).mul(100);
  const apy = BigNumber.from(1).add(apr.div(numberOfDays)).pow(numberOfDays).sub(1);

  return [apr, apy];
}

async function calculateAPR(pool: any, contract: any) {
  const irisPerBlock = (await contract.irisPerBlock()) as BigNumber;
  const totalAllocPoint = (await contract.totalAllocPoint()) as BigNumber;

  const poolWeight = pool.allocPoint.div(totalAllocPoint);

  const irisRewardPerBlock = irisPerBlock.mul(poolWeight).div(BigNumber.from(10).pow(18));

  const irisRewardPerYear = irisRewardPerBlock.mul(BLOCKS_PER_YEAR);
  console.log(irisRewardPerYear.toString());

  return [0, 0];
}

// QUERIES
type GetPoolDataOptions = {
  getContract: (contractInfo: ContractInfo) => Contract;
  account?: string;
};
export async function getPool(pid: number, options: GetPoolDataOptions): Promise<PoolInfo> {
  const masterChefContract = options.getContract(defaultContracts.masterChef);
  const irisContract = options.getContract(defaultContracts.irisToken);
  const pool = await masterChefContract.poolInfo(pid);

  // get basic pool info
  const multiplier = pool.allocPoint.div(100).toString();
  const active = multiplier !== "0";
  const depositFees = BigNumber.from(pool.depositFeeBP).div(100).toNumber();
  const earn = "IRIS";

  // calculate apy and apr
  // let calculatedApr = await calculateAPR(pool, masterChefContract);
  const apr = "0";
  const apy = "0";

  // get lp info
  const lpContract = options.getContract({ address: pool.lpToken, abi: Erc20ABI });

  const symbol = await lpContract.symbol();

  const token = symbol;
  const lpAddress = pool.lpToken;

  // calculate total Liquidity
  const totalLiquidity = utils.formatEther(
    await lpContract.balanceOf(defaultContracts.masterChef.address)
  );

  let userLiquidity = "0";

  // get user staked info
  let irisEarned = "0";
  let lpStaked = "0";
  let hasStaked = false;
  let hasApprovedPool = false;

  // fetch user data
  if (options.account) {
    irisEarned = utils.formatEther(await masterChefContract.pendingIris(pid, options.account));

    const userInfo = await masterChefContract.userInfo(pid, options.account);
    lpStaked = utils.formatEther(userInfo.amount);
    hasStaked = !(userInfo.amount as BigNumber).isZero();

    // get user permissions
    // check if user has given permission for masterChef to spend the lpTokens
    const allowance: BigNumber = await lpContract.allowance(
      options.account,
      masterChefContract.address
    );

    userLiquidity = utils.formatEther(await lpContract.balanceOf(options.account));

    hasApprovedPool = !allowance.isZero();
  }

  return {
    pid,
    active,
    staked: hasStaked,
    hasApprovedPool,
    token,
    lpAddress,
    multiplier,
    apy,
    apr,
    earn,
    depositFees,
    irisEarned,
    lpStaked,
    totalLiquidity,
    userLiquidity,
  };
}

type GetPoolsDataOptions = GetPoolDataOptions & {
  poolType: "farms" | "pools";
};
export async function getPoolsData(options: GetPoolsDataOptions) {
  return Promise.all(
    (options.poolType === "farms" ? farmIds : poolIds).map((pid) => getPool(pid, options))
  );
}

export async function getIrisToHarvest(
  account: string,
  getContract: (contractInfo: ContractInfo) => Contract
) {
  const masterChefContract = getContract(defaultContracts.masterChef);

  const totalIrisToHarvest = [...farmIds, ...poolIds].reduce(async (total, pid) => {
    const irisEarned = await masterChefContract.pendingIris(pid, account);
    return total.add(irisEarned);
  }, BigNumber.from(0));

  return totalIrisToHarvest;
}

export async function getIrisStat(getContract: (contractInfo: ContractInfo) => Contract) {
  const irisContract = getContract(defaultContracts.irisToken);

  const irisPrice = 1;

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

export async function harvestFromAllFarms(masterChef: Contract) {
  return Promise.all(
    [...farmIds, ...poolIds].map(async (pid) => {
      const tx = await masterChef.deposit(pid, utils.parseEther("0"), constants.AddressZero);
      await tx.wait();
    })
  );
}
