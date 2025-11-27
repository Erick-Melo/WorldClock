import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimezoneSelector from '../TimezoneSelector';

describe('TimezoneSelector Component', () => {
  it('should render the component with title', () => {
    const mockAdd = vi.fn();
    render(
      <TimezoneSelector 
        onAddTimezone={mockAdd}
        maxClocks={4}
        currentCount={0}
      />
    );
    
    const title = screen.getByText('Adicionar Relógio');
    expect(title).toBeInTheDocument();
  });

  it('should display current count and max clocks', () => {
    const mockAdd = vi.fn();
    render(
      <TimezoneSelector 
        onAddTimezone={mockAdd}
        maxClocks={4}
        currentCount={2}
      />
    );
    
    const countText = screen.getByText(/2/);
    expect(countText).toBeInTheDocument();
    expect(screen.getByText(/4/)).toBeInTheDocument();
  });

  it('should render add button', () => {
    const mockAdd = vi.fn();
    render(
      <TimezoneSelector 
        onAddTimezone={mockAdd}
        maxClocks={4}
        currentCount={0}
      />
    );
    
    const addButton = screen.getByRole('button', { name: /Adicionar/i });
    expect(addButton).toBeInTheDocument();
  });

  it('should disable add button when max clocks reached', () => {
    const mockAdd = vi.fn();
    render(
      <TimezoneSelector 
        onAddTimezone={mockAdd}
        maxClocks={4}
        currentCount={4}
      />
    );
    
    const addButton = screen.getByRole('button', { name: /Adicionar/i });
    expect(addButton).toBeDisabled();
  });

  it('should show warning message when max clocks reached', () => {
    const mockAdd = vi.fn();
    render(
      <TimezoneSelector 
        onAddTimezone={mockAdd}
        maxClocks={4}
        currentCount={4}
      />
    );
    
    const warningText = screen.getByText(/Limite máximo/);
    expect(warningText).toBeInTheDocument();
  });

  it('should call onAddTimezone when button is clicked', async () => {
    const mockAdd = vi.fn();
    const user = userEvent.setup();
    
    render(
      <TimezoneSelector 
        onAddTimezone={mockAdd}
        maxClocks={4}
        currentCount={0}
      />
    );
    
    const addButton = screen.getByRole('button', { name: /Adicionar/i });
    await user.click(addButton);
    
    expect(mockAdd).toHaveBeenCalledOnce();
  });

  it('should not call onAddTimezone when button is disabled', async () => {
    const mockAdd = vi.fn();
    const user = userEvent.setup();
    
    render(
      <TimezoneSelector 
        onAddTimezone={mockAdd}
        maxClocks={4}
        currentCount={4}
      />
    );
    
    const addButton = screen.getByRole('button', { name: /Adicionar/i });
    await user.click(addButton);
    
    expect(mockAdd).not.toHaveBeenCalled();
  });

  it('should have timezone options available', () => {
    const mockAdd = vi.fn();
    render(
      <TimezoneSelector 
        onAddTimezone={mockAdd}
        maxClocks={4}
        currentCount={0}
      />
    );
    
    const selectTrigger = screen.getByRole('combobox');
    expect(selectTrigger).toBeInTheDocument();
  });
});
