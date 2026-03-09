import nextJest from 'next/jest';

const createJestConfig = nextJest({ dir: './apps/client' });

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default createJestConfig(customJestConfig);
