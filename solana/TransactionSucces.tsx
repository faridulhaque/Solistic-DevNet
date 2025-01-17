"use client";
import React, { useState } from "react";

type TTrxSuccess = {
  successSignature: string;
  setSuccessSignature: (value: string) => void;
};

const TransactionSuccess = ({
  successSignature,
  setSuccessSignature,
}: TTrxSuccess) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(successSignature);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset "Copied" after 2 seconds
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white shadow-lg rounded-lg p-5 w-96 text-center">
        <h2 className="text-2xl text-start font-bold text-[#1F0B35]">
          Transaction successful!
        </h2>
        <p className="mt-4 text-start text-sm text-[#181818] break-all">
          <strong>Signature</strong>
          <br />
          {successSignature}
        </p>
        {/* Buttons placed to the right */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            className={`px-4 py-2 rounded-full border border-gray-700 ${
              isCopied ? "text-[#65558F]" : "text-[#65558F]"
            } text-sm transition`}
            onClick={handleCopy}
          >
            {isCopied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={() => setSuccessSignature("")}
            className="px-4 py-2 rounded-full bg-[#65558F] text-white text-sm transition"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionSuccess;
