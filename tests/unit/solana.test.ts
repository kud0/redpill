import { describe, it, expect } from 'vitest';
import { isValidSolanaAddress, shortenAddress, formatTokenBalance, getExplorerUrl } from '../../lib/solana';

describe('Solana Utilities', () => {
  describe('isValidSolanaAddress', () => {
    it('should return true for valid Solana addresses', () => {
      // Valid base58 addresses (44 characters)
      expect(isValidSolanaAddress('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU')).toBe(true);
      expect(isValidSolanaAddress('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')).toBe(true);
      expect(isValidSolanaAddress('So11111111111111111111111111111111111111112')).toBe(true);
    });

    it('should return false for invalid addresses', () => {
      expect(isValidSolanaAddress('')).toBe(false);
      expect(isValidSolanaAddress('invalid')).toBe(false);
      expect(isValidSolanaAddress('0x1234567890123456789012345678901234567890')).toBe(false); // Ethereum address
      // Note: Solana PublicKey accepts various lengths, so we don't test "too short"
    });

    it('should reject addresses with invalid characters', () => {
      // Base58 doesn't include 0, O, I, l
      expect(isValidSolanaAddress('0xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU')).toBe(false);
    });
  });

  describe('shortenAddress', () => {
    it('should shorten address correctly', () => {
      const address = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
      expect(shortenAddress(address)).toBe('7xKX...gAsU');
    });

    it('should handle custom lengths', () => {
      const address = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
      expect(shortenAddress(address, 6)).toBe('7xKXtg...osgAsU');
    });

    it('should return empty string for invalid input', () => {
      expect(shortenAddress('')).toBe('');
      expect(shortenAddress(null as any)).toBe('');
    });
  });

  describe('formatTokenBalance', () => {
    it('should format large numbers with K suffix', () => {
      expect(formatTokenBalance(1000)).toBe('1.00K');
      expect(formatTokenBalance(1500)).toBe('1.50K');
      expect(formatTokenBalance(500000)).toBe('500.00K');
    });

    it('should format millions with M suffix', () => {
      expect(formatTokenBalance(1000000)).toBe('1.00M');
      expect(formatTokenBalance(2500000)).toBe('2.50M');
      expect(formatTokenBalance(10000000)).toBe('10.00M');
    });

    it('should handle small numbers without suffix', () => {
      expect(formatTokenBalance(100)).toBe('100.00');
      expect(formatTokenBalance(999)).toBe('999.00');
    });

    it('should handle zero', () => {
      expect(formatTokenBalance(0)).toBe('0.00');
    });
  });

  describe('getExplorerUrl', () => {
    it('should generate correct explorer URLs for addresses', () => {
      const address = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
      expect(getExplorerUrl('address', address)).toContain(address);
      expect(getExplorerUrl('address', address)).toContain('solscan.io');
    });

    it('should generate correct explorer URLs for transactions', () => {
      const txHash = 'signature123';
      expect(getExplorerUrl('tx', txHash)).toContain(txHash);
    });
  });
});
