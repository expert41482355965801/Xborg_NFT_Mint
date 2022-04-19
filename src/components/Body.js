import React, { useEffect, useState } from "react";
import NFT1 from "../assets/Pics/1.png";
import NFT2 from "../assets/Pics/2.png";
import NFT3 from "../assets/Pics/3.png";
import NFT4 from "../assets/Pics/4.png";
import NFT5 from "../assets/Pics/5.png";
import NFT6 from "../assets/Pics/6.png";
import NFT7 from "../assets/Pics/7.png";
import NFT8 from "../assets/Pics/8.png";
import NFT9 from "../assets/Pics/9.png";
import { ethers } from "ethers";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper";
import Contract from "./Contract.json";
import { toast } from 'react-toastify';
import Countdown from 'react-countdown';
import axios from "axios";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "./myswiper.css";

// import required modules


export default function Body({ walletProvider }) {

  const [mint_number, setMint_number] = useState(1);
  const [disableStatus, setDisableStatus] = useState(false);
  const [saleStatus, setSaleStatus] = useState('');
  const [perWalletMaxMintCount, setPerWalletMaxMintCount] = useState(8);
  const [WLStatus, setWLStatus] = useState(0);
  const reduce_Number = () => {
    if(mint_number === 0){
      return;
    }
    setMint_number(parseInt(mint_number) - 1);
  }

  const increase_Number = () => {
    if(mint_number === perWalletMaxMintCount){
      return;
    }
    setMint_number(parseInt(mint_number) + 1);
  }
  const renderer = ({ days, hours, minutes,seconds, completed }) => {
    if (completed) {
      return '';
    } else {
      // Render a countdown
      
      return <div className="counterdown">
        <div className="countdown-days countdown-round">
            <div className="days">
              {days}
            </div>
            <div className="counterdown-text">
              days
            </div>
        </div>
        <div className="timer-space">:</div>
        <div className="countdown-days countdown-round">
            <div className="days">
              {hours}
            </div>
            <div className="counterdown-text">
              hours
            </div>
        </div>
        <div className="timer-space">:</div>
        <div className="countdown-days countdown-round">
            <div className="days">
              {minutes}
            </div>
            <div className="counterdown-text">
              minutes
            </div>
        </div>
        <div className="timer-space">:</div>
        <div className="countdown-days countdown-round">
            <div className="days">
              {seconds}
            </div>
            <div className="counterdown-text">
              seconds
            </div>
        </div>
      </div>;
    }
  };

  useEffect(()=> {
    async function fetchInitalContractStaus(){
      // const defaultProvider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/");
      const defaultProvider = ethers.getDefaultProvider('rinkeby');
      const MinterContract = new ethers.Contract(Contract.address, Contract.abi, defaultProvider);
      const saleIsActive = await MinterContract.saleIsActive();
      const PublicsaleIsActive = await MinterContract.PublicsaleIsActive();
      if(!saleIsActive){
        setSaleStatus('Sale not Live yet');
        setDisableStatus(true);
      }
      else if(PublicsaleIsActive){
        setSaleStatus('Public Sale Live');
      }
      else{
        setSaleStatus('WL Sale Live');
      }
      const maxMintCount = await MinterContract.MaxMint();
      setPerWalletMaxMintCount(parseInt(maxMintCount._hex, 16)); 
    }
    fetchInitalContractStaus();
  },[]);

  useEffect(()=> {
    async function checkingDisableStatus(){
      if (!walletProvider){
        setDisableStatus(true);
        return;
      }
      if(walletProvider === ''){
          return;
      }
      const provider = new ethers.providers.Web3Provider(walletProvider);
      
      const { chainId } = await provider.getNetwork();
      console.log("chainId  //---------: " + chainId);
      console.log("process.env.REACT_APP_NETWORK_ID  //---------: " + process.env.REACT_APP_NETWORK_ID);
      if(chainId !== parseInt(process.env.REACT_APP_NETWORK_ID)) {
        setDisableStatus(true);
        return;
      }
      const signer = provider.getSigner();
      console.log("signer  //---------: " + signer);
      const walletAddress = await signer.getAddress();
      console.log("walletAddress: " + walletAddress);
      // axios.post("http://34.239.0.188:1337/getWhitelist", { "address" : walletAddress })
      //     .then((res) => {
      //         console.log("llll------" + res.data);
      //         if(res.data.status === '1'){
                setWLStatus(1);
      //         }
      //         else{
      //           setWLStatus(0);
      //         }
      //     })
      //     .catch((err) => {
      //         console.log("kkkkkk------" + err);
      //     });
      setDisableStatus(false);
      console.log("ttttt------");
    }
    checkingDisableStatus();
  },[walletProvider]);

  const mintNFT = async() => {
    if (!walletProvider){
      toast.error('Please connect the wallet', {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        hideProgressBar: true,
      });
      return;
    }
    
    const provider = new ethers.providers.Web3Provider(walletProvider);
		const signer = provider.getSigner();
    const { chainId } = await provider.getNetwork();
    if(chainId !== parseInt(process.env.REACT_APP_NETWORK_ID)) {
			toast.error('You connected wrong chain', {
				position: "top-right",
				autoClose: 2000,
				closeOnClick: true,
				hideProgressBar: true,
			  });
			  return;
		}
    // const balance = await signer.getBalance();
    const amount = 1 * mint_number;
    const options = {value: ethers.utils.parseEther(amount.toString())};
    const walletAddress = await signer.getAddress();
    const MinterContract = new ethers.Contract(Contract.address, Contract.abi, signer);
    const PublicsaleIsActive = await MinterContract.PublicsaleIsActive();
    const USDC_Address = await MinterContract.USDC();
    if (PublicsaleIsActive && WLStatus < 1){
      toast.error('You are not in the whitelist', {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        hideProgressBar: true,
      });
      return;
    }
    const USDC_Contract = new ethers.Contract(
      USDC_Address,
      [
        "function balanceOf(address _owner) public view returns (uint256 balance)",
        "function transfer(address _to, uint256 _value) public returns (bool success)",
        "function approve(address _spender, uint256 _value) public returns (bool)",
      ],
      signer
    );
    const USDC_balance = await USDC_Contract.balanceOf(walletAddress);
    if (parseInt(USDC_balance._hex, 16) - parseInt(options.value._hex, 16) < 0){
      toast.error('User balance lower than total price', {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        hideProgressBar: true,
      });
      return;
    }
    const totalSupply = await MinterContract.TotalSupply();
    const maxSupply = await MinterContract.MaxSupply();
    if (parseInt(maxSupply._hex, 16) - parseInt(totalSupply._hex, 16) - mint_number < 0){
      toast.error('Total NFT are over than maximum supply', {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        hideProgressBar: true,
      });
      return;
    }
    const UserMints = await MinterContract.UserMints(walletAddress);
    const MaxMint = await MinterContract.MaxMint();
    if (parseInt(MaxMint._hex, 16) - parseInt(UserMints._hex, 16) - mint_number < 0){
      toast.error('Total number of NFT mint over than limit per Wallet', {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        hideProgressBar: true,
      });
      return;
    }
    await USDC_Contract.approve(Contract.address, ethers.utils.parseEther(amount.toString()));
    // await tx.wait();
    // console.log(tx);
    await MinterContract.mint(mint_number, WLStatus);
    toast.success('Successfully Minted', {
      position: "top-right",
      autoClose: 2000,
      closeOnClick: true,
      hideProgressBar: true,
    });
  }

  return (
    <>
      <div className="body-outline">
        <div className="body-L">
          <div className="xborg-title">XBorg</div>
          <h1>
          Welcome to the VispX NFT collection powered by the brand mascot, XBORG. Holding the Xborg NFTs, unlock a Powerhouse of Benefits never seen before in the Launchpad Arena.
          </h1>
          {/* <h2>SAMPLE WRITING</h2> */}
          
          <Countdown 
            date={Date.now() + 900180000}
            renderer={renderer}
          />
          <h2>{ saleStatus }</h2>
          <div className="count">
            <div className="count-L">
              <div className="count-L-L">{ mint_number }</div>
              <div className="count-L-R" onClick = { reduce_Number }>&#9866;</div>
            </div>
            <div className="count-R" onClick = { increase_Number }>+</div>
          </div>
          {
            disableStatus 
            ?
            <button className="mint-btn-disable" onClick={mintNFT} disabled>MINT</button>
            :
            <button className="mint-btn" onClick={mintNFT}>MINT</button>
          }
          
        </div>
        <div
          className="body-R">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            loop={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 200,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={true}
            autoplay={{ delay: 1400, disableOnInteraction: false }}
			
            modules={[EffectCoverflow, Pagination, Autoplay]}
            className="mySwiper"
          >
            <SwiperSlide>
              <img src={NFT1} alt="NFT1" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={NFT2} alt="NFT2" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={NFT3} alt="NFT3" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={NFT4} alt="NFT4" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={NFT5} alt="NFT5" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={NFT6} alt="NFT6" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={NFT7} alt="NFT7" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={NFT8} alt="NFT8" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={NFT9} alt="NFT9" />
            </SwiperSlide>
          </Swiper>
        </div>
        
      </div>
      
    </>
  );
}
