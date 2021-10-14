import defaultContracts from "config/contracts";
import { BigNumber, constants, Contract, utils } from "ethers";

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
  const tx = await redeemContract.swapFenixForIris(utils.parseEther(amount));
  await tx.wait();
}
