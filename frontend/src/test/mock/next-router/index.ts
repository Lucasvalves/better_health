export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn()
}

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter
}))
