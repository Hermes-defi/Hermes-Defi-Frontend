import { DelegatorInfo, delegatorStakingPools } from "config/delegators";
import { utils } from "ethers";
import { useDelegatorContract } from "hooks/contracts";
import { useCurrentBlockNumber } from "hooks/wallet";
import { useMutation, useQueries, useQueryClient } from "react-query";
import { useActiveWeb3React } from "wallet"
import { fetchPrice } from "web3-functions/prices";
import BigNumberJS from "bignumber.js";
import { useToast } from "@chakra-ui/react";
import ReactGA from "react-ga";

const formatTimeLeft = (difference: number) => {
    let timeLeft = {}
  
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
      };
    }else{
        timeLeft = {
            days: 0,
            hours: 0,
            minutes: 0
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
            delegatorStakeInfo.rewardToken.price = await fetchPrice(
                delegatorStakeInfo.rewardToken,
                library
            );
            //TODO: Ask if there is APR
            delegatorStakeInfo.apr = {
                yearlyAPR = 0,
                weeklyAPR = 0,
                dailyAPR = 0
            };

            if(account) {
                //*Balanceof sONE
                const rewardBalanceWei = await delegatorContract.balanceOf(account);
                delegatorStakeInfo.userInfo.rewardBalance = utils.formatUnits(rewardBalanceWei, 18);
                //*User ONE staked
                const stakedOneWei = await delegatorContract._staked(account);
                delegatorStakeInfo.userInfo.stakedOne = utils.formatUnits(stakedOneWei, 18);
                delegatorStakeInfo.userInfo.stakedIn = parseInt(await delegatorContract._stakedIn(account));
                delegatorStakeInfo.userInfo.canWithdraw = false;

                if (delegatorStakeInfo.userInfo.stakedIn > 0){
                    const withdrawTimestamp = new Number(await delegatorContract.withdrawTimestamp());
                    const now = Date.now();
                    const ttl = +delegatorStakeInfo.userInfo.stakedIn + +withdrawTimestamp - now;
                    delegatorStakeInfo.userInfo.unstakeInfo = ttl > 0 ? formatTimeLeft(ttl) : {days: 0, minutes: 0, hours: 0};
                    const canWithdraw = await delegatorContract.canWithdraw(account, delegatorStakeInfo.userInfo.stakedOne);
                    delegatorStakeInfo.userInfo.canWithdraw = canWithdraw.allowedToWithdraw;
                    delegatorStakeInfo.userInfo.reason = canWithdraw.Reason
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
            const tx = await delegator.deposit(account, utils.parseUnits(amount, 18));
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
            const tx = await delegator.deposit(account, utils.parseUnits(amount, 18));
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

