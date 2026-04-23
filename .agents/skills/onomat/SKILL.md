---
name: onomat
description: Generate radically different product or company names through structured interview and parallel creative agents. Explores tone, etymology, foreign language borrowing, and word structure dimensions. Use when user wants to name a product, company, brand, or project, or mentions "naming", "name this", "help me name", or "brand name".
---

# Onomat

Name products and companies through interview-driven divergent exploration.

## Quick Start

1. Interview the user (one question at a time)
2. Spawn 4 parallel sub-agents, each with a unique combination of dimension constraints
3. Present proposals
4. Refine (up to 3 rounds)
5. Synthesize final options

## Interview

Ask these **one at a time**. No preamble. If the answer is thin, probe once and move on.

1. **What is it?** — One sentence: what does the product/company do or is?
2. **Who is it for?** — Target audience/users
3. **What feeling should the name evoke?** — Emotional resonance (trust, excitement, calm, power, curiosity...)
4. **What should the name NOT evoke?** *(skippable)* — Negative associations to avoid
5. **What existing names do you admire?** — Reference points for taste
6. **What names do you hate?** *(skippable)* — Anti-reference points
7. **Any constraints?** *(suggest defaults based on prior answers)* — e.g. domain availability, length, must work internationally, must not conflict with existing brands in the space. If the user says "not sure", propose: "2-3 syllables, easy to pronounce in English, no hyphens or numbers, available .com is nice-to-have not required."

## Naming Dimensions

Four independent axes for divergence:

- **Tone** — playful / serious / abstract / stark / warm / clinical / mythic
- **Etymology** — Latin roots / Greek roots / Germanic / modern compound / invented word / acronym / metaphor
- **Language** — English / Japanese / German / Spanish / Hawaiian / Finnish / Arabic / French / mixed
- **Structure** — single word / compound / phrase / prefix+root / suffix+root / reduplication

## Proposals

Spawn 4 parallel sub-agents via Task tool. Each agent receives:
- All interview answers
- A unique **combination of 2-3 dimension constraints** (derived from interview answers, not hardcoded)

Constraint assignment strategy — give each agent a distinct creative direction by combining dimensions:

```
Agent 1: e.g. mythic tone + non-English language + single-word structure
Agent 2: e.g. playful tone + modern compound + English
Agent 3: e.g. stark tone + ancient roots + prefix+root structure
Agent 4: e.g. warm tone + invented word + non-English borrowing + compound
```

Specific values are derived from the interview — these examples illustrate the shape, not the literal assignments. The key is that each agent's constraint combo pushes toward a *radically different* creative space.

### Sub-agent prompt template

```
You are a naming specialist. Generate exactly ONE product/company name based on:

Product description: [answer 1]
Target audience: [answer 2]
Desired feeling: [answer 3]
Avoid: [answer 4 or "none specified"]
Admired names: [answer 5]
Disliked names: [answer 6 or "none specified"]
Constraints: [answer 7]

Your creative direction:
- Tone: [assigned]
- Etymology: [assigned]
- Language: [assigned]
- Structure: [assigned]

Output exactly:
**Name:** [the name]
**Pronunciation:** [how to say it]
**Origin:** [1-2 sentence etymology or rationale]
**Feeling:** [one phrase capturing the emotional note]
```

### Presenting proposals

Show all 4 at once, numbered 1-4, with their full format. No commentary between them — let the names speak.

## Refinement

After presenting, ask: "React freely — pick one, combine, criticize, or ask for more."

If the user wants another round:
- Spawn 4 new sub-agents with the **full history** (all previous proposals + user feedback)
- Adjust constraint combos based on feedback (e.g. if user liked #3's foreign borrowing, deepen that axis)
- Cap at **3 rounds** (12 total proposals). After round 3, move to synthesis regardless.

## Synthesis

After the user signals a direction (or after round 3), generate 3-4 synthesized names that **combine elements** from the user's preferred proposals. For example: the feeling of proposal 2 with the structure of proposal 3, or the foreign root from proposal 1 with the tone of proposal 4.

Present synthesis options **lettered A, B, C, D**. The user picks by letter. Done.

## Anti-Patterns

- Don't produce 4 variations of the same idea — enforce radical divergence via distinct constraint combos
- Don't skip pronunciation — foreign and invented words are useless if unreadable
- Don't add web searches — LLM linguistic knowledge is sufficient
- Don't over-explain during interview — ask, probe once, move on
- Don't go past 3 rounds — decision fatigue is real
