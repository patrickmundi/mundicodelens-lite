export function getRoleEngineeringRules(detectedRole?: string): string {
  switch (detectedRole) {
    case "django-model":
      return `
MODEL ENGINEERING RULES:

- Prioritize ORM safety
- Preserve migration integrity
- Avoid breaking relationships
- Consider database indexing
- Consider query efficiency
- Respect model validation rules
- Watch for N+1 query risks
`;

    case "django-view":
      return `
VIEW ENGINEERING RULES:

- Preserve request/response flow
- Respect authentication boundaries
- Respect authorization logic
- Avoid insecure data exposure
- Consider API response consistency
- Watch for performance bottlenecks
`;

    case "template":
      return `
TEMPLATE ENGINEERING RULES:

- Prioritize semantic HTML
- Preserve accessibility
- Respect template inheritance
- Respect translation/i18n logic
- Avoid duplicated markup
- Watch render performance
`;

    case "style-layer":
      return `
CSS ENGINEERING RULES:

- Preserve responsive behavior
- Avoid excessive specificity
- Prefer maintainable selectors
- Avoid layout-breaking changes
- Consider scalability of styles
`;

    case "react-component":
      return `
REACT ENGINEERING RULES:

- Preserve component state flow
- Avoid unnecessary re-renders
- Respect React lifecycle logic
- Preserve prop integrity
- Consider component scalability
`;

    case "utility-module":
      return `
UTILITY ENGINEERING RULES:

- Preserve deterministic behavior
- Avoid hidden side effects
- Prioritize readability
- Maintain reusability
- Watch edge cases carefully
`;

    default:
      return "";
  }
}
