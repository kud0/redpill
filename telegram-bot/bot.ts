import { Bot, InlineKeyboard, Context } from 'grammy';
import { checkTokenBalance, getTierInfo } from '../lib/helius';
import { generateImage, generateMeme, writeThread } from '../lib/ai-providers';
import { isValidSolanaAddress } from '../lib/solana';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is not configured');
}

const bot = new Bot(BOT_TOKEN);

// In-memory wallet storage (use database in production)
const userWallets = new Map<number, string>();

// Helper to check if user has linked wallet
function getUserWallet(userId: number): string | null {
  return userWallets.get(userId) || null;
}

// Start command
bot.command('start', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('Link Wallet', 'link_wallet')
    .row()
    .text('Check Balance', 'check_balance')
    .row()
    .text('Image Generator', 'image_generator')
    .text('Meme Generator', 'meme_generator')
    .row()
    .text('Thread Writer', 'thread_writer');

  await ctx.reply(
    `🔴 *Welcome to RedPill AI Bot!*\n\n` +
    `Hold $REDPILL tokens to unlock unlimited access to premium AI tools.\n\n` +
    `*Features:*\n` +
    `• Image Generation (Flux.1 Pro & SD3)\n` +
    `• Meme Generator\n` +
    `• Thread Writer (X, Warpcast, Lens)\n` +
    `• Voice Cloner (Coming Soon)\n` +
    `• Vocal Remover (Coming Soon)\n\n` +
    `First, link your Solana wallet to get started!`,
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    }
  );
});

// Link wallet callback
bot.callbackQuery('link_wallet', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    '🔗 *Link Your Wallet*\n\n' +
    'Send me your Solana wallet address to link your account.\n\n' +
    'Example: `7xKX...9vwQ`',
    { parse_mode: 'Markdown' }
  );

  // Set conversation state (in production, use proper state management)
  ctx.session = { awaitingWallet: true };
});

// Check balance callback
bot.callbackQuery('check_balance', async (ctx) => {
  await ctx.answerCallbackQuery();

  const wallet = getUserWallet(ctx.from.id);
  if (!wallet) {
    await ctx.reply('Please link your wallet first using /start');
    return;
  }

  try {
    const balance = await checkTokenBalance(wallet);
    const tierInfo = getTierInfo(balance);

    const tierEmoji = {
      none: '❌',
      basic: '🔵',
      full: '🟣',
      god: '🔴',
    };

    await ctx.reply(
      `💰 *Your Balance*\n\n` +
      `Wallet: \`${wallet.slice(0, 4)}...${wallet.slice(-4)}\`\n` +
      `Balance: *${balance.toLocaleString()} $REDPILL*\n\n` +
      `${tierEmoji[tierInfo.level]} Tier: *${tierInfo.level.toUpperCase()}*\n\n` +
      `*Available Features:*\n` +
      tierInfo.features.map(f => `• ${f}`).join('\n'),
      { parse_mode: 'Markdown' }
    );
  } catch (error) {
    await ctx.reply('Failed to check balance. Please try again.');
  }
});

// Image generator callback
bot.callbackQuery('image_generator', async (ctx) => {
  await ctx.answerCallbackQuery();

  const wallet = getUserWallet(ctx.from.id);
  if (!wallet) {
    await ctx.reply('Please link your wallet first using /start');
    return;
  }

  await ctx.reply(
    '🎨 *Image Generator*\n\n' +
    'Send me a detailed prompt to generate an image.\n\n' +
    'Example: "A futuristic city at sunset with flying cars"',
    { parse_mode: 'Markdown' }
  );

  // Set conversation state
  ctx.session = { awaitingImagePrompt: true };
});

// Meme generator callback
bot.callbackQuery('meme_generator', async (ctx) => {
  await ctx.answerCallbackQuery();

  const wallet = getUserWallet(ctx.from.id);
  if (!wallet) {
    await ctx.reply('Please link your wallet first using /start');
    return;
  }

  const keyboard = new InlineKeyboard()
    .text('Drake', 'meme_drake')
    .text('Distracted BF', 'meme_distracted')
    .row()
    .text('Two Buttons', 'meme_buttons')
    .text('Pepe', 'meme_pepe');

  await ctx.reply(
    '🎭 *Meme Generator*\n\n' +
    'Choose a meme template:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    }
  );
});

// Thread writer callback
bot.callbackQuery('thread_writer', async (ctx) => {
  await ctx.answerCallbackQuery();

  const wallet = getUserWallet(ctx.from.id);
  if (!wallet) {
    await ctx.reply('Please link your wallet first using /start');
    return;
  }

  await ctx.reply(
    '✍️ *Thread Writer*\n\n' +
    'Send me a topic to write a thread about.\n\n' +
    'Example: "The future of AI in crypto"',
    { parse_mode: 'Markdown' }
  );

  // Set conversation state
  ctx.session = { awaitingThreadTopic: true };
});

// Handle text messages
bot.on('message:text', async (ctx) => {
  const text = ctx.message.text;

  // Check if awaiting wallet address
  if (ctx.session?.awaitingWallet) {
    if (isValidSolanaAddress(text)) {
      userWallets.set(ctx.from.id, text);
      await ctx.reply(
        `✅ Wallet linked successfully!\n\n` +
        `Address: \`${text.slice(0, 4)}...${text.slice(-4)}\`\n\n` +
        `Use the menu to access features.`,
        { parse_mode: 'Markdown' }
      );
      ctx.session = {};
    } else {
      await ctx.reply('Invalid Solana address. Please try again.');
    }
    return;
  }

  // Check if awaiting image prompt
  if (ctx.session?.awaitingImagePrompt) {
    const wallet = getUserWallet(ctx.from.id);
    if (!wallet) return;

    await ctx.reply('🎨 Generating image... This may take a minute.');

    try {
      const imageUrl = await generateImage(text, 'sd3-medium');
      await ctx.replyWithPhoto(imageUrl, {
        caption: `✨ Generated: "${text}"`,
      });
    } catch (error) {
      await ctx.reply('Failed to generate image. Please check your tier and try again.');
    }

    ctx.session = {};
    return;
  }

  // Check if awaiting thread topic
  if (ctx.session?.awaitingThreadTopic) {
    const wallet = getUserWallet(ctx.from.id);
    if (!wallet) return;

    await ctx.reply('✍️ Writing thread... This may take a moment.');

    try {
      const thread = await writeThread(text, 'x', { tone: 'casual', length: 5 });
      const threadText = thread.map((post, i) => `${i + 1}. ${post}`).join('\n\n');

      await ctx.reply(
        `✨ *Thread Generated*\n\n${threadText}`,
        { parse_mode: 'Markdown' }
      );
    } catch (error) {
      await ctx.reply('Failed to write thread. Please check your tier and try again.');
    }

    ctx.session = {};
    return;
  }

  // Default response
  await ctx.reply('Use /start to see available commands.');
});

// Error handler
bot.catch((err) => {
  console.error('Bot error:', err);
});

// Start the bot
console.log('🤖 RedPill AI Telegram Bot starting...');
bot.start();

export default bot;
