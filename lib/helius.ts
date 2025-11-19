import { TierLevel, TIER_CONFIGS, UserTier } from './types';

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
const REDPILL_TOKEN_ADDRESS = process.env.REDPILL_TOKEN_ADDRESS;

interface HeliusBalanceResponse {
  result: {
    value: Array<{
      account: {
        data: {
          parsed: {
            info: {
              mint: string;
              tokenAmount: {
                amount: string;
                decimals: number;
                uiAmount: number;
              };
            };
          };
        };
      };
    }>;
  };
}

/**
 * Checks the $REDPILL token balance for a given wallet address
 */
export async function checkTokenBalance(walletAddress: string): Promise<number> {
  if (!HELIUS_API_KEY) {
    throw new Error('HELIUS_API_KEY is not configured');
  }

  if (!REDPILL_TOKEN_ADDRESS) {
    throw new Error('REDPILL_TOKEN_ADDRESS is not configured');
  }

  try {
    const response = await fetch(`https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountsByOwner',
        params: [
          walletAddress,
          {
            mint: REDPILL_TOKEN_ADDRESS,
          },
          {
            encoding: 'jsonParsed',
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Helius API error: ${response.statusText}`);
    }

    const data: HeliusBalanceResponse = await response.json();

    if (!data.result?.value?.length) {
      return 0;
    }

    const tokenAccount = data.result.value[0];
    return tokenAccount.account.data.parsed.info.tokenAmount.uiAmount || 0;
  } catch (error) {
    console.error('Error checking token balance:', error);
    throw new Error('Failed to check token balance');
  }
}

/**
 * Determines the user's tier based on token balance
 */
export function getUserTier(balance: number): TierLevel {
  if (balance >= TIER_CONFIGS.god.minTokens) {
    return 'god';
  } else if (balance >= TIER_CONFIGS.full.minTokens) {
    return 'full';
  } else if (balance >= TIER_CONFIGS.basic.minTokens) {
    return 'basic';
  }
  return 'none';
}

/**
 * Gets complete tier information for a user
 */
export function getTierInfo(balance: number): UserTier {
  const tier = getUserTier(balance);
  const config = TIER_CONFIGS[tier];

  return {
    level: tier,
    balance,
    minRequired: config.minTokens,
    features: config.features,
  };
}

/**
 * Checks if a wallet has access to a specific feature tier
 */
export async function hasAccess(
  walletAddress: string,
  requiredTier: TierLevel
): Promise<boolean> {
  const balance = await checkTokenBalance(walletAddress);
  const userTier = getUserTier(balance);

  const tierHierarchy: TierLevel[] = ['none', 'basic', 'full', 'god'];
  const userTierIndex = tierHierarchy.indexOf(userTier);
  const requiredTierIndex = tierHierarchy.indexOf(requiredTier);

  return userTierIndex >= requiredTierIndex;
}
