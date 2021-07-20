import Erc20ABI from "abis/ERC20.json";
import { ContractInfo, defaultContracts } from "hooks/wallet";
import { BigNumber, constants, Contract, utils } from "ethers";

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
  irisStaked: string; // requires user
  totalLiquidity: string;
  userLiquidity: number; // requires user
  lpAddress: string;
};

// HELPER
const BLOCKS_PER_YEAR = 15768000;
async function calculateAPR(pool: any, contract: Contract) {
  const amount = utils.parseEther("1");
  const depositFeesInPercent = BigNumber.from(pool.depositFeeBP / 100);
  const fees = amount.mul(depositFeesInPercent).div(100);

  // console.log({ fees: utils.formatEther(fees) });

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

  const numberOfDays = BigNumber.from(365);

  const apr = fees.add(interest).div(amount).div(numberOfDays).mul(365).mul(100);
  const apy = BigNumber.from(1).add(apr.div(numberOfDays)).pow(numberOfDays).sub(1);

  return [apr, apy];
}

// get individual farms
type GetPoolDataOptions = {
  getContract: (contractInfo: ContractInfo) => Contract;
  account?: string;
};
export async function getPool(pid: number, options: GetPoolDataOptions): Promise<PoolInfo> {
  const masterChefContract = options.getContract(defaultContracts.masterChef);
  const pool = await masterChefContract.poolInfo(pid);

  // get basic pool info
  const multiplier = pool.allocPoint.div(100).toString();
  const active = multiplier !== "0";
  const depositFees = BigNumber.from(pool.depositFeeBP).div(100).toNumber();
  const earn = "IRIS";

  // calculate apy and apr
  let calculatedApr = await calculateAPR(pool, masterChefContract);
  const apy = calculatedApr[0].toString();
  const apr = calculatedApr[0].toString();

  // get lp info
  const lpContract = options.getContract({ address: pool.lpToken, abi: Erc20ABI });
  const symbol = await lpContract.symbol();

  const token = symbol;
  const lpAddress = pool.lpToken;

  // calculate total Liquidity
  const totalLiquidity = utils.formatEther(
    await lpContract.balanceOf(defaultContracts.masterChef.address)
  );

  const userLiquidity = 0;

  // get user staked info
  let irisEarned = "0";
  let irisStaked = "0";
  let hasStaked = false;
  let hasApprovedPool = false;

  // fetch user data
  if (options.account) {
    const userInfo = await masterChefContract.userInfo(pid, options.account);

    irisStaked = utils.formatEther(userInfo.amount);
    hasStaked = !(userInfo.amount as BigNumber).isZero();

    // get user permissions
    // check if user has given permission for masterChef to spend the lpTokens
    const allowance: BigNumber = await lpContract.allowance(
      options.account,
      masterChefContract.address
    );

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
    irisStaked,
    totalLiquidity,
    userLiquidity,
  };
}

// get individual farms
type GetPoolsDataOptions = GetPoolDataOptions & {
  poolType: "farms" | "pools";
};
export async function getPoolsData(options: GetPoolsDataOptions) {
  const farmIds = [];
  const poolIds = [0];

  return Promise.all(
    (options.poolType === "farms" ? farmIds : poolIds).map((pid) => getPool(pid, options))
  );
}

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
