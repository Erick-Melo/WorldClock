import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Clock from '../Clock';

describe('Clock Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render clock with timezone', () => {
    render(<Clock timezone="America/New_York" />);
    
    const timezoneLabel = screen.getByText('America/New_York');
    expect(timezoneLabel).toBeInTheDocument();
  });

  it('should display digital time', () => {
    render(<Clock timezone="America/New_York" />);
    
    // Check if time is displayed in HH:MM:SS format
    const timeElements = screen.getAllByText(/\d{2}:\d{2}:\d{2}/);
    expect(timeElements.length).toBeGreaterThan(0);
  });

  it('should render remove button when isRemovable is true', () => {
    const mockRemove = vi.fn();
    render(
      <Clock 
        timezone="America/New_York" 
        onRemove={mockRemove}
        isRemovable={true}
      />
    );
    
    const removeButton = screen.getByText('Remover');
    expect(removeButton).toBeInTheDocument();
  });

  it('should not render remove button when isRemovable is false', () => {
    render(
      <Clock 
        timezone="America/New_York" 
        isRemovable={false}
      />
    );
    
    const removeButton = screen.queryByText('Remover');
    expect(removeButton).not.toBeInTheDocument();
  });

  it('should call onRemove when remove button is clicked', () => {
    const mockRemove = vi.fn();
    render(
      <Clock 
        timezone="America/New_York" 
        onRemove={mockRemove}
        isRemovable={true}
      />
    );
    
    const removeButton = screen.getByText('Remover');
    removeButton.click();
    
    expect(mockRemove).toHaveBeenCalledOnce();
  });

  it('should handle invalid timezone gracefully', () => {
    render(<Clock timezone="Invalid/Timezone" />);
    
    // Should render without crashing
    const timezoneLabels = screen.getAllByText('Invalid/Timezone');
    expect(timezoneLabels.length).toBeGreaterThan(0);
  });

  it('should render clock face elements', () => {
    const { container } = render(<Clock timezone="America/New_York" />);
    
    // Check for clock face div
    const clockFace = container.querySelector('.rounded-full.bg-white.shadow-md');
    expect(clockFace).toBeTruthy();
  });
});
