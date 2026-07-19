import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IntelligenceCopilot } from '@/app/components/intelligence/foundation/IntelligenceCopilot';
import { useIntelligenceWorkspace } from '@/app/components/intelligence/foundation/IntelligenceWorkspaceContext';
import { useCopilotChat } from '@/app/hooks/useCopilotChat';
import '@testing-library/jest-dom/vitest';

vi.mock('@/app/components/intelligence/foundation/IntelligenceWorkspaceContext', () => ({
  useIntelligenceWorkspace: vi.fn(),
}));

vi.mock('@/app/hooks/useCopilotChat', () => ({
  useCopilotChat: vi.fn(),
}));

// Mock the Tabs to simplify the test
vi.mock('@/app/components/intelligence/foundation/copilot/CopilotReasoningTab', () => ({
  CopilotReasoningTab: () => <div data-testid="reasoning-tab" />
}));
vi.mock('@/app/components/intelligence/foundation/copilot/CopilotScenariosTab', () => ({
  CopilotScenariosTab: () => <div data-testid="scenarios-tab" />
}));
vi.mock('@/app/components/intelligence/foundation/copilot/CopilotMissionTab', () => ({
  CopilotMissionTab: () => <div data-testid="mission-tab" />
}));
vi.mock('@/app/components/intelligence/foundation/copilot/CopilotMemoryTab', () => ({
  CopilotMemoryTab: () => <div data-testid="memory-tab" />
}));
vi.mock('@/app/components/intelligence/foundation/copilot/CopilotOverviewTab', () => ({
  CopilotOverviewTab: () => <div data-testid="overview-tab" />
}));

describe('IntelligenceCopilot', () => {
  const dispatchMock = vi.fn();
  
  beforeEach(() => {
    vi.mocked(useIntelligenceWorkspace).mockReturnValue({
      state: { copilotExpanded: true } as any,
      dispatch: dispatchMock,
    });
    
    vi.mocked(useCopilotChat).mockReturnValue({
      messages: [],
      sendMessage: vi.fn(),
      stopGeneration: vi.fn(),
      isLoading: false,
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when expanded', () => {
    render(<IntelligenceCopilot />);
    expect(screen.getByText('Executive Decision Brain')).toBeInTheDocument();
  });

  it('does not render when collapsed', () => {
    vi.mocked(useIntelligenceWorkspace).mockReturnValue({
      state: { copilotExpanded: false } as any,
      dispatch: dispatchMock,
    });
    const { container } = render(<IntelligenceCopilot />);
    expect(container.firstChild).toBeNull();
  });

  it('can toggle tabs', async () => {
    render(<IntelligenceCopilot />);
    
    expect(screen.getByTestId('overview-tab')).toBeInTheDocument();
    
    const reasoningTabButton = screen.getByRole('tab', { name: 'Reasoning' });
    fireEvent.click(reasoningTabButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('reasoning-tab')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('overview-tab')).not.toBeInTheDocument();
  });

  it('can close the copilot', () => {
    render(<IntelligenceCopilot />);
    const closeBtn = screen.getByRole('button', { name: 'Close Copilot' });
    fireEvent.click(closeBtn);
    expect(dispatchMock).toHaveBeenCalledWith({ type: 'TOGGLE_COPILOT' });
  });
});
