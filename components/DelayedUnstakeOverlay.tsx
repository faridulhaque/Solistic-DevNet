import React from 'react';

const DelayedUnstakeOverlay = () => {
  return (
    <div className="bg-[#F0EEFF] p-6 rounded-3xl shadow-lg max-w-7xl mx-auto dark:bg-[#202020]">
        
      <h2 className="text-3xl font-semibold text-[#1F0B35] mb-4 mt-10 ml-10 dark:text-[#F8EBD0]">Delayed Unstake</h2>
      
      <div className="space-y-4 mx-6">
        {/* Step 1 */}
        <div className="flex items-start space-x-3">
          <div className="diamond-number"><span className='text-[#6F5DA8] dark:text-[#F8EBD0]'>1</span></div>
          <div className='font-poppins'>
            <p className="font-semibold text-[#1F0B35] dark:text-[#F8EBD0]">Initiate the unstaking process.</p>
            <p className="text-[#1F0B35] dark:text-[#F8EBD0]">This will transfer your stake from the pool to a stake account in your wallet.</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start space-x-3">
        <div className="diamond-number"><span className='text-[#6F5DA8] dark:text-[#F8EBD0]'>2</span></div>
          <div className='font-poppins'>
            <p className="font-semibold text-[#1F0B35] dark:text-[#F8EBD0]">
              Manually deactivate your stake account by clicking on the "Deactivate" button on the 
              <a href="#" className="text-[#6F5DA8]"> Manage Stake Accounts</a> page or in your wallet.
            </p>
            <p className="text-[#1F0B35] dark:text-[#F8EBD0]">
              Your stake will be available at the next epoch boundary, which is approximately at Nov 8, 2024, 11:31 PM. Your funds will remain locked until that time.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start space-x-3">
        <div className="diamond-number"><span className='text-[#6F5DA8] dark:text-[#F8EBD0]'>3</span></div>
          <div className='font-poppins'>
            <p className="font-semibold text-[#1F0B35] dark:text-[#F8EBD0]">
              Once your stake has finished deactivating click on the "Withdraw" button to withdraw SOL to your wallet.
            </p>
            <p className="text-[#1F0B35] dark:text-[#F8EBD0]">
              After the SOL is withdrawn to your wallet it can be moved around freely.
            </p>
          </div>
        </div>
      </div>

      {/* Note */}
      <p className="text-[#1F0B35] mt-4 mb-10 mx-10 font-poppins dark:text-[#F8EBD0]">
        <span className="font-bold">NOTE:</span> This action is irreversible. Once initiated, Solistic will remove your stake from the stake pool. For a detailed walkthrough, refer to our specific wallet guides: 
        <a href="#" className="text-[#6F5DA8] font-bold underline"> Phantom Wallet Guide</a>, 
        <a href="#" className="text-[#6F5DA8] font-bold underline"> Solflare Wallet Guide</a>
      </p>
    </div>
  );
};

export default DelayedUnstakeOverlay;
