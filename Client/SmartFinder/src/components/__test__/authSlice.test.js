import { describe, it, expect } from 'vitest';
import reducer from '../../features/authSlice';

const test_state = {
  isLoggedIn: false,
  user: null,
  loading: false,
  error: null,
};

describe('authSlice', () => {
  it('testing initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(test_state);
  });
});
