import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables for tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
process.env.HELIUS_API_KEY = 'test-helius-key';
process.env.FAL_KEY = 'test-fal-key';
process.env.GROQ_API_KEY = 'test-groq-key';
process.env.ELEVENLABS_API_KEY = 'test-elevenlabs-key';
process.env.REPLICATE_API_TOKEN = 'test-replicate-token';

// Mock fetch globally
global.fetch = vi.fn();

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
