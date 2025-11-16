# WanderLust Test Suite

This directory contains comprehensive test cases for the WanderLust application.

## Test Structure

```
tests/
├── setup.js                      # Jest setup and configuration
├── auth.test.js                  # Authentication route tests
├── listings.test.js              # Listing route tests
├── reviews.test.js               # Review route tests
├── middleware.test.js            # Middleware tests
├── schema.test.js                # Joi schema validation tests
├── models/
│   ├── listing.test.js          # Listing model tests
│   ├── review.test.js           # Review model tests
│   └── user.test.js             # User model tests
└── utils/
    ├── ExpressError.test.js     # ExpressError utility tests
    └── wrapAsync.test.js        # wrapAsync utility tests
```

## Running Tests

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run unit tests only

```bash
npm run test:unit
```

### Run integration tests only

```bash
npm run test:integration
```

### Run tests with coverage

```bash
npm test -- --coverage
```

## Test Categories

### 1. Route Tests

- **auth.test.js**: Tests for signup, login, logout routes
- **listings.test.js**: Tests for listing CRUD operations
- **reviews.test.js**: Tests for review creation and deletion

### 2. Model Tests

- **listing.test.js**: Tests for Listing model validation
- **review.test.js**: Tests for Review model validation
- **user.test.js**: Tests for User model validation

### 3. Utility Tests

- **ExpressError.test.js**: Tests for custom error handling
- **wrapAsync.test.js**: Tests for async error wrapper

### 4. Middleware Tests

- **middleware.test.js**: Tests for error handling, session, flash messages, security headers

### 5. Schema Tests

- **schema.test.js**: Tests for Joi validation schemas

## Test Coverage

The test suite aims to cover:

- ✅ Authentication flows
- ✅ CRUD operations for listings and reviews
- ✅ Model validations
- ✅ Error handling
- ✅ Middleware functionality
- ✅ Schema validations
- ✅ Utility functions

## Environment Variables

Tests use `.env.test` file for configuration. Make sure to:

1. Copy `.env.test.example` to `.env.test`
2. Update with appropriate test database credentials
3. Never commit `.env.test` with real credentials

## Notes

- Tests use `supertest` for HTTP assertions
- Models are tested with validation mocks
- Database operations are mocked in unit tests
- Integration tests may require a test database connection

## Adding New Tests

When adding new features:

1. Create corresponding test file in appropriate directory
2. Follow existing test patterns
3. Ensure tests are independent and isolated
4. Update this README with new test descriptions

## Continuous Integration

Tests are automatically run on:

- Pull requests
- Push to main branch
- Before deployment

## Troubleshooting

### Port Already in Use

If you see `EADDRINUSE` error:

```bash
npx kill-port 8080
```

### Database Connection Issues

- Ensure MongoDB is running
- Check `.env.test` database URL
- Verify test database exists

### Test Timeout

Increase timeout in specific tests:

```javascript
jest.setTimeout(15000); // 15 seconds
```
