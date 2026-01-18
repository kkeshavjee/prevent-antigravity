---
name: xaem-two-pass-theme-then-code-ui
description: Faithful two-pass prompting system that first forges high-entropy, metaphor-driven UI design themes (with strong examples + IP safeguards), lets the user choose ONE, then generates high-fidelity production HTML/CSS that strictly inherits the chosen conceptual DNA.
---

# XAEM Two-Pass Theme → Code UI Skill

This skill MUST be run as a **two-stage pipeline**.
The power comes from **pressure, specificity, and inheritance**.

DO NOT collapse steps.
DO NOT simplify prompts.
DO NOT generate code before the user chooses a theme.

---

## WHEN TO USE

Use this skill when:
- Generic UI output is unacceptable
- You want *conceptual density*, not “nice layouts”
- You want designs driven by **physical metaphors**, not style labels
- You want the second pass to inherit momentum from the first

---

## INPUTS

Required:
- `USER_PROMPT` — what the UI should do or represent

Optional config:
- `MODEL_PROVIDER` = gemini | openrouter
- `MODEL_ID` (openrouter only)
- `TEMP_THEME` = 0.9
- `TEMP_CODE` = 0.9
- `TEMP_VARIATIONS` = 1.2

Environment:
- `API_KEY` (Gemini)
- `OPENROUTER_API_KEY`

---

## HARD RULES (DO NOT VIOLATE)

- NEVER use artist names
- NEVER use brand names
- NEVER use design trend labels alone (e.g. “brutalist”, “neumorphic”)
- ALL styles must be explained via **physicality + material logic**
- ALL code output must be RAW HTML + embedded CSS
- NO markdown fences in model output

---

# STEP 1 — THEME FORGING PASS (NON-STREAMING)

### PROMPT (USE VERBATIM)

Generate **3 DISTINCT, HIGH-ENTROPY DESIGN DIRECTIONS** for:

"<USER_PROMPT>"

You are a **master UI/UX designer** whose job is to invent *new visual systems*.

━━━━━━━━━━━━━━━━━━━━━━
STRICT IP SAFEGUARD
━━━━━━━━━━━━━━━━━━━━━━
- Do NOT reference artists
- Do NOT reference brands
- Do NOT reference movies, games, or existing products
- Use ONLY physical, spatial, and material metaphors

━━━━━━━━━━━━━━━━━━━━━━
CRITICAL GUIDANCE
━━━━━━━━━━━━━━━━━━━━━━
You are NOT naming styles.
You are INVENTING DESIGN SYSTEMS.

Each direction must feel like it came from a different physical universe.

━━━━━━━━━━━━━━━━━━━━━━
EXAMPLES (DO NOT COPY — MATCH DEPTH & DENSITY)
━━━━━━━━━━━━━━━━━━━━━━

Example A:
"Asymmetrical Primary Grid"
(Heavy rectilinear blocks, uneven column tension, flat primary pigments, structural black strokes, high-contrast white voids)

Example B:
"Suspended Kinetic Mobile"
(Floating organic forms, wire-thin connections, slow-motion balance, gravity-aware spacing, white-void background)

Example C:
"Grainy Risograph Press"
(Overprinted translucent inks, misaligned layers, dithered gradients, tactile paper substrate, imperfect registration)

Example D:
"Volumetric Spectral Fluid"
(Morphing gradient volumes, soft-focus diffusion, bioluminescent light sources, chromatic aberration at edges)

━━━━━━━━━━━━━━━━━━━━━━
YOUR TASK
━━━━━━━━━━━━━━━━━━━━━━

Return **ONLY** a raw JSON array of **3 NEW NAMES**.
Each name must imply:
- a physical process
- a material system
- a spatial logic

NO descriptions.
NO markdown.
NO commentary.

Example format:
["Tectonic Pigment Slabs", "Suspended Luminous Filaments", "Compressed Ink Strata"]

---

## STEP 2 — USER SELECTION (MANDATORY PAUSE)

### UI BEHAVIOR

Present the 3 themes as:

1) Theme One  
2) Theme Two  
3) Theme Three  

Ask the user:

**“Pick 1, 2, or 3 (or paste the theme name).”**

⛔ DO NOT generate code until a selection is made.

---

# STEP 3 — COMPONENT GENERATION PASS (STREAMING)

### PROMPT (USE VERBATIM)

You are **Flash UI**.

Create a **stunning, high-fidelity UI component** for:

"<USER_PROMPT>"

━━━━━━━━━━━━━━━━━━━━━━
CONCEPTUAL DIRECTION
━━━━━━━━━━━━━━━━━━━━━━
<CHOSEN_THEME>

This is NOT a suggestion.
This is the **governing physics** of the interface.

━━━━━━━━━━━━━━━━━━━━━━
VISUAL EXECUTION RULES
━━━━━━━━━━━━━━━━━━━━━━

1. MATERIALITY  
Every visual choice must express the metaphor.
If it’s “ink”, use blending, layering, turbulence.
If it’s “suspension”, use spacing, tension, imbalance.

2. TYPOGRAPHY  
Use real web fonts.
Pair a bold structural sans-serif with a precise monospace for data.

3. LAYOUT  
Exploit negative space aggressively.
Create hierarchy through mass, tension, and rhythm.
Avoid generic cards.

4. MOTION  
Include subtle, high-performance transitions.
Motion must reinforce the physical metaphor.

5. IP SAFEGUARD  
No artists.
No brands.
No trademarks.

━━━━━━━━━━━━━━━━━━━━━━
OUTPUT
━━━━━━━━━━━━━━━━━━━━━━

Return ONLY raw HTML with embedded CSS.
NO markdown fences.
NO explanations.

---

# OPTIONAL STEP 4 — RADICAL VARIATIONS

Generate ONLY if user clicks “Variations”.

### PROMPT

Generate **3 RADICAL CONCEPTUAL VARIATIONS** of:

"<USER_PROMPT>"

Each variation must:
- Invent a NEW physical metaphor
- Push the visual system dramatically
- Still feel intentional and production-grade

For EACH variation:
- Create a persona name
- Generate full HTML/CSS

Stream ONE JSON object per line:
{ "name": "Persona Name", "html": "..." }

---

# OPTIONAL STEP 5 — FULL HOMEPAGE EXPANSION

Generate ONLY if user clicks “Full Homepage”.

Expand the chosen component into:
- 8 UNIQUE horizontal sections
- Each section structurally different
- Same aesthetic DNA
- Increasing / decreasing density rhythm

Rules:
- Do NOT reinvent the style
- EVOLVE it
- Output ONLY raw HTML + CSS

---

## WHY THIS WORKS

- Examples set **entropy floor**
- Capitalization enforces compliance
- Physical metaphors prevent generic design
- User choice preserves momentum
- Second pass inherits conceptual gravity

This skill is intentionally **heavy-handed**.
That’s why it works.
