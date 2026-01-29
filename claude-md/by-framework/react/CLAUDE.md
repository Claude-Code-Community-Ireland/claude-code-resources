# React Project Instructions

## Project Context

<!-- Describe your project here -->
This is a React application using [TypeScript/JavaScript] with [state management solution].

## Code Style

- Use functional components with hooks
- Prefer named exports over default exports
- Use TypeScript for type safety
- Follow React naming conventions:
  - Components: `PascalCase`
  - Hooks: `useCamelCase`
  - Utils: `camelCase`
  - Constants: `SCREAMING_SNAKE_CASE`

## Component Structure

```tsx
// imports
import { useState } from 'react';
import type { ComponentProps } from './types';

// types (if not in separate file)
interface Props {
  title: string;
  onAction: () => void;
}

// component
export function MyComponent({ title, onAction }: Props) {
  const [state, setState] = useState(false);

  // handlers
  const handleClick = () => {
    onAction();
  };

  // render
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>Action</button>
    </div>
  );
}
```

## File Structure

```
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.test.tsx
│       ├── Button.styles.ts
│       └── index.ts
├── hooks/
├── utils/
├── types/
└── pages/
```

## State Management

- Use React Query for server state
- Use Context or Zustand for global UI state
- Keep state as local as possible

## Testing

- Use React Testing Library
- Test behavior, not implementation
- Use `userEvent` over `fireEvent`

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('button calls onClick when clicked', async () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  await userEvent.click(screen.getByRole('button'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## Performance

- Use `React.memo` for expensive pure components
- Use `useMemo` and `useCallback` judiciously
- Lazy load routes and heavy components
- Avoid inline object/array creation in JSX

## Do NOT

- Use `any` type - find the correct type
- Mutate state directly
- Use index as key for dynamic lists
- Put business logic in components
- Create god components (>200 lines)
