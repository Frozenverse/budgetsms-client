# Contributing to budgetsms-client

Thank you for your interest in contributing to budgetsms-client! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful and considerate in all interactions. We're here to build great software together.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Setup Development Environment

1. **Fork the repository**
   - Visit https://github.com/Frozenverse/budgetsms-client
   - Click "Fork" in the top right

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/budgetsms-client.git
   cd budgetsms-client
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Type Checking

```bash
npm run typecheck
```

### Building

```bash
# Build the package
npm run build

# Build in watch mode
npm run dev
```

### Testing Your Changes

Before submitting, make sure:

1. All tests pass: `npm test`
2. TypeScript compiles: `npm run typecheck`
3. Build succeeds: `npm run build`
4. Code follows existing patterns

## Contribution Guidelines

### Types of Contributions

We welcome:

- **Bug fixes**: Fix issues in existing functionality
- **Features**: Add new API endpoints or utilities
- **Documentation**: Improve README, examples, or code comments
- **Tests**: Add or improve test coverage
- **Performance**: Optimize existing code

### Pull Request Process

1. **Update tests**: Add tests for your changes
2. **Update documentation**: Update README if adding features
3. **Follow code style**: Match existing code patterns
4. **Write clear commits**: Use descriptive commit messages
5. **Submit PR**: Open a pull request with a clear description

### Commit Message Format

Use clear, descriptive commit messages:

```
feat: add support for custom timeout per request
fix: correct response parsing for empty credit response
docs: update API examples in README
test: add tests for error handling
refactor: simplify URL encoding logic
```

Prefixes:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Test additions or changes
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

### Code Style

- Use TypeScript for all new code
- Follow existing formatting and patterns
- Add JSDoc comments for public APIs
- Keep functions focused and small
- Prefer explicit types over `any`

### Testing Requirements

- Add tests for new features
- Ensure existing tests still pass
- Aim for high code coverage
- Test both success and error cases

## Project Structure

```
budgetsms-client/
├── src/
│   ├── client.ts      # Main API client
│   ├── types.ts       # TypeScript type definitions
│   ├── constants.ts   # Error codes, DLR statuses
│   ├── errors.ts      # Custom error class
│   ├── utils.ts       # Utilities
│   └── index.ts       # Main exports
├── test/
│   ├── client.test.ts # Client tests
│   └── utils.test.ts  # Utility tests
└── dist/              # Build output (generated)
```

## Adding New Features

### Adding a New API Method

1. Add types to `src/types.ts`
2. Implement method in `src/client.ts`
3. Add tests in `test/client.test.ts`
4. Update README with examples
5. Export from `src/index.ts` if needed

### Adding New Error Codes

1. Add to enum in `src/constants.ts`
2. Add description to `ERROR_MESSAGES`
3. Update tests if needed

## Submitting Changes

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template

3. **Respond to feedback**
   - Address review comments
   - Push additional commits if needed

4. **Merge**
   - Once approved, a maintainer will merge your PR

## Getting Help

- **Questions**: Open a [GitHub Discussion](https://github.com/Frozenverse/budgetsms-client/discussions)
- **Bugs**: Open a [GitHub Issue](https://github.com/Frozenverse/budgetsms-client/issues)
- **Features**: Discuss in issues before implementing large features

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions make this project better for everyone. Thank you for taking the time to contribute!
