import "./globals.css";
import ThemeProviderWrapper from "../components/ThemeProviderWrapper";
import WalletConnectionProvider from "../components/WalletConnectionProvider";

import "@solana/wallet-adapter-react-ui/styles.css";

export const metadata = {
  title: "Solistice Finance",
  description: "Solistice Finance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <WalletConnectionProvider>
          <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
        </WalletConnectionProvider>
      </body>
    </html>
  );
}
