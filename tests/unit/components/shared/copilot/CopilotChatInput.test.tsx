import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CopilotChatInput } from '@/app/components/shared/copilot/CopilotChatInput';
import '@testing-library/jest-dom/vitest';

describe('CopilotChatInput', () => {
  it('renders correctly and handles input', () => {
    const onSend = vi.fn();
    const onStop = vi.fn();
    render(<CopilotChatInput onSend={onSend} onStop={onStop} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('Ask Copilot...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(input).toHaveValue('Hello');
    
    const button = screen.getByText('Send');
    fireEvent.click(button);
    expect(onSend).toHaveBeenCalledWith('Hello');
  });

  it('handles stop generating', () => {
    const onSend = vi.fn();
    const onStop = vi.fn();
    render(<CopilotChatInput onSend={onSend} onStop={onStop} isLoading={true} />);
    
    const stopButton = screen.getByText('Stop');
    fireEvent.click(stopButton);
    expect(onStop).toHaveBeenCalled();
  });

  it('handles enter key press', () => {
    const onSend = vi.fn();
    const onStop = vi.fn();
    render(<CopilotChatInput onSend={onSend} onStop={onStop} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('Ask Copilot...');
    fireEvent.change(input, { target: { value: 'Enter test' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(onSend).toHaveBeenCalledWith('Enter test');
  });
  
  it('does nothing on other key press', () => {
    const onSend = vi.fn();
    const onStop = vi.fn();
    render(<CopilotChatInput onSend={onSend} onStop={onStop} isLoading={false} />);
    
    const input = screen.getByPlaceholderText('Ask Copilot...');
    fireEvent.change(input, { target: { value: 'Enter test' } });
    fireEvent.keyDown(input, { key: 'A', code: 'KeyA' });
    expect(onSend).not.toHaveBeenCalled();
  });
});