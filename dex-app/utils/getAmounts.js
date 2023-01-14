import { Contract } from "ethers";
import {
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
  EXCHANGE_CONTRACT_ABI,
  EXCHANGE_CONTRACT_ADDRESS,
} from "../constants";

export const getEtherBalance = async (provider, address, contract = false) => {
  try {
    if (contract) {
        const balance = await provider.getBalance(EXCHANGE_CONTRACT_ADDRESS);
        return balance;
    } else {
        const balance = await provider.getBalance(address);
        return balance;
    }
  } catch (err) {
    console.error(err);
    return 0;
  }
};

export const getCDTokensBalance = async(provider,address) =>{
    try{
    const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
    )
    const balanceOfCryptoDevTokens = await tokenContract.balanceOf(address);
    return balanceOfCryptoDevTokens;
    }catch(err){
        console.error(err);
        return 0;
    }
}

export const getLPTokensBalance = async(provider,address)=>{
    try {
        const tokenContract = new Contract(
            EXCHANGE_CONTRACT_ADDRESS,
            EXCHANGE_CONTRACT_ABI,
            provider
        )
        const balanceOfLPTokens = await tokenContract.balanceOf(address);
        return balanceOfLPTokens;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

export const getReserveOfCDTokens = async(provider) =>{
    try {
        const exchangeContract = new Contract(
            EXCHANGE_CONTRACT_ADDRESS,
            EXCHANGE_CONTRACT_ABI,
            provider
        )   
        const reverseOfCDTokens = await exchangeContract.getReserve();
        return reverseOfCDTokens;
    } catch (error) {
        console.error(error);
        return 0;
    }
}