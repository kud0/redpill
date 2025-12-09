import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTierInfo, getUserTier } from '../../lib/helius';

describe('Helius Token Balance', () => {
  describe('getUserTier', () => {
    it('should return none for zero balance', () => {
      expect(getUserTier(0)).toBe('none');
    });

    it('should return none for balance below basic threshold', () => {
      expect(getUserTier(100_000)).toBe('none');
      expect(getUserTier(499_999)).toBe('none');
    });

    it('should return basic for balance at or above 500K', () => {
      expect(getUserTier(500_000)).toBe('basic');
      expect(getUserTier(1_000_000)).toBe('basic');
      expect(getUserTier(1_999_999)).toBe('basic');
    });

    it('should return full for balance at or above 2M', () => {
      expect(getUserTier(2_000_000)).toBe('full');
      expect(getUserTier(5_000_000)).toBe('full');
      expect(getUserTier(9_999_999)).toBe('full');
    });

    it('should return god for balance at or above 10M', () => {
      expect(getUserTier(10_000_000)).toBe('god');
      expect(getUserTier(50_000_000)).toBe('god');
      expect(getUserTier(100_000_000)).toBe('god');
    });
  });

  describe('getTierInfo', () => {
    it('should return complete tier info for any balance', () => {
      const info = getTierInfo(500_000);

      expect(info).toHaveProperty('level');
      expect(info).toHaveProperty('balance');
      expect(info).toHaveProperty('minRequired');
      expect(info).toHaveProperty('features');
    });

    it('should include correct balance in tier info', () => {
      const info = getTierInfo(1_500_000);
      expect(info.balance).toBe(1_500_000);
    });

    it('should include features array in tier info', () => {
      const info = getTierInfo(500_000);
      expect(Array.isArray(info.features)).toBe(true);
    });

    it('should return appropriate tier level in info', () => {
      expect(getTierInfo(0).level).toBe('none');
      expect(getTierInfo(500_000).level).toBe('basic');
      expect(getTierInfo(2_000_000).level).toBe('full');
      expect(getTierInfo(10_000_000).level).toBe('god');
    });
  });
});
