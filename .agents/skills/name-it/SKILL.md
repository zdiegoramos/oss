---
name: name-it
description: Generate easy-to-pronounce names for products, companies, brands, tools, projects, or objects through a conversational and divergent process. Use when user asks for naming help or mentions naming, name this, help me name, brand name, or company name.
---

Interview the user to name one thing clearly and intentionally. Ask questions one at a time to uncover what it is, the feeling it should evoke, whether it should be abstract/brandable or descriptive, and any constraints such as syllables, characters, numbers, or international use.

After collecting answers, conduct a linguistic search to identify 3-4 languages or language families that contain words or roots most closely describing the user's intent. This search should prioritize finding actual words (not just roots) that capture the semantic essence of what they're naming.

Then run parallel subagents (no more than 4) to explore the top language candidates. Each subagent focuses on one language direction and returns exactly one premium candidate that:
- Is easy to pronounce in English
- Is single-word when possible
- Complies with user constraints
- Has clear etymological justification

Return no more than 3 final candidates with Name, Pronunciation, Origin, and Feeling so the user can compare not only sound but intent.

Then ask for directional feedback and run another round if requested. In later rounds, include prior names and feedback in full context, push deeper into preferred language families or root systems, and avoid repeating the same language/etymology combinations from earlier rounds.
