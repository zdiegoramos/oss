---
name: onomat
description: Generate radically different product, company, brand, object, tool, or project names. Interview the user and launch parallel creative agents. Explores tone, etymology, foreign language borrowing, and word structure dimensions. Use when user wants to name a product, company, brand, object, tool, or project, or mentions "naming", "name this", "help me name", or "brand name".
---

Generate easy to pronounce names for a product, company, brand, object, tool, or project through conversation-driven divergent exploration. Interview the user to uncover their needs and preferences, then spawn parallel creative agents with distinct constraint combinations to generate radically different name proposals. Explore dimensions of tone, etymology, language, and structure to ensure a wide variety of options.

## Interview

Ask the questions one at a time.

**What to uncover**

- **What it is and does** — the thing itself, in plain terms
- **Who it's for** — audience, users, buyers
- **What feeling the name should evoke** — trust, excitement, calm, power, curiosity, precision.
- **Abstract/Brandable vs Descriptive** — should the name be more abstract and brandable, or descriptive of the product/service?
- **Constraints** — syllable count, special characters, numbers, must work internationally.

## Naming Dimensions

Four independent axes for divergence:

- **Tone** — playful / serious / abstract / stark / warm / clinical / mythic
- **Etymology** — Latin roots / Greek roots / Germanic / modern compound / invented word / acronym / metaphor
- **Language** — English / Japanese / German / Spanish / Hawaiian / Finnish / Arabic / French / mixed
- **Structure** — single word / compound / phrase / prefix+root / suffix+root / reduplication

## Proposals

Spawn 2 parallel sub-agents via Task tool. Each agent receives:
- All interview answers
- A unique **combination of 2-3 dimension constraints** (derived from interview answers, not hardcoded)

Constraint assignment strategy — give each agent a distinct creative direction by combining dimensions:

```
Agent 1: e.g. mythic tone + non-English language + single-word structure
Agent 2: e.g. playful tone + modern compound + English
```

Specific values are derived from the interview — these examples illustrate the shape, not the literal assignments. The key is that each agent's constraint combo pushes toward a *radically different* creative space.

### Sub-agent prompt template

```
You are a naming specialist. Generate exactly ONE name based on:

Context: [summarized interview findings]

Your creative direction:
- Tone: [assigned]
- Etymology: [assigned]
- Language: [assigned]
- Structure: [assigned]

Restrictions:
- Must be a single word, [<number>] syllables, easy to pronounce in English
- Must not include hyphens or numbers

Output exactly:
**Name:** [the name]
**Pronunciation:** [how to say it]
**Origin:** [1-2 sentence etymology or rationale]
**Feeling:** [one phrase capturing the emotional note]
```

## Refinement

After presenting, ask the user for feedback aiming to find the directions they like.

If the user wants another round:
- Spawn 2 new sub-agents with the **full history** (all previous proposals + user feedback)
- Adjust constraint combos based on feedback (e.g. if user liked #3's foreign borrowing, deepen that axis)
- Do not repeat the same combos — ensure new agents explore new creative spaces, not variations on the same theme
