import { describe, it, expect } from 'vitest';
import { TIER_CONFIGS, TierLevel } from '../../lib/types';

describe('Tier Configuration', () => {
  describe('TIER_CONFIGS', () => {
    it('should have all tier levels defined', () => {
      const tiers: TierLevel[] = ['none', 'basic', 'full', 'god'];
      tiers.forEach(tier => {
        expect(TIER_CONFIGS[tier]).toBeDefined();
      });
    });

    it('should have increasing token requirements', () => {
      expect(TIER_CONFIGS.none.minTokens).toBe(0);
      expect(TIER_CONFIGS.basic.minTokens).toBeGreaterThan(TIER_CONFIGS.none.minTokens);
      expect(TIER_CONFIGS.full.minTokens).toBeGreaterThan(TIER_CONFIGS.basic.minTokens);
      expect(TIER_CONFIGS.god.minTokens).toBeGreaterThan(TIER_CONFIGS.full.minTokens);
    });

    it('should have correct minimum token values', () => {
      expect(TIER_CONFIGS.none.minTokens).toBe(0);
      expect(TIER_CONFIGS.basic.minTokens).toBe(500_000);
      expect(TIER_CONFIGS.full.minTokens).toBe(2_000_000);
      expect(TIER_CONFIGS.god.minTokens).toBe(10_000_000);
    });

    it('should have features for each tier except none', () => {
      expect(TIER_CONFIGS.none.features).toHaveLength(0);
      expect(TIER_CONFIGS.basic.features.length).toBeGreaterThan(0);
      expect(TIER_CONFIGS.full.features.length).toBeGreaterThan(0);
      expect(TIER_CONFIGS.god.features.length).toBeGreaterThan(0);
    });

    it('should have name and color for each tier', () => {
      Object.values(TIER_CONFIGS).forEach(config => {
        expect(config.name).toBeDefined();
        expect(config.color).toBeDefined();
      });
    });

    it('basic tier should include core features', () => {
      const basicFeatures = TIER_CONFIGS.basic.features;
      expect(basicFeatures.some(f => f.toLowerCase().includes('image'))).toBe(true);
      expect(basicFeatures.some(f => f.toLowerCase().includes('thread'))).toBe(true);
      expect(basicFeatures.some(f => f.toLowerCase().includes('meme'))).toBe(true);
    });

    it('full tier should include voice features', () => {
      const fullFeatures = TIER_CONFIGS.full.features;
      expect(fullFeatures.some(f => f.toLowerCase().includes('voice'))).toBe(true);
      expect(fullFeatures.some(f => f.toLowerCase().includes('vocal'))).toBe(true);
    });

    it('god tier should include priority and unlimited features', () => {
      const godFeatures = TIER_CONFIGS.god.features;
      expect(godFeatures.some(f => f.toLowerCase().includes('priority'))).toBe(true);
      expect(godFeatures.some(f => f.toLowerCase().includes('unlimited'))).toBe(true);
    });
  });
});
