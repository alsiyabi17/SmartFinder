import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../Footer';

afterEach(() => {
  cleanup();
});

describe('Footer', () => {
  it('should render the footer with SmartFinder text', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByText('SmartFinder')).toBeDefined();
  });

  it('should render the copyright text', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByText('© 2025 SmartFinder. All rights reserved.')).toBeDefined();
  });
});
