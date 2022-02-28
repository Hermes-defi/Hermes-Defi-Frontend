import { DelegatorInfo, delegatorStakingPools } from "config/delegators";
import { utils } from "ethers";
import { useDelegatorContract } from "hooks/contracts";
import { useCurrentBlockNumber } from "hooks/wallet";
import { useMutation, useQueries, useQueryClient } from "react-query";
import { useActiveWeb3React } from "wallet"
import { fetchPrice } from "web3-functions/prices";
import { useToast } from "@chakra-ui/react";
import ReactGA from "react-ga";

export const formatTimeLeft = (difference: number) => {
    type time_object = {
        hours: number,
        minutes: number,
        seconds: number
    };
    let timeLeft : time_object = {
        hours: 0,
        minutes: 0,
        seconds: 0
    }
    const sec_num = parseInt(difference.toString(), 10);
    if (difference > 0) {
        const hours = Math.floor(sec_num / 3600);
        const minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        const seconds = Math.floor(sec_num - (hours * 3600) - (minutes * 60));
      timeLeft = {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      };
    }else{
        timeLeft = {
            hours: 0,
            minutes: 0,
            seconds: 0
        }
    }
  
    return timeLeft;
  };

function useFetchDelegatorStakingPoolRequest(){
    const getDelegatorStakeContract = useDelegatorContract();
    const currentBlock = useCurrentBlockNumber();
    const { account, library } = useActiveWeb3React();

    return async (delegatorStakeInfo: DelegatorInfo) => {
        try{
            const delegatorContract = getDelegatorStakeContract(delegatorStakeInfo.address);
            
            //Token Price
            // delegatorStakeInfo.rewardToken.price = await fetchPrice(
            //     delegatorStakeInfo.rewardToken,
            //     library
            // );
            //TODO: Ask if there is APR
            delegatorStakeInfo.apr = {
                yearlyAPR: 9,
                weeklyAPR: 9/52,
                dailyAPR: 9/365
            };
            delegatorStakeInfo.canWithdraw = false;

            if(account) {
                //*Balanceof sONE
                const rewardBalanceWei = await delegatorContract.balanceOf(account);
                delegatorStakeInfo.rewardBalance = utils.formatUnits(rewardBalanceWei, 18);
                //*User ONE staked
                const stakedOneWei = await delegatorContract._staked(account);
                delegatorStakeInfo.stakedOne = utils.formatUnits(stakedOneWei, 18);
                delegatorStakeInfo.stakedIn = parseInt(await delegatorContract._stakedIn(account));
                

                if (delegatorStakeInfo.stakedIn > 0){
                    const withdrawTimestamp = new Number(await delegatorContract.withdrawTimestamp());
                    const now = parseInt((Date.now()/1000).toString());
                    const ttl = +delegatorStakeInfo.stakedIn + +withdrawTimestamp - now;
                    delegatorStakeInfo.unstakeInfo = ttl > 0 ? formatTimeLeft(ttl) : {hours: 1, minutes: 10, seconds: 30};
                    const canWithdraw = await delegatorContract.canWithdraw(account, utils.parseUnits(delegatorStakeInfo.stakedOne));
                    delegatorStakeInfo.canWithdraw = canWithdraw.allowedToWithdraw;
                    delegatorStakeInfo.reason = canWithdraw.Reason
                }
            }
            
            return delegatorStakeInfo;
        }
        catch (e){
            console.error(e);
            return delegatorStakeInfo;
        }
    }
}

export function useFetchDelegatorPools(){
    const fetchDelegatorPoolRq = useFetchDelegatorStakingPoolRequest();
    const currentBlock = useCurrentBlockNumber();
    const { account } = useActiveWeb3React();

    const delegatorQueries =  useQueries(
        delegatorStakingPools.map((delegator) => {
            return{
                enabled : !!currentBlock,
                queryKey: ["delegator", delegator.address, account],
                queryFn: () => fetchDelegatorPoolRq(delegator),
            };
        })
    );
    return delegatorQueries; 
}

export function useDepositIntoDelegator(){
    const { account } = useActiveWeb3React();
    const queryClient = useQueryClient();
    const delegatorContract = useDelegatorContract();
    const toast = useToast();

    const depositMutation = useMutation(
        async ({ address, amount }: { address: string; amount: string }) => {
            if(!account) throw new Error("No connected account");
            const pool = queryClient.getQueryData<DelegatorInfo>([
                "delegator",
                address,
                account,
            ]);
            const delegator = delegatorContract(pool.address);
            const overrides = {
                from: account,
                value: utils.parseUnits(amount),
            }
            console.log(overrides);
            console.log(amount)
            const tx = await delegator.deposit(overrides);
            await tx.wait();
        },
        {
            onSuccess: (_, { address, amount }) => {
                const pool = queryClient.getQueryData<DelegatorInfo>([
                    "delegator",
                    address,
                    account,
                ]);
                queryClient.invalidateQueries(["delegator", address, account]);

                ReactGA.event({
                    category: "Deposits",
                    action: "Depositing ONE",
                    value: parseInt(amount, 10),
                    label: "ONE"
                });
                toast({
                    title: "Token successfully deposited",
                    status: "success",
                    position: "top-right",
                    isClosable: true,
                });
            },
            onError: ({ data }) => {
                console.error(`[useDepositIntoDelegator][error] general error`, {
                    data,
                });

                toast({
                    title: "Error depositing token",
                    description: data?.message,
                    status: "error",
                    position: "top-right",
                    isClosable: true,
                })
            }
        }
    );

    return depositMutation;
}

export function useUnstakeFromDelegator(){
    const { account } = useActiveWeb3React();
    const queryClient = useQueryClient();
    const delegatorContract = useDelegatorContract();
    const toast = useToast();

    const unstakeMutation = useMutation(
        async ({ address, amount }: { address: string; amount: string }) => {
            if(!account) throw new Error("No connected account");
            const pool = queryClient.getQueryData<DelegatorInfo>([
                "delegator",
                address,
                account,
            ]);
            const delegator = delegatorContract(pool.address);
            const tx = await delegator.unstake(utils.parseUnits(amount, 18));
            await tx.wait();
        },
        {
            onSuccess: (_, { address, amount }) => {
                const pool = queryClient.getQueryData<DelegatorInfo>([
                    "delegator",
                    address,
                    account,
                ]);
                queryClient.invalidateQueries(["delegator", address, account]);

                ReactGA.event({
                    category: "Unstake",
                    action: "Unstaking ONE",
                    value: parseInt(amount, 10),
                    label: "ONE"
                });
                toast({
                    title: "Token successfully unstaked",
                    status: "success",
                    position: "top-right",
                    isClosable: true,
                });
            },
            onError: ({ data }) => {
                console.error(`[useUnstakeFromDelegator][error] general error`, {
                    data,
                });

                toast({
                    title: "Error unstaking token",
                    description: data?.message,
                    status: "error",
                    position: "top-right",
                    isClosable: true,
                })
            }
        }
    );

    return unstakeMutation;
}

export function useWithdrawFromDelegator(){
    const { account } = useActiveWeb3React();
    const queryClient = useQueryClient();
    const delegatorContract = useDelegatorContract();
    const toast = useToast();

    const withdrawMutation = useMutation(
        async ({ address, amount }: { address: string; amount: string }) => {
            if(!account) throw new Error("No connected account");
            const pool = queryClient.getQueryData<DelegatorInfo>([
                "delegator",
                address,
                account,
            ]);
            const delegator = delegatorContract(pool.address);
            const overrides = {
                from: account,            }
            const tx = await delegator.withdraw(utils.parseUnits(amount, 18), overrides);
            await tx.wait();
        },
        {
            onSuccess: (_, { address, amount }) => {
                const pool = queryClient.getQueryData<DelegatorInfo>([
                    "delegator",
                    address,
                    account,
                ]);
                queryClient.invalidateQueries(["delegator", address, account]);

                ReactGA.event({
                    category: "Withdrawals",
                    action: `Withdrawing ONE`,
                    value: parseInt(amount, 10),
                    label: "ONE"
                });
                toast({
                    title: "Token successfully withdrawed",
                    status: "success",
                    position: "top-right",
                    isClosable: true,
                });
            },
            onError: ({ data }) => {
                console.error(`[useWithdrawFromDelegator][error] general error`, {
                    data,
                });

                toast({
                    title: "Error withdrawing token",
                    description: data?.message,
                    status: "error",
                    position: "top-right",
                    isClosable: true,
                })
            }
        }
    );

    return withdrawMutation;
}
