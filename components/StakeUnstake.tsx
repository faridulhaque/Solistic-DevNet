"use client";
import { useCallback, useState } from "react";
import { FaWallet, FaChevronDown } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import { connection, deposit, unstake, delayedUnstake } from "../solana";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

type TStakeUnStake = {
  successSignature: string;
  setSuccessSignature: (value: string) => void;
};

export default function StakeUnstakeComponent({
  successSignature,
  setSuccessSignature,
}: TStakeUnStake) {
  const { sendTransaction, publicKey, connected, wallet } = useWallet();
  const [stake, setStake] = useState(true); // toggle between Stake and Unstake
  const [priorityFee, setPriorityFee] = useState(false); // toggle Priority fee
  const [tipsActive, setTipsActive] = useState("off"); // toggle Tips
  const [showTooltip, setShowTooltip] = useState(false);
  const [selected, setSelected] = useState("0.3%");
  const options = ["0.1%", "0.2%", "0.3%"];
  const [stakeAmount, setStakeAmount] = useState("");
  const [selectedOption, setSelectedOption] = useState("immediate");

  const handleUnstake = () => {
    if (selectedOption === "immediate") {
      console.log("Triggering immediate unstake via Jupiter...");
      handleUnstakeSOL();
    } else if (selectedOption === "delayed") {
      console.log("Triggering delayed unstake...");
      handleDelayedUnstakeSOL();
    }
  };

  const handleConvertToSSOL = async () => {
    if (
      !stakeAmount ||
      isNaN(Number(stakeAmount)) ||
      Number(stakeAmount) <= 0
    ) {
      alert("Please enter a valid stake amount.");
      return;
    }

    try {
      if (!publicKey) {
        alert("Please connect your wallet before proceeding.");
        return;
      }

      // Convert stakeAmount to lamports (smallest unit of SOL)
      const lamports = (Number(stakeAmount) * 1e9).toString(); // Convert SOL to lamports

      // Convert walletAddress to a PublicKey
      const userPublicKey = new PublicKey(publicKey);

      // Call the deposit function
      const transactionSig = await deposit(
        lamports,
        userPublicKey,
        connection,
        wallet,
        sendTransaction,
        connected,
        priorityFee
      );
      if (transactionSig) {
        setSuccessSignature(transactionSig);

      }
    } catch (error) {
      console.error("Error during deposit:", error);
      alert("Transaction failed. Check console for details.");
    }
  };

  const handleUnstakeSOL = async () => {
    if (
      !stakeAmount ||
      isNaN(Number(stakeAmount)) ||
      Number(stakeAmount) <= 0
    ) {
      alert("Please enter a valid stake amount.");
      return;
    }

    try {
      if (!publicKey) {
        alert("Please connect your wallet before proceeding.");
        return;
      }

      // Convert stakeAmount to lamports (smallest unit of SOL)
      const lamports = (Number(stakeAmount) * 1e9).toString(); // Convert SOL to lamports

      // Convert walletAddress to a PublicKey
      const userPublicKey = new PublicKey(publicKey);

      // Call the deposit function
      const transactionSig = await unstake(
        lamports,
        userPublicKey,
        connection,
        wallet,
        sendTransaction,
        connected,
        priorityFee
      );
      if (transactionSig) {
        setSuccessSignature(transactionSig);

      }
    } catch (error) {
      console.error("Error during deposit:", error);
      alert("Transaction failed. Check console for details.");
    }
  };
  const handleDelayedUnstakeSOL = async () => {
    if (
      !stakeAmount ||
      isNaN(Number(stakeAmount)) ||
      Number(stakeAmount) <= 0
    ) {
      alert("Please enter a valid stake amount.");
      return;
    }

    try {
      if (!publicKey) {
        alert("Please connect your wallet before proceeding.");
        return;
      }

      // Convert stakeAmount to lamports (smallest unit of SOL)
      const lamports = (Number(stakeAmount) * 1e9).toString(); // Convert SOL to lamports

      // Convert walletAddress to a PublicKey
      const userPublicKey = new PublicKey(publicKey);

      // Delayed unstake logic (you may need a different method or flag for this)
      const transactionSig = await delayedUnstake(
        lamports,
        userPublicKey,
        connection,
        wallet,
        sendTransaction,
        connected,
        priorityFee
      );
      if (transactionSig) {
        setSuccessSignature(transactionSig);

      }
    } catch (error) {
      console.error("Error during delayed unstake:", error);
      alert("Delayed unstake failed. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#ede9f7] dark:bg-black py-8 px-4">
      <div className="w-full max-w-6xl bg-white dark:bg-[#181818] shadow-lg rounded-xl p-6 space-y-6 border border-purple-200 dark:border-[#3A3A3A]">
        <h2 className="text-2xl font-bold text-start text-gray-900 dark:text-[#F8EBD0]">
          Get <span className="text-[#6F5DA8]">{stake ? "sSOL" : "SLS"}</span>{" "}
          token
        </h2>

        {/* Toggle between Stake and Unstake */}
        <div className="flex items-center justify-center space-x-4 bg-[#CCBDFC] dark:bg-black p-2 rounded-lg w-full">
          <div className="relative w-1/2 flex">
            <button
              onClick={() => {
                setStake(true);
                setPriorityFee(stake ? priorityFee : false);
              }}
              className={`w-full py-2 text-md font-medium rounded-lg transition-all ${
                stake
                  ? "bg-white text-black dark:bg-[#3A3A3A] dark:text-[#F8EBD0]"
                  : "bg-[#CCBDFC] dark:bg-black text-black dark:text-[#F8EBD0]"
              }`}
            >
              <span className="relative">Stake</span>
              <span className=" bg-[#6F5DA8] text-white text-[8px] py-1 px-2 rounded-md ml-2 font-poppins">
                ≈ 8.04% APY
              </span>
            </button>
          </div>

          <div className="w-1/2">
            <button
              onClick={() => {
                setStake(false);
                setPriorityFee(!stake ? priorityFee : false);
              }}
              className={`w-full py-2 text-md font-medium rounded-lg transition-all ${
                !stake
                  ? "bg-white text-black dark:bg-[#3A3A3A] dark:text-[#F8EBD0]"
                  : "bg-[#CCBDFC] dark:bg-black text-black dark:text-[#F8EBD0]"
              }`}
            >
              <span className="relative left-4 md:left-2">Unstake</span>
            </button>
          </div>
        </div>

        {/* Stake or Unstake Content */}
        {stake ? (
          // Stake Section
          <>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-[#F8EBD0]">
              <span>You're staking</span>
              <div className="flex items-center space-x-1">
                <FaWallet className="text-[#6F5DA8] dark:text-[#6F5DA8]" />
                <span className="text-xs text-gray-500 dark:text-[#F8EBD0] font-poppins">
                  3,213.76
                </span>
              </div>
            </div>
            <div className="flex items-center bg-[#F0EEFF] dark:bg-black rounded-lg p-4 border-[#CCBDFC] border-2">
              <div className="flex items-center space-x-2 bg-white dark:bg-[#3A3A3A] p-2 rounded-lg">
                <img src="/sol-icon.png" alt="SOL" className="h-8 w-8" />
                <span className="text-gray-800 dark:text-[#F8EBD0]">SOL</span>
                <FaChevronDown className="text-[#6F5DA8] dark:text-[#6F5DA8]" />
              </div>
              <div className="ml-auto flex flex-col items-end">
                <input
                  type="text"
                  placeholder="12.5"
                  className="ml-auto text-2xl font-bold text-gray-900 dark:text-[#F8EBD0] bg-transparent focus:outline-none w-14"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                />

                <div className="text-sm text-[#6F5DA8] dark:text-[#6F5DA8] ml-2">
                  $2100.29
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-[#F8EBD0]">
              <span className="flex">
                To receive
                <FiInfo className="text-[#6F5DA8] dark:text-[#6F5DA8] ml-1 mt-1" />
              </span>
              <div className="flex items-center space-x-1">
                {/* <FiInfo className="text-gray-400 dark:text-gray-500" /> */}
                <span className="text-xs text-gray-500 dark:text-[#F8EBD0] font-poppins">
                  0% Slippage
                </span>
              </div>
            </div>
            <div className="flex items-center bg-[#F0EEFF] dark:bg-black rounded-lg p-4 border-[#CCBDFC] border-2">
              <div className="flex items-center space-x-2 bg-white dark:bg-[#3A3A3A] p-2 rounded-lg">
                <img src="/ssol-icon.png" alt="sSOL" className="h-8 w-8" />
                <span className="text-gray-800 dark:text-[#F8EBD0]">sSOL</span>
              </div>
              <div className="ml-auto flex flex-col items-end">
                <input
                  type="text"
                  placeholder="10.89"
                  className="ml-auto text-2xl font-bold text-gray-900 dark:text-[#F8EBD0] bg-transparent focus:outline-none w-14"
                />
                <div className="text-sm text-[#6F5DA8] dark:text-[#6F5DA8] ml-2">
                  $2101.82
                </div>
              </div>
            </div>

            <button
              disabled={!publicKey}
              className="w-full py-3 bg-[#6F5DA8] dark:bg-[#6F5DA8] text-[#F8EBD0] rounded-full font-bold text-lg"
              onClick={handleConvertToSSOL}
            >
              Convert to sSOL
            </button>

            {/* <div className="flex justify-between text-sm text-gray-800 dark:text-[#F8EBD0] font-poppins">
              <span>1 SLS Token</span>
              <span>+1.012 SOL</span>
            </div> */}
          </>
        ) : (
          // Unstake Section
          <>
            <div>
              {/* Unstaking Header */}
              <div className="text-sm text-gray-600 dark:text-[#F8EBD0] mb-6">
                <span>You're unstaking</span>
                <div className="flex items-center space-x-1 float-right">
                  <FaWallet className="text-[#6F5DA8] dark:text-[#6F5DA8]" />
                  <span className="text-xs text-gray-500 dark:text-[#F8EBD0] font-poppins">
                    3,213.76
                  </span>
                </div>
              </div>

              {/* sSOL Information Box */}
              <div className="flex items-center bg-[#F0EEFF] dark:bg-black rounded-lg p-4 border-[#CCBDFC] border-2 mt-2">
                <div className="flex items-center space-x-2 bg-white dark:bg-[#3A3A3A] rounded-lg p-2">
                  <img src="/ssol-icon.png" alt="sSOL" className="h-8 w-8" />
                  <span className="text-gray-800 dark:text-[#F8EBD0]">
                    sSOL
                  </span>
                </div>
                <div className="ml-auto flex flex-col items-end">
                  {/* <div className="text-2xl font-bold text-gray-900 dark:text-[#F8EBD0]">12.5</div> */}
                  <input
                    type="text"
                    placeholder="12.5"
                    className="ml-auto text-2xl font-bold text-gray-900 dark:text-[#F8EBD0] bg-transparent focus:outline-none w-14"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                  />
                  <div className="text-sm text-[#6F5DA8] dark:text-[#6F5DA8]">
                    $2100.29
                  </div>
                </div>
              </div>

              <div className="border-2 border-[#CCBDFC] rounded-lg mt-4 p-2">
                {/* Jupiter and Delayed Options */}
                <div className="flex justify-between items-center p-2 bg-white dark:bg-black rounded-lg border border-[#CCBDFC] dark:text-[#F8EBD0] ">
                  {/* Immediately via Jupiter Section */}
                  <div
                    className={`flex-1 rounded-md p-2 cursor-pointer ${
                      selectedOption === "immediate"
                        ? "bg-[#EDE8FD] dark:bg-[#3A3A3A] border-2 border-[#6F5DA8]"
                        : "bg-white dark:bg-transparent"
                    }`}
                    onClick={() => {
                      setSelectedOption("immediate");
                      setPriorityFee(
                        selectedOption === "immediate" ? priorityFee : false
                      );
                    }}
                  >
                    <span className="text-2xl font-semibold">
                      Immediately{" "}
                      <span className="text-[#6F5DA8]">via Jupiter</span>
                    </span>
                    <div
                      className={`flex space-x-2 mt-2 border-2 py-1 rounded-full px-1 max-w-fit font-sans ${
                        selectedOption === "immediate"
                          ? "bg-white dark:bg-gray-500 border-[#CCBDFC]"
                          : "bg-[#EDE8FD] dark:bg-[#3A3A3A] border-[#6F5DA8]"
                      }`}
                    >
                      {options.map((option) => (
                        <button
                          key={option}
                          className={`py-1 px-2 text-xs font-semibold rounded-full ${
                            selected === option ? "bg-[#6F5DA8] text-white" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent parent div click
                            setSelected(option);
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delayed Section */}
                  <div
                    className={`flex-1 pl-4 space-y-3 rounded-md cursor-pointer ${
                      selectedOption === "delayed"
                        ? "bg-[#EDE8FD] dark:bg-[#3A3A3A] border-2 border-[#6F5DA8] rounded-md"
                        : "bg-white dark:bg-transparent"
                    }`}
                    onClick={() => {
                      setSelectedOption("delayed");
                      setPriorityFee(
                        selectedOption !== "immediate" ? priorityFee : false
                      );
                    }}
                  >
                    <span className="text-2xl font-semibold">
                      Delayed <span className="text-[#6F5DA8]">in 2 days</span>
                    </span>
                    <div
                      className={`text-sm mt-1 font-poppins rounded-md ${
                        selectedOption === "delayed"
                          ? "bg-white dark:bg-gray-500 border-[#CCBDFC] border-2 rounded-md p-2"
                          : "bg-[#EDE8FD] dark:bg-[#3A3A3A]"
                      }`}
                    >
                      0.1% Unstake Fee
                    </div>
                  </div>
                </div>

                {/* SOL Amount Display */}
                <div className="flex items-center space-x-2 justify-between mt-2 bg-[#EDE8FD] rounded-lg p-2 border-[#CCBDFC] dark:bg-black border-2 text-2xl font-bold text-gray-900 dark:text-[#F8EBD0]">
                  <div className="flex items-center space-x-2 bg-white dark:bg-[#3A3A3A] rounded-lg p-2 text-base">
                    <img src="/sol-icon.png" alt="SOL" className="h-8 w-8" />
                    <span className="text-gray-800 dark:text-gray-200">
                      SOL
                    </span>
                  </div>
                  <span className="text-[#6F5DA8]">13.0775647</span>
                </div>
              </div>

              {/* Unstake Button */}
              <div className="mt-4 flex justify-center">
                <button
                  className="w-full py-3 bg-[#6F5DA8] text-[#F8EBD0] rounded-full font-bold text-lg"
                  onClick={handleUnstake}
                  disabled={!publicKey}
                >
                  Unstake SOL
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="w-full max-w-6xl bg-white dark:bg-[#181818] shadow-lg rounded-xl p-6 space-y-6 border border-purple-200 dark:border-[#3A3A3A] mt-2">
        {/* Conversion Rate */}
        <div className="flex justify-between text-sm text-gray-800 dark:text-[#F8EBD0] font-poppins mt-4">
          <span>1 SLS Token</span>
          <span>≈1.012 SOL</span>
        </div>

        {/* Priority Fee Option */}
        <div className="flex items-center justify-between mt-4 font-poppins">
          <span className="text-sm text-gray-800 dark:text-[#F8EBD0] flex items-center relative">
            Priority fee active
            <FiInfo
              className="ml-1 text-[#6F5DA8] dark:text-[#6F5DA8]"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
            {showTooltip && (
              <div className="absolute top-full left-0 mt-2 w-56 p-2 bg-purple-100 text-[#6F5DA8] border-2 border-[#CCBDFC] text-xs rounded-lg shadow-lg dark:bg-[#181818] dark:border-[#3A3A3A] dark:text-[#F8EBD0]">
                Pay a small fee to prioritize the inclusion of your transaction
                in the next blocks.
              </div>
            )}
          </span>
          <div className="flex space-x-2 border-[#CCBDFC] border-2 rounded-full">
            <button
              onClick={() => setPriorityFee(false)}
              className={`px-3 py-1 text-xs rounded-full transition ${
                !priorityFee ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
            >
              Off
            </button>
            <button
              onClick={() => setPriorityFee(true)}
              className={`px-3 py-1 text-xs rounded-full transition font-semibold ${
                priorityFee ? "bg-[#F0EEFF] text-[#5040AA]" : ""
              }`}
            >
              On
            </button>
          </div>
        </div>

        {/* Tips Active Option */}
        {/* <div className="flex items-center justify-between mt-4 font-poppins">
          <span className="text-sm text-gray-800 dark:text-[#F8EBD0] flex items-center">
            Tips active{" "}
            <FiInfo className="ml-1 text-[#6F5DA8] dark:text-[#6F5DA8]" />
          </span>
          <div className="flex space-x-2 border-[#CCBDFC] border-2 rounded-full dark:text-[#F8EBD0]">
            <button
              onClick={() => setTipsActive("off")}
              className={`px-3 py-1 text-xs rounded-full transition ${
                tipsActive === "off" ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
            >
              Off
            </button>
            <button
              onClick={() => setTipsActive("low")}
              className={`px-3 py-1 text-xs rounded-full transition ${
                tipsActive === "low" ? "bg-[#F0EEFF] text-[#5040AA]" : ""
              }`}
            >
              Low
            </button>
            <button
              onClick={() => setTipsActive("on")}
              className={`px-3 py-1 text-xs rounded-full transition font-semibold ${
                tipsActive === "on" ? "bg-[#F0EEFF] text-[#5040AA]" : ""
              }`}
            >
              On
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}
