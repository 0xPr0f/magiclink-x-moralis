import "./App.css";
import logo from "./logo.svg";
import w3authlogo from "./web3authlogo.png";
import { useMoralis } from "react-moralis";
import { Modal } from "antd";
import { Abi } from "./abi";
import { useEffect, useState } from "react";

function App() {
  const {
    account,
    isAuthenticated,
    authError,
    isAuthenticating,
    logout,
    user,
    authenticate,
    Moralis,
  } = useMoralis();
  const [email, setEmail] = useState("");
  const [balance, setbalance] = useState();
  const [amount, setamount] = useState();
  const [accountr, setaccountr] = useState();
  const [tokenaddress, settokenaddress] = useState();
  const [info, setinfo] = useState();
  const [open1, setOpen1] = useState();
  useEffect(() => {
    async function lol() {
      const options = {
        chain: "mumbai",
        address: user?.attributes.accounts,
      };
      const balance = await Moralis.Web3API.account.getNativeBalance(options);
      setbalance(
        Moralis.Units.FromWei(JSON.stringify(parseInt(balance.balance)))
      );
    }
    lol();
  }, [account]);

  const sendErc20 = async () => {
    if (tokenaddress?.length > 40 && accountr?.length > 40) {
      console.log(tokenaddress, accountr);
      // sending 0.5 tokens with 18 decimals
      const options = {
        type: "erc20",
        amount: Moralis.Units.Token(amount, "18"),
        receiver: accountr,
        contractAddress: tokenaddress,
      };
      await Moralis.transfer(options);
    }
  };

  const Mint = async () => {
    const options = {
      contractAddress: "0x0639666C3D9bcF4ad739210663443D0C8fDA369b",
      functionName: "mintNFT",
      abi: Abi,
      msgValue: "",
    };
    const transaction = await Moralis.executeFunction(options);
    const receipt = await transaction.wait();
    setinfo(receipt);
    console.log(receipt);
  };

  const handleCustomLogin = async () => {
    authenticate({
      provider: "magicLink",
      email: email,
      apiKey: "pk_live_8160960D4F2F7EE4",
      network: "mumbai",
    }).then(() => {
      async function ball() {
        const options = {
          chain: "mumbai",
          address: user?.attributes.accounts,
        };
        const balance = await Moralis.Web3API.account.getNativeBalance(options);
        setbalance(
          Moralis.Units.FromWei(JSON.stringify(parseInt(balance.balance)))
        );
      }
      ball();
    });
  };

  const handleOk = () => {
    sendErc20();
    setOpen1(false);
  };

  const handleCan = () => {
    setOpen1(false);
  };

  return (
    <div className="backgroundParent">
      {isAuthenticated ? (
        <h2>
          If the page is reloaded, pls signout and sign in again
          <br />
          Remember to topUp your wallet
          <br />
          <br />
          App on mumbai chain
        </h2>
      ) : null}

      <Modal visible={open1} onOk={handleOk} onCancel={handleCan}>
        <div>
          <div>
            <h2>Send ERC20 Tokens</h2>
          </div>
          <br />
          <span> Token Contract Address</span>
          <br />
          <input
            type="text"
            className="input"
            placeholder="Token Address"
            value={tokenaddress}
            onChange={(e) => {
              settokenaddress(e.target.value);
            }}
          />
          <br />
          <span> Reciever Address</span>
          <br />
          <input
            type="text"
            className="input"
            placeholder="Reciever Address"
            value={accountr}
            onChange={(e) => {
              setaccountr(e.target.value);
            }}
          />
          <br />
          <span> Amount</span>
          <br />
          <input
            type="text"
            className="input"
            placeholder="Amount"
            value={amount}
            onChange={(e) => {
              setamount(e.target.value);
            }}
          />
        </div>
      </Modal>
      <div style={{ display: "flex" }}>
        <div className="App">
          <h2>Test Magic x Moralis</h2>
          <div className="logos">
            <img src={logo} alt="moralis logo" />
            <img src={w3authlogo} alt="web3Auth logo" />
          </div>
          <span>Email</span>
          <input
            type={"email"}
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <div>
            {isAuthenticating && <p className="green"> Authenticating ....</p>}
            {authError && (
              <p className="error">{JSON.stringify(authError.message)}</p>
            )}
            {isAuthenticated && (
              <div className="accountDetails">
                <h5>Account</h5>
                <p>{user?.attributes.accounts}</p>
                <h5>Balance</h5>
                <p>{balance}</p>
                <h5>Trasactions</h5>
                {info != null ? (
                  <p>https://mumbai.polygonscan.com/tx/{info}</p>
                ) : null}
              </div>
            )}
          </div>
          <div className="buttonCard">
            <button
              className="loginButton"
              onClick={isAuthenticated ? logout : handleCustomLogin}
            >
              {isAuthenticated ? "Sign Out" : "Connect with Magic"}
            </button>
          </div>
        </div>
        {isAuthenticated ? (
          <div className="App" style={{ margin: "20px" }}>
            <h2>Claim NFT</h2>
            <div
              className="logo"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <img
                width={190}
                height={195}
                src="https://gateway.pinata.cloud/ipfs/Qmac8mUyNQ7JrJWAorZvSCjrsMzKB5MJuvPpJfnv85dhjd/99.png"
                alt="NFT"
              />
            </div>
            <div>
              {isAuthenticating && (
                <p className="green"> Authenticating ....</p>
              )}
              {authError && (
                <p className="error">{JSON.stringify(authError.message)}</p>
              )}
              <br />
              {isAuthenticated && (
                <div className="accountDetails">
                  <h5>NFT contract Address</h5>
                  <p>0x0639666C3D9bcF4ad739210663443D0C8fDA369b</p>
                </div>
              )}
            </div>
            <div className="buttonCard">
              <button
                className="loginButton"
                onClick={() => {
                  Mint();
                }}
              >
                {isAuthenticated ? "MINT" : "lol"}
              </button>
            </div>
            ------------------------------------------------------------
            <br />
            ------------------------------------------------------------
            <br />
            <button
              className="loginButton"
              onClick={() => {
                setOpen1(true);
              }}
            >
              Send ERC20 token
            </button>
          </div>
        ) : null}
      </div>

      <div>
        For some reason, styling was hard, bear with me
        <div>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/0xPr0f/web3auth"
          >
            {" "}
            Link to the github
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
