import "./App.css";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "./utils/constants";

function App() {
  const { ethereum } = window;
  const [currentAccount, setCurrentAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });

  const getEthereumProvider = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();
    const transactionContract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    // console.log(provider);
    console.log(transactionContract);
    // console.log(signer);
    return transactionContract;
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) {
        alert("Please install metamask");
      }
      // eslint-disable-next-line
      const accounts = ethereum
        .request({
          method: "eth_accounts",
        })
        .then((res) => res.length > 0 && setCurrentAccount(res[0]));
    } catch (error) {}
  };

  const connectWallet = async () => {
    const accounts = await ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((res) => setCurrentAccount(res[0]));
    return accounts;
  };

  const handleSubmit = (e, name) => {
    setFormData((prev) => ({ ...prev, [name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      checkIfWalletIsConnected();
      if (
        formData.addressTo &&
        formData.amount &&
        formData.keyword &&
        formData.message
      ) {
        const transactionContract = await getEthereumProvider();
        const parsedAmount = ethers.utils.parseEther(formData.amount);
        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: formData.addressTo,
              gas: "0x5208",
              value: parsedAmount._hex,
            },
          ],
        });

        const transactionHash = await transactionContract.addToBlockChain(
          formData.addressTo,
          parsedAmount,
          formData.message,
          formData.keyword
        );

        setLoading(true);
        console.log("loading - " + transactionHash.hash);
        await transactionHash.wait();
        setLoading(false);
        console.log("Success - " + transactionHash.hash);
        setFormData({ addressTo: "", amount: "", keyword: "", message: "" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    // eslint-disable-next-line
  }, []);

  const companyCommonStyles =
    "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome"></div>
      <div className="flex w-full justify-center items-center">
        <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
          <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
            <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
              Send Crypto <br /> across the world
            </h1>
            <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
              Explore the crypto world. Buy and sell cryptocurrencies easily on
              Krypto.
            </p>
            {!currentAccount && (
              <button
                type="button"
                onClick={connectWallet}
                className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
              >
                <AiFillPlayCircle className="text-white mr-2" />
                <p className="text-white text-base font-semibold">
                  Connect Wallet
                </p>
              </button>
            )}

            <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
              <div className={`rounded-tl-2xl ${companyCommonStyles}`}>
                Reliability
              </div>
              <div className={companyCommonStyles}>Security</div>
              <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>
                Ethereum
              </div>
              <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>
                Web 3.0
              </div>
              <div className={companyCommonStyles}>Low Fees</div>
              <div className={`rounded-br-2xl ${companyCommonStyles}`}>
                Blockchain
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
            <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
              <div className="flex justify-between flex-col w-full h-full">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                    <SiEthereum fontSize={21} color="#fff" />
                  </div>
                  <BsInfoCircle fontSize={17} color="#fff" />
                </div>
                <div>
                  <p className="text-white font-light text-sm">
                    {shortenAddress(currentAccount)}
                  </p>
                  <p className="text-white font-semibold text-lg mt-1">
                    Ethereum
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={onSubmit}
              className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism"
            >
              {inputs.map(({ name }) => {
                return (
                  <div>
                    <input
                      type="text"
                      required
                      value={formData[name]}
                      name={name}
                      placeholder={name}
                      onChange={(e) => handleSubmit(e, name)}
                      className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
                    />
                  </div>
                );
              })}

              <div className="h-[1px] w-full bg-gray-400 my-2" />

              {loading ? (
                <Loader />
              ) : (
                <button
                  type="submit"
                  className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                >
                  Send now
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputs = [
  { name: "addressTo" },
  { name: "amount" },
  { name: "keyword" },
  { name: "message" },
];

const Loader = () => (
  <div className="flex justify-center items-center py-3">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-700" />
  </div>
);
export const shortenAddress = (address) =>
  `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;
export default App;
