import ConnectWalletButton from "./ConnectWalletButton";
import ThemeToggleButton from "./ThemeToggle";

const Navbar = () => {
  return (
    <div className="relative flex items-center justify-between px-4 py-2 border-2 rounded-full bg-white dark:bg-[#181818] border-[#CCBDFC] dark:border-[#3A3A3A] w-full max-w-3xl mx-auto mt-6 sm:mt-8 md:mt-10 lg:mt-4">
      {/* Left side logo */}
      <div className="flex-1 flex items-center">
        <img 
          src="/logo-light.png" 
          alt="Logo Light" 
          className="block dark:hidden h-8"
        />
        <img 
          src="/logo-dark.png" 
          alt="Logo Dark" 
          className="hidden dark:block h-8"
        />
      </div>

      {/* Right side buttons */}
      <div className="flex items-center">
      <ThemeToggleButton />
        <ConnectWalletButton />
      </div>
    </div>
  );
};

export default Navbar;
