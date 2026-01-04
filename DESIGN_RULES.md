# UI Design Rules & Enforcement

This UI MUST be rendered using explicit visual components.

## Hard Rules (Must be Enforced)
- **No raw text blocks allowed anywhere**
- **Every section must be wrapped in a card or container**
- **Cards must have padding, background, and border radius**
- **Vertical spacing between sections is mandatory**

## Layout Enforcement
- **Use a single-column mobile layout**
- **No section may touch screen edges**
- **Each card must visually separate from others**
- **Do NOT stack text without containers**

## Bottom Navigation Enforcement
- **Must be a fixed bottom navigation bar**
- **Icons + labels only**
- **Text-only navigation is forbidden**
- **Navigation must respect safe areas**

## Typography Enforcement
- **Headings must be visually larger than body text**
- **Descriptions must use reduced opacity**
- **Labels must be the smallest and lightest**

> **If any of these rules are violated, the UI must be re-rendered until compliant.**
