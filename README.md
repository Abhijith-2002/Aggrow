# Aggrow

## Overview
Aggrow is an AI powered crop disease detection and management system develoiped as part of Mini Project S6 - Model Engineering College Thrikkakkara

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.x or higher recommended)
- [npm](https://www.npmjs.com/) (v9.x or higher) or [yarn](https://yarnpkg.com/) (v1.22.x or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Aggrow.git
cd Aggrow
```

2. Install dependencies:
```bash
# Using npm
npm install

# Using yarn
yarn
```

## Running the Application

### Development Mode
This starts the development server with hot-reload enabled:

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

The application will be available at `http://localhost:5173` by default.

### Development with API Mocking
If you want to use mock API data during development:

```bash
# Using npm
npm run dev:mock

# Using yarn
yarn dev:mock
```

## Project Structure
```
Aggrow/
├── public/            # Static assets that will be served as-is
├── src/               # Source code
│   ├── assets/        # Images, fonts, etc.
│   ├── components/    # Reusable React components
│   ├── contexts/      # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── services/      # API service functions
│   ├── styles/        # Global styles and themes
│   ├── utils/         # Utility functions
│   ├── App.jsx        # Main App component
│   ├── main.jsx       # Entry point
│   └── vite-env.d.ts  # Vite type definitions
├── tests/             # Test files
├── .eslintrc.json     # ESLint configuration
├── .gitignore         # Git ignore rules
├── index.html         # HTML entry point
├── package.json       # Project dependencies and scripts
├── vite.config.js     # Vite configuration
└── README.md          # This file
```

## Development Workflow

### Code Style and Linting
We use ESLint and Prettier to maintain code quality:

```bash
# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format
```

### Environment Variables
Environment variables can be set in the following files:
- `.env` - Loaded in all environments
- `.env.development` - Development-specific variables
- `.env.production` - Production-specific variables

**Important:** Never commit sensitive information in these files.

Example `.env` file:
```
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My Vite React App
```

Access environment variables in your code using `import.meta.env.VITE_*`:
```javascript
console.log(import.meta.env.VITE_API_URL);
```

## Testing

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

### Writing Tests
Place your test files in the `tests` directory or alongside the components with a `.test.jsx` or `.spec.jsx` extension.

Example test for a component:
```jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## Building for Production

To build the application for production:

```bash
npm run build
```

This will generate optimized files in the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

## Contributing

Currently only the collaborators aka project members would be allowed to contribute , here is a guide to making commits/contributions :

1. **Fork** the repository on GitHub
2. **Clone** your fork to your local machine
3. **Create a branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** and commit them with descriptive messages:
   ```bash
   git commit -m "Add: your feature description"
   ```
5. **Push** your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request** against the main repository

### Commit Message Guidelines
We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for code style changes (formatting, etc.)
- `refactor:` for code refactoring
- `test:` for adding or modifying tests
- `chore:` for maintenance tasks

Example: `feat: add user authentication system`

### Pull Request Process
1. Ensure your code passes all tests
2. Update documentation if necessary
3. Your PR should be reviewed by at least one maintainer
4. Once approved, a maintainer will merge your PR

## Troubleshooting

### Common Issues

#### "Module not found" errors
```
npm install
```

#### Vite dev server not starting
Check if the port is already in use. You can change the port in `vite.config.js`.

#### Hot reloading not working
Make sure you're not using `React.memo`, `useMemo`, or `useCallback` unnecessarily.

#### Environment variables not loading
- Ensure variables are prefixed with `VITE_`
- Restart the development server after changing environment files

### Getting Help
If you encounter any issues, please:
1. Check the existing issues on GitHub
2. Search through the documentation
3. Open a new issue with a detailed description of the problem

---

## License
This project is licensed under the MIT License - see the LICENSE file for details.