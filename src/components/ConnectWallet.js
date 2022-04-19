import React, { useRef, useEffect, useCallback } from "react";
import metamask from "../assets/metamask.png";
import walletconnect from "../assets/walletconnect.png";
import "./connectwallet.css";
import { toast } from 'react-toastify';
import { ethers } from "ethers";

const ConnectWallet = ({ showModal, setShowModal, walletProvider, setWalletProvider }) => {
	const modalRef = useRef();

	const closeModal = (e) => {
		if (modalRef.current === e.target) {
			setShowModal(false);
		}
	};

	const keyPress = useCallback(
		(e) => {
			if (e.key === "Escape" && showModal) {
				setShowModal(false);
				console.log("I pressed");
			}
		},
		[setShowModal, showModal]
	);
	const connectMetaMaskHandler = async () => {
		
		// window.ethereum.request({
		// 	method: "wallet_addEthereumChain",
		// 	params: [{
		// 		chainId: "0x89",
		// 		rpcUrls: ["https://rpc-mainnet.matic.network/"],
		// 		chainName: "Matic Mainnet",
		// 		nativeCurrency: {
		// 			name: "MATIC",
		// 			symbol: "MATIC",
		// 			decimals: 18
		// 		},
		// 		blockExplorerUrls: ["https://polygonscan.com/"]
		// 	}]
		// });
		console.log("connectMetaMaskHandler enter");

		window.ethereum.request({
			method: "wallet_addEthereumChain",
			params: [{
				chainId: "0x4",
				rpcUrls: ["https://rinkeby.infura.io/v3/"],
				chainName: "Rinkeby Test Network",
				nativeCurrency: {
					name: "ETH",
					symbol: "ETH",
					decimals: 18
				},
				blockExplorerUrls: ["https://rinkeby.etherscan.io"]
			}]
		});
		
		// window.ethereum.request({
		// 	method: "wallet_addEthereumChain",
		// 	params: [{
		// 		chainId: "0x4",
		// 		rpcUrls: ["https://rinkeby.infura.io/v3/"],
		// 		chainName: "Rinkeby Test Network",
		// 		nativeCurrency: {
		// 			name: "ETH",
		// 			symbol: "ETH",
		// 			decimals: 18
		// 		},
		// 		blockExplorerUrls: ["https://rinkeby.etherscan.io"]
		// 	}]
		// });
		console.log("connectMetaMaskHandler passed");
		
		
		var metamaskProvider = window.ethereum;
		await metamaskProvider.request({ method: 'eth_requestAccounts' });
		setWalletProvider(metamaskProvider);
		const provider = new ethers.providers.Web3Provider(metamaskProvider);
		const { chainId } = await provider.getNetwork();
		setShowModal(false);
		if(chainId !== parseInt(process.env.REACT_APP_NETWORK_ID)) {
			toast.error('Wrong Network!', {
				position: "top-right",
				autoClose: 2000,
				closeOnClick: true,
				hideProgressBar: true,
			  });
			  return;
		}
	}
	
	window.addEventListener("load", function() {
		if (window.ethereum) {
			window.ethereum.enable(); // get permission to access accounts
			// detect Metamask account change
			window.ethereum.on('accountsChanged', function (accounts) {
				const changeAccountProvider = new ethers.providers.Web3Provider(window.ethereum);
				setWalletProvider('');
				setWalletProvider(changeAccountProvider.provider);
			});
			 // detect Network account change
			window.ethereum.on('networkChanged', function(networkId){
				const changeNetworkProvider = new ethers.providers.Web3Provider(window.ethereum);
				setWalletProvider('');
				setWalletProvider(changeNetworkProvider.provider);	
			});
		  } 
	});
	
	useEffect(() => {
		const checkWalletConnected = async () => {
			const intialWalletProvider = new ethers.providers.Web3Provider(window.ethereum);
			setWalletProvider(intialWalletProvider.provider);
		}
		checkWalletConnected();
	});

	useEffect(() => {
		document.addEventListener("keydown", keyPress);
		return () => document.removeEventListener("keydown", keyPress);
	}, [keyPress]);
	return (
		<>
			{showModal ? (
				<div className="wallet-container" onClick={closeModal} ref={modalRef}>
					<div className="wallet-wrap">
						<div className="wallets border-btm" onClick={connectMetaMaskHandler}>
							<img src={metamask} alt="Meta mask Logo" />
							<h1>Metamask / Injected</h1>
							<p>Connect with the provider in your Browser or Dapp</p>
						</div>
						<div className="wallets bg-gray">
							<img src={walletconnect} alt="Meta mask Logo" />
							<h1>WalletConnect</h1>
							<p>Scan with WalletConnect to connect</p>
						</div>
						<div
							className="close"
							onClick={() => {
								setShowModal(!showModal);
							}}
						>
							<div className="line1"></div>
							<div className="line2"></div>
						</div>
					</div>
				</div>
			) : null}
		</>
	);
};

export default ConnectWallet;
