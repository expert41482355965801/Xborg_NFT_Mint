import React from 'react'
import './App.css';
import Header from  './components/Header'
import Body from './components/Body'
import Footer from './components/Footer'
import ConnectWallet from "./components/ConnectWallet";

function App() {
  const [showModal, setShowModal] = React.useState(false);
  const [walletProvider, setWalletProvider] = React.useState();
  return (
    <>
      <div className='container'>
        <Header setShowModal={setShowModal} walletProvider={walletProvider}/>
        <Body walletProvider={walletProvider} />
		    <Footer />
        <ConnectWallet showModal={showModal} setShowModal={setShowModal} walletProvider={walletProvider} setWalletProvider={setWalletProvider} />
      </div>
    </>
  );
}

export default App;
