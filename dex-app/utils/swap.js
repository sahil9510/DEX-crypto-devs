import { Contract } from "ethers";
import {
  EXCHANGE_CONTRACT_ABI,
  EXCHANGE_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
} from "../constants";

export const getAmountOfTokensReceivedFromSwap = async (
  _swapAmountWei,
  provider,
  ethSelected,
  ethBalance,
  reservedCD
) => {
  const exchangeContract = new Contract(
    EXCHANGE_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
    provider
  );
  let amountOfTokens;

  if (ethSelected) {
    amountOfTokens = await exchangeContract.getAmountOfTokens(
      _swapAmountWei,
      ethBalance,
      reservedCD
    );
  } else {
    amountOfTokens = await exchangeContract.getAmountOfTokens(
      _swapAmountWei,
      reservedCD,
      ethBalance
    );
  }
  return amountOfTokens;
};

export const swapTokens = async (
  signer,
  swapAmoungWei,
  tokenToBeRecievedAfterSwap,
  ethSelected
) => {
  const exchangeContract = new Contract(
    EXCHANGE_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
    signer
  );

  const tokenContract = new Contract(
    TOKEN_CONTRACT_ADDRESS,
    TOKEN_CONTRACT_ABI,
    signer
  );

  if (ethSelected) {
    const txn = await exchangeContract.ethToCryptoDevToken(
      tokenToBeRecievedAfterSwap,
      {
        value: swapAmoungWei,
      }
    );
    await txn.wait();
  } else {
    let txn = await tokenContract.approve(
      EXCHANGE_CONTRACT_ADDRESS,
      swapAmoungWei.toString()
    );
    await txn.wait();

    txn = await exchangeContract.cryptoDevTokenToEth(
      swapAmoungWei,
      tokenToBeRecievedAfterSwap
    );
    await txn.wait();
  }
};
