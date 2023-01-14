// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange is ERC20 {
    address public cryptoDevTokenAddress;

    constructor(address _cryptoDevToken) ERC20("Crypto LP Token","CDLP"){
        require(_cryptoDevToken!=address(0),"Token address passes is a null address");
        cryptoDevTokenAddress = _cryptoDevToken;
    }

    function getReserve() public view returns(uint256){
        return ERC20(cryptoDevTokenAddress).balanceOf(address(this));
    }

    function addLiquidity(uint _amount) public payable returns(uint256){
        uint256 liquidity;
        uint256 ethBalance = address(this).balance;
        uint256 cryptoDevTokenReserve = getReserve();
        ERC20 cryptoDevToken = ERC20(cryptoDevTokenAddress);

        if(cryptoDevTokenReserve==0){

            cryptoDevToken.transferFrom(msg.sender, address(this), _amount);

            liquidity = ethBalance;
            _mint(msg.sender, liquidity);
        }else{

            uint256 ethReserve = ethBalance - msg.value;

            uint256 cryptoTokenAmount = (msg.value * cryptoDevTokenReserve)/ethReserve;
            require(_amount>=cryptoTokenAmount,"Amount of tokens sent is less than the minimum tokens required");

            cryptoDevToken.transferFrom(msg.sender,address(this),cryptoTokenAmount);

            liquidity = (totalSupply() * msg.value)/ethReserve;
            _mint(msg.sender,liquidity);
        }
        return liquidity;
    }

    function removeLiquidity(uint _amount) public returns (uint,uint){
        require(_amount>0,"Amount should be greater than zero");
        uint _totalSupply = totalSupply();
        uint ethReserve = address(this).balance;


        uint256 ethAmount = (_amount * ethReserve) / _totalSupply;

        uint256 tokenAmount = (_amount * getReserve()) / _totalSupply;

        _burn(msg.sender,_amount);

        payable(msg.sender).transfer(ethAmount);

        ERC20(cryptoDevTokenAddress).transfer(msg.sender,tokenAmount);

        return (ethAmount,tokenAmount);

    }

    function getAmountOfTokens(uint inputAmount,uint inputReserve,uint outputReserve) public pure returns(uint){
        require(inputReserve> 0 && outputReserve>0,"Invalid Reserve");

        uint inputAmountWithFess = inputAmount * 99;

        uint256 numerator = inputAmountWithFess * outputReserve;
        uint256 denominator = (inputReserve * 100) + inputAmountWithFess;
        return numerator / denominator;
    }

    function ethToCryptoDevToken(uint _minTokens) public payable{
        uint256 tokenReserve = getReserve();

        uint256 tokensBought = getAmountOfTokens(msg.value, address(this).balance - msg.value, tokenReserve);

        require(tokensBought>=_minTokens,"Insufficient output amount");

        ERC20(cryptoDevTokenAddress).transfer(msg.sender, tokensBought);
    }

    function cryptoDevTokenToEth(uint _tokensSold,uint _minEth) public{
        uint tokenReserve = getReserve();
        uint ethReserve = address(this).balance;


        uint256 ethBought = getAmountOfTokens(_tokensSold, tokenReserve, ethReserve);
        require(ethBought >= _minEth,"Insufficient output amount");

        ERC20(cryptoDevTokenAddress).transferFrom(msg.sender,address(this),_tokensSold);
        payable(msg.sender).transfer(ethBought);
    }
}