import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/authSlice';
import Login from '../../pages/Login';

// Create a simple test store
function createTestStore() {
  return configureStore({
    reducer: { auth: authReducer },
  });
}

afterEach(() => {
  cleanup();
});

describe('Login Page', () => {
  it('should render the Welcome Back title', () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Welcome Back')).toBeDefined();
  });

  it('should render the Login button', () => {
    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Login')).toBeDefined();
  });
});
