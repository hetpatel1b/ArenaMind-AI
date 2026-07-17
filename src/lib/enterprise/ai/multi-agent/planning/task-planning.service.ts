export type AgentId =
  | 'crowd'
  | 'incident'
  | 'mobility'
  | 'camera'
  | 'workforce'
  | 'infrastructure'
  | 'governance'
  | 'weather'
  | 'security'
  | 'executive';

export interface TaskPlan {
  primaryAgent: AgentId;
  supportingAgents: AgentId[];
  subtasks: string[];
}

export class TaskPlanningService {
  /**
   * Evaluates the user's prompt and current context to determine which agents
   * must be woken up to handle the request.
   * In a real implementation, this could use a fast, small LLM (like Claude Haiku)
   * to classify and route the request. For now, we use a programmatic heuristic.
   */
  planExecution(userPrompt: string, featureName: string): TaskPlan {
    const p = userPrompt.toLowerCase();
    const plan: TaskPlan = {
      primaryAgent: 'executive',
      supportingAgents: [],
      subtasks: [],
    };

    // Determine primary agent based on feature
    if (featureName.includes('incident')) plan.primaryAgent = 'incident';
    if (featureName.includes('workforce')) plan.primaryAgent = 'workforce';
    if (featureName.includes('mobility')) plan.primaryAgent = 'mobility';

    // Determine supporting agents based on natural language heuristic
    if (p.includes('crowd') || p.includes('density') || p.includes('crush')) {
      plan.supportingAgents.push('crowd');
      plan.subtasks.push('Analyze crowd density metrics and egress routes.');
    }
    if (p.includes('traffic') || p.includes('transit') || p.includes('train')) {
      plan.supportingAgents.push('mobility');
      plan.subtasks.push('Evaluate external transit conditions.');
    }
    if (p.includes('power') || p.includes('network') || p.includes('offline')) {
      plan.supportingAgents.push('infrastructure');
      plan.subtasks.push('Check infrastructure health and backup systems.');
    }
    if (p.includes('fight') || p.includes('unauthorized') || p.includes('weapon')) {
      plan.supportingAgents.push('security');
      plan.subtasks.push('Assess security threat level and camera feeds.');
    }

    // Ensure uniqueness
    plan.supportingAgents = Array.from(new Set(plan.supportingAgents));
    // Remove primary agent from supporting list if present
    plan.supportingAgents = plan.supportingAgents.filter((a) => a !== plan.primaryAgent);

    return plan;
  }
}

export const aiTaskPlanningService = new TaskPlanningService();
