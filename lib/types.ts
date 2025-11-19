export type TierLevel = 'none' | 'basic' | 'full' | 'god';

export interface UserTier {
  level: TierLevel;
  balance: number;
  minRequired: number;
  features: string[];
}

export interface TierConfig {
  name: string;
  minTokens: number;
  features: string[];
  color: string;
}

export const TIER_CONFIGS: Record<TierLevel, TierConfig> = {
  none: {
    name: 'No Access',
    minTokens: 0,
    features: [],
    color: 'gray',
  },
  basic: {
    name: 'Basic',
    minTokens: 500_000,
    features: ['Image Generation (SD3 Medium)', 'Thread Writer', 'Meme Generator'],
    color: 'blue',
  },
  full: {
    name: 'Full Access',
    minTokens: 2_000_000,
    features: ['All Basic Features', 'Image Generation (Flux.1 Pro)', 'Voice Cloner', 'Vocal Remover'],
    color: 'purple',
  },
  god: {
    name: 'God Mode',
    minTokens: 10_000_000,
    features: ['All Features', 'Priority Processing', 'Unlimited Requests', 'Early Access'],
    color: 'red',
  },
};

export interface GenerateImageRequest {
  prompt: string;
  model?: 'flux-pro' | 'sd3-medium';
  width?: number;
  height?: number;
  steps?: number;
}

export interface GenerateMemeRequest {
  template: string;
  topText?: string;
  bottomText?: string;
}

export interface WriteThreadRequest {
  topic: string;
  platform: 'x' | 'warpcast' | 'lens';
  length?: number;
  tone?: 'professional' | 'casual' | 'humorous';
}

export interface CloneVoiceRequest {
  audioFile: File;
  text: string;
}

export interface SplitStemsRequest {
  audioFile: File;
  outputFormat?: 'wav' | 'mp3';
}

export interface RateLimitInfo {
  wallet: string;
  requests: number;
  resetAt: number;
}
