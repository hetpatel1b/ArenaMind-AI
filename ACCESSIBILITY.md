# ArenaMind Accessibility Standards (WCAG 2.1 AA)

ArenaMind strictly enforces WCAG 2.1 AA compliance across the entire enterprise platform.

## Accessibility Architecture

All accessibility logic is centralized in `src/lib/accessibility/` to prevent duplication.

- **Focus Management**: Handled exclusively via `<FocusTrap>` (`focus.tsx`).
- **Keyboard Navigation**: Centralized helpers (`isArrowKey`, `isEnterSpace`, `isHomeEnd`) in `keyboard.ts`.
- **Dynamic IDs**: Handled by `useAccessibleId()` for SSR-safe ARIA linking.
- **Live Regions**: Screen reader announcements use `useAnnouncement()` (`announcements.tsx`).

## Keyboard Matrix

| Interaction            | Key(s)                | Expected Behavior                        |
| :--------------------- | :-------------------- | :--------------------------------------- |
| **Combobox / Listbox** | `ArrowUp`/`ArrowDown` | Navigate adjacent options                |
| **Combobox / Listbox** | `Home`/`End`          | Navigate to first/last options           |
| **Combobox / Listbox** | `Enter`/`Space`       | Select current option                    |
| **Modals / Dialogs**   | `Tab`/`Shift+Tab`     | Cycle focus within the modal (FocusTrap) |
| **Modals / Dialogs**   | `Escape`              | Close the modal and restore focus        |
| **Data Grid**          | `Tab`/`Enter`         | Navigate rows and activate selection     |

## Screen Reader Matrix

| Component     | ARIA Roles         | Required Attributes                                        |
| :------------ | :----------------- | :--------------------------------------------------------- |
| **Dialog**    | `role="dialog"`    | `aria-modal="true"`, `aria-labelledby`, `aria-describedby` |
| **Combobox**  | `role="combobox"`  | `aria-expanded`, `aria-controls`, `aria-activedescendant`  |
| **Data Grid** | `<table>` / `<th>` | `<caption>`, `scope="col"`, `scope="row"`                  |
| **Forms**     | `<input>`          | `aria-invalid`, `aria-describedby` (linking to error IDs)  |

## Future Component Checklist

When building new interactive components, engineers MUST verify:

- [ ] No duplicated keyboard/focus logic (use `src/lib/accessibility`).
- [ ] `*:focus-visible` ring is never overridden to `none`.
- [ ] Minimum touch targets of `44x44px` on mobile are maintained.
- [ ] Motion/animations respect `prefers-reduced-motion` (via `MotionConfig`).
- [ ] `eslint-plugin-jsx-a11y` passes locally with `0 warnings`.
