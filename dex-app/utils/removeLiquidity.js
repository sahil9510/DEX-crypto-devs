import { Contract, utils } from "ethers";
import { EXCHANGE_CONTRACT_ABI, EXCHANGE_CONTRACT_ADDRESS } from "../constants";

export const removeLiquidity = async (signer, removeLPTokensWei) => {
  try {
    const exchangeContract = new Contract(
      EXCHANGE_CONTRACT_ADDRESS,
      EXCHANGE_CONTRACT_ABI,
      signer
    );
    const txn = await exchangeContract.removeLiquidity(removeLPTokensWei);
    await txn;
  } catch (err) {
    console.error(err);
  }
};

export const getTokensAfterRemove = async (
  provider,
  removeLPTokenWei,
  _ethBalance,
  cryptoDevTokenReserver
) => {
  try {
    const exchangeContract = new Contract(
      EXCHANGE_CONTRACT_ADDRESS,
      EXCHANGE_CONTRACT_ABI,
      provider
    );

    const _totalSupply = await exchangeContract.totalSupply();
    const _removeEther = _ethBalance.mul(removeLPTokenWei).div(_totalSupply);
    const _removeCD = cryptoDevTokenReserver
      .mul(removeLPTokenWei)
      .div(_totalSupply);
    return { _removeEther, _removeCD };
  } catch (err) {
    console.error(err);
  }
};
