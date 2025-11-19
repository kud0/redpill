# Contributing to RedPill AI

Thank you for your interest in contributing to RedPill AI! This document provides guidelines for contributions.

## Code of Conduct

- Be respectful and inclusive
- Constructive feedback only
- No harassment or inappropriate behavior
- Focus on what is best for the community

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, wallet, etc.)

### Suggesting Features

1. Search existing feature requests
2. Create a new issue with:
   - Clear use case
   - Expected behavior
   - Mockups/examples if applicable
   - Why this benefits users

### Pull Requests

1. Fork the repository
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes following our coding standards

4. Test thoroughly:
   ```bash
   npm run build
   npm run lint
   ```

5. Commit with clear messages:
   ```bash
   git commit -m "Add: feature description"
   ```

6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Open a Pull Request with:
   - Description of changes
   - Related issue numbers
   - Screenshots/demos if applicable
   - Testing notes

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/redpill-ai.git
cd redpill-ai

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Add your API keys to .env

# Start development server
npm run dev
```

## Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define proper types/interfaces
- Avoid `any` when possible
- Use meaningful variable names

### React/Next.js

- Use functional components with hooks
- Follow React best practices
- Use `'use client'` directive when needed
- Optimize performance (memo, useMemo, useCallback)

### Styling

- Use Tailwind CSS classes
- Follow existing color scheme (red/black/dark)
- Mobile-first responsive design
- Maintain consistent spacing

### File Organization

- Components in `/components`
- Pages in `/app`
- API routes in `/app/api`
- Utilities in `/lib`
- Types in `/lib/types.ts`

### Git Commits

Use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add voice cloning feature
fix: resolve wallet connection issue
docs: update deployment guide
```

## Testing

### Before Submitting PR

- [ ] Code builds without errors
- [ ] No console errors
- [ ] Tested on desktop and mobile
- [ ] Tested wallet connection
- [ ] Tested all modified features
- [ ] Linting passes
- [ ] No TypeScript errors

### Testing Commands

```bash
# Build
npm run build

# Lint
npm run lint

# Type check
npm run typecheck
```

## Areas for Contribution

### High Priority

- Voice cloning integration
- Vocal remover integration
- Advanced meme templates
- Performance optimizations
- Mobile UI improvements

### Medium Priority

- Additional AI models
- More social platforms (Farcaster, Mastodon)
- NFT generation
- Video generation
- Custom model training

### Low Priority

- UI animations
- Dark/light theme toggle
- Additional wallet support
- Internationalization (i18n)

## Feature Integration Guidelines

### Adding New AI Features

1. Add type definitions to `/lib/types.ts`
2. Create provider function in `/lib/ai-providers.ts`
3. Add API route in `/app/api/[feature]/route.ts`
4. Create page in `/app/[feature]/page.tsx`
5. Update navigation in `/components/navigation.tsx`
6. Add tier requirements
7. Test thoroughly
8. Update documentation

### Adding New Wallets

1. Install wallet adapter: `npm install @solana/wallet-adapter-[wallet]`
2. Add to `/components/providers.tsx`
3. Test connection and signing
4. Update README

### Adding New Platforms (Thread Writer)

1. Add platform type to `/lib/types.ts`
2. Update `/lib/ai-providers.ts` with platform-specific logic
3. Update UI in `/app/thread-writer/page.tsx`
4. Test character limits and formatting

## Review Process

1. PR submitted
2. Automated checks run (build, lint)
3. Code review by maintainers
4. Feedback addressed
5. Approved and merged
6. Deployed to production

## Questions?

- Open an issue for discussion
- Join our Discord: [discord.gg/redpillai](https://discord.gg/redpillai)
- Email: dev@redpill.ai

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to RedPill AI! 🔴
