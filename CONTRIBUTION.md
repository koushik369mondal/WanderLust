# Contributing to WanderLust

Thank you for your interest in contributing to WanderLust! 🌍 This project is a full-stack web application for sharing and exploring travel experiences, built with Node.js, Express.js, MongoDB, and EJS. We're excited to have you join our community and help make WanderLust even better.

## Table of Contents

- [Introduction](#introduction)
- [Ways to Contribute](#ways-to-contribute)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Code Style and Standards](#code-style-and-standards)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Community Guidelines](#community-guidelines)
- [License](#license)

## Introduction

WanderLust is an open-source travel experience sharing platform that allows users to explore destinations, share their travel stories, and connect with fellow travelers. As part of GirlScript Summer of Code (GSSoC) 2025, we're committed to fostering a collaborative environment where contributors of all skill levels can learn, grow, and make meaningful contributions.

## Ways to Contribute

There are many ways you can contribute to WanderLust:

- **Code Contributions**: Fix bugs, add new features, or improve existing functionality
- **Documentation**: Improve README, write tutorials, or create API documentation
- **Testing**: Write unit tests, integration tests, or help with QA
- **Design**: Improve UI/UX, create new designs, or enhance user experience
- **Bug Reports**: Report issues and help us identify problems
- **Feature Requests**: Suggest new features or improvements
- **Community Support**: Help answer questions from other contributors

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas)
- [Git](https://git-scm.com/)
- A code editor (we recommend [VS Code](https://code.visualstudio.com/))

### Fork and Clone the Repository

1. Fork this repository by clicking the "Fork" button at the top right of this page
2. Clone your fork to your local machine:

```bash
git clone https://github.com/YOUR-USERNAME/WanderLust.git
cd WanderLust
```

3. Add the upstream remote:

```bash
git remote add upstream https://github.com/koushik369mondal/WanderLust.git
```

## Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Set up the required environment variables (refer to README.md for detailed setup):
   - Cloudinary credentials for image uploads
   - Mapbox API token for maps
   - MongoDB Atlas connection string
   - Session secret

### 3. Database Setup

The application uses MongoDB. You can either:

- Use MongoDB Atlas (cloud) - recommended for development
- Install MongoDB locally

### 4. Run the Application

```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:8080`

### 5. Initialize Database (Optional)

If you want to populate the database with sample data:

```bash
node init/index.js
```

## Contributing Guidelines

### Branch Naming Convention

When creating branches for your contributions, use the following naming convention:

- `feature/description-of-feature` - for new features
- `bugfix/description-of-bug` - for bug fixes
- `docs/description-of-docs` - for documentation updates
- `refactor/description-of-refactor` - for code refactoring
- `test/description-of-test` - for adding tests

Example:
```bash
git checkout -b feature/add-user-profile-page
```

### Commit Message Guidelines

Write clear, concise commit messages that follow this format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```bash
git commit -m "feat: add user authentication system"
git commit -m "fix: resolve map loading issue on mobile devices"
git commit -m "docs: update installation instructions"
```

### Code Changes

- Keep changes focused and atomic
- Test your changes thoroughly
- Update documentation if needed
- Ensure your code follows the project's coding standards

## Code Style and Standards

### JavaScript/Node.js

- Use ES6+ features where appropriate
- Use `const` and `let` instead of `var`
- Use arrow functions for anonymous functions
- Follow consistent naming conventions (camelCase for variables/functions, PascalCase for classes)
- Add JSDoc comments for functions and complex logic
- Use meaningful variable and function names

### HTML/EJS Templates

- Use semantic HTML elements
- Follow consistent indentation (2 spaces)
- Use EJS partials for reusable components
- Keep templates clean and readable

### CSS

- Use consistent naming conventions (BEM methodology preferred)
- Organize styles logically
- Use CSS custom properties (variables) for colors and common values
- Ensure responsive design principles

### Database/Models

- Follow Mongoose schema best practices
- Add validation to model fields
- Use meaningful field names
- Add indexes for frequently queried fields

## Pull Request Process

1. **Create a Branch**: Create a new branch from `main` for your changes

2. **Make Changes**: Implement your feature or fix

3. **Test Thoroughly**:
   - Test your changes locally
   - Ensure no existing functionality is broken
   - Add tests if applicable

4. **Update Documentation**: Update README.md or other docs if needed

5. **Commit Changes**: Follow the commit message guidelines

6. **Push to Your Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**:
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select the correct base branch (`main`)
   - Provide a clear title and description
   - Reference any related issues
   - Add screenshots if applicable

8. **Review Process**:
   - Maintainers will review your PR
   - Address any feedback or requested changes
   - Once approved, your PR will be merged

### PR Template

When creating a pull request, please include:

- **Description**: What changes does this PR introduce?
- **Type of Change**: Bug fix, feature, documentation, etc.
- **Testing**: How have you tested these changes?
- **Screenshots**: If applicable, add screenshots of the changes
- **Checklist**: Ensure all items are checked

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Step-by-step instructions to reproduce the bug
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Browser, OS, Node.js version, etc.
- **Screenshots**: If applicable
- **Additional Context**: Any other relevant information

### Feature Requests

For feature requests, please include:

- **Description**: Clear description of the proposed feature
- **Use Case**: Why is this feature needed?
- **Implementation Ideas**: Any thoughts on how to implement it
- **Mockups**: If applicable, include mockups or wireframes

## Community Guidelines

- Be respectful and inclusive
- Help newcomers and other contributors
- Follow our [Code of Conduct](CODE_OF_CONDUCT.md)
- Participate in discussions constructively
- Give credit where credit is due

## Recognition

Contributors will be recognized in several ways:

- Listed in the project's contributors section
- Mentioned in release notes
- GSSoC leaderboard recognition
- Special contributor badges

## Getting Help

If you need help or have questions:

- Check the [README.md](README.md) for setup instructions
- Search existing issues and discussions
- Ask questions in GitHub Discussions
- Contact the maintainers

## License

By contributing to WanderLust, you agree that your contributions will be licensed under the same license as the project (MIT License). See [LICENSE](LICENSE) for details.

---

Thank you for contributing to WanderLust! Your efforts help make travel experiences more accessible and enjoyable for everyone. Happy coding! 🚀

<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=18&duration=3000&pause=1000&color=00C853&center=true&vCenter=true&width=600&lines=Thanks+for+contributing!+🙌;Your+efforts+make+a+difference+🌍;Happy+Coding+✨!" alt="Thanks Banner" />
</div>
