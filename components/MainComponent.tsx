"use client";
import { useState } from "react";
import TransactionSuccess from "../solana/TransactionSucces";
import StakeUnstakeComponent from "./StakeUnstake";

export default function MainComponent() {
  const [successSignature, setSuccessSignature] = useState("");

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-[#ede9f7] dark:bg-black p-4 lg:p-1 space-y-6 lg:space-y-0 lg:space-x-8">
      {/* Left Side */}
      {successSignature && (
        <TransactionSuccess
          successSignature={successSignature}
          setSuccessSignature={setSuccessSignature}
        ></TransactionSuccess>
      )}
      <div className="lg:w-1/2 max-w-lg space-y-4 text-center lg:text-left">
        <h2 className="text-6xl font-bold text-[#1F0B35] dark:text-[#F8EBD0]">
          MEV powered staking rewards
        </h2>
        <p className="text-[#5040AA] text-2xl dark:text-[#CCBDFC]">
          Boost your yield by up to 15% when you stake with Solistic
        </p>
        {/* <div className="bg-[#CCBDFC] rounded-lg h-64 w-96 dark:bg-[#3A3A3A] flex flex-col items-center justify-center p-6 space-y-4">
  <h3 className="text-[#1F0B35] dark:text-[#F8EBD0] text-xl font-semibold">
    Value of SOL vs sSOL over time
  </h3>

  <div className="space-y-4 w-full">
  
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 rounded-full flex items-center justify-center">
        <img src="/sol-icon.png" alt="SOL Logo" className="w-8 h-8" />
      </div>
      <div className="flex-1 bg-[#A99EDB] h-2 rounded-full"></div>
    </div>
   
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 rounded-full dark:bg-[#F8EBD0] flex items-center justify-center">
        <img src="/ssol-icon.png" alt="sSOL Logo" className="w-8 h-8" />
      </div>
      <div className="flex-1 bg-[#7465C2] h-2 rounded-full"></div>
    </div>
  </div>

  <p className="text-[#181818] dark:text-[#F8EBD0] text-sm text-center">
    1 sSOL = <span className="font-bold">1.00 SOL</span>
  </p>
</div> */}
        <div className="bg-[#CCBDFC] rounded-lg h-64 w-96 dark:bg-[#3A3A3A] flex items-center justify-center overflow-hidden">
          <video
            className="w-full h-full object-cover rounded-lg block dark:hidden"
            autoPlay
            loop
            muted
          >
            <source src="/info-light.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <video
            className="w-full h-full object-cover rounded-lg hidden dark:block"
            autoPlay
            loop
            muted
          >
            <source src="/info-dark.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <p className="text-3xl text-[#181818] dark:text-gray-300">
          Why 1 SOL is not 1 sSOL
        </p>
        <p className="text-2xl font-poppins text-[#3A3A3A] dark:text-gray-500">
          When you stake SOL tokens in order to receive sSOL tokens, you receive
          a slightly lower amount of sSOL.{" "}
          <span className="text-[#6F5DA8] dark:text-[#CCBDFC] font-semibold">
            Learn more
          </span>
        </p>
      </div>

      {/* Right Side */}
      <div className="lg:w-1/2 w-full max-w-md">
        {/* StakeUnstakeComponent (mobile version) */}
        <StakeUnstakeComponent
          successSignature={successSignature}
          setSuccessSignature={setSuccessSignature}
        />
      </div>
    </div>
  );
}
