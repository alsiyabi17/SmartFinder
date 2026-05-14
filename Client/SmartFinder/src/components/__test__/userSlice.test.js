import { describe, it, expect } from 'vitest';
import reducer from '../../features/userSlice';

const test_state = {
  profile: null,
  loading: false,
  message: null,
  error: null,
};

describe('userSlice', () => {
  it('testing initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(test_state);
  });
});
