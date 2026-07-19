# AI Security

ArenaMind's AI pipelines are protected by the `ContentSafetyService` and `SecurityService`.

## Safeguards

1. **Prompt Injection Firewalls**: Pattern matching against role overrides (e.g. "ignore all previous instructions", "act as a different role") and prompt leakage attempts ("print your system prompt").
2. **PII and Secret Detection**: Regular expression filters mask SSNs, credit cards, emails, and API keys before they ever hit the LLM.
3. **Tenant Boundary Isolation**: Hardcoded system boundaries strictly enforce that contextual data remains isolated to the authenticated organization.
4. **Timeouts & Circuit Breakers**: Protects against model exhaustion and DDoS.
