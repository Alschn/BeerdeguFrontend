import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	testEnvironment: 'jest-environment-jsdom',
	// tests path:
	testMatch: [
		'<rootDir>/__tests__/jest/**/*.(spec|test).[tj]s?(x)'
	],
	collectCoverageFrom: [
		'<rootDir>/src/**/*.{js,jsx,ts,tsx}',
		'!<rootDir>/src/**/*.d.ts',
		'!<rootDir>/src/app/**/*',
	]
};

export default createJestConfig(config);
