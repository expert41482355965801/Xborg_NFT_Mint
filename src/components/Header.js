import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify';
import ETHimg from '../assets/Eth.png'
import Maticimg from '../assets/matic-token.png'
import Logo from '../assets/Visp_X_white.png'
import BNBimg from '../assets/bnb.png'
import 'react-toastify/dist/ReactToastify.css';
import { ethers } from "ethers";

export default function Header ({ setShowModal, walletProvider }) {

    const [balance, setBalance] = useState(0);
    const [walletAddress, setWalletAddress] = useState('');
    const [networkName, setNetworkName] = useState('');
    
    const openModal = () => {
        setShowModal((prev) => !prev);
    };
    
    useEffect(() => {
		const fetchWalletProvider = async() => {
            if(walletProvider === ''){
                return;
            }
            const provider = new ethers.providers.Web3Provider(walletProvider);
            const { name } = await provider.getNetwork();
            const signer = provider.getSigner();
            const temp_balance = await signer.getBalance();
            setBalance(ethers.utils.formatUnits(parseInt(temp_balance._hex, 16).toString(), 18).substr(0, 4));
            const temp_address = await signer.getAddress();
            setWalletAddress(temp_address.substr(0, 6) + '...' + temp_address.substr(-4));
            if(name === 'homestead'){
                setNetworkName("Ethereum");
            }else if(name === 'bnb'){
                setNetworkName("BSC");
            }
            else{
                setNetworkName(name[0].toUpperCase() + name.slice(1));
            }
            
        }
        fetchWalletProvider();
	}, [walletProvider]);
    
    return(
        <>
            <div className='header'>
                <div className='logo-text'><img src={Logo} style={{width: "160px"}} alt="logo"/></div>
                <div className='social-icon-bar'>
                    {
                        walletProvider
                        ?
                        <div className="connected-btn-bar">
							<button className="chain-btn">
                                <span>
                                    {
                                        networkName === "Matic" 
                                        ?
                                        <img src={Maticimg} alt="Matic"/>    
                                        :
                                        networkName === "BSC"
                                        ?
                                        <img src={BNBimg} alt="BSC"/>
                                        :
                                        <img src={ETHimg} alt="ETH"/>
                                    }
                                </span>
							    { networkName }
							</button>
							<button className="address-balance-btn">
								<div className="balance-btn"><span>{balance}</span>ETH</div>
								<div className="address-btn">
								<span>{ walletAddress }</span>
								<div className="svg-container"><span><svg x="0" y="0" width="16" height="16"><rect x="0" y="0" width="16" height="16" transform="translate(2.0491048241272547 0.4749295734539967) rotate(157.3 8 8)" fill="#018E87"></rect><rect x="0" y="0" width="16" height="16" transform="translate(8.037407065720956 -5.686485219805557) rotate(396.0 8 8)" fill="#18ADF2"></rect><rect x="0" y="0" width="16" height="16" transform="translate(11.038041070959226 -7.7653142867927505) rotate(495.9 8 8)" fill="#03585E"></rect></svg></span></div>
								</div>
							</button>
						</div>
                        :
                        <div className='connectwallet-btn' onClick={openModal}>Connect Wallet</div>
                    }
                </div>
            </div>
            <ToastContainer 
                theme="colored"
            />
        </>
    );
}