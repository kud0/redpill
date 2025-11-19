import { PublicKey } from '@solana/web3.js';

/**
 * Validates a Solana wallet address
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Shortens a wallet address for display
 * Example: 7xKX...9vwQ
 */
export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Formats token balance for display
 */
export function formatTokenBalance(balance: number): string {
  if (balance >= 1_000_000) {
    return `${(balance / 1_000_000).toFixed(2)}M`;
  } else if (balance >= 1_000) {
    return `${(balance / 1_000).toFixed(2)}K`;
  }
  return balance.toFixed(2);
}

/**
 * Gets the Solana network explorer URL
 */
export function getExplorerUrl(
  type: 'address' | 'tx',
  value: string,
  network: 'mainnet-beta' | 'devnet' = 'mainnet-beta'
): string {
  const cluster = network === 'mainnet-beta' ? '' : `?cluster=${network}`;
  return `https://solscan.io/${type}/${value}${cluster}`;
}
