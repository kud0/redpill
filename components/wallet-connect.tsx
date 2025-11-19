'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function WalletConnect() {
  return (
    <div className="relative">
      <WalletMultiButton className="!bg-redpill-600 hover:!bg-redpill-700 !rounded-lg !px-6 !py-3 !font-semibold !transition-all !duration-200 redpill-glow" />
    </div>
  );
}
