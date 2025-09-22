// Test setup file for common configurations

// Set test environment variables
process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';
process.env.PORT = 5001;

// Mock console methods to reduce test output noise
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn()
};

// Setup test database connection mock
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(true),
  connection: {
    on: jest.fn(),
    once: jest.fn()
  },
  Schema: jest.fn().mockImplementation(function(schema) {
    this.schema = schema;
    this.methods = {};
    this.statics = {};
    this.virtual = jest.fn().mockReturnThis();
    this.pre = jest.fn().mockReturnThis();
    this.post = jest.fn().mockReturnThis();
  }),
  model: jest.fn().mockImplementation((name, schema) => {
    return jest.fn();
  })
}));

// Global test timeout
jest.setTimeout(10000);