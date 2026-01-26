# Concept Note: Privacy by Design (PbD) in Antigravity

Antigravity is built on the **7 Principles of Privacy by Design**, ensuring that patient trust is earned through structural, architectural, and operational excellence in privacy protection.

## 1. Proactive not Reactive; Preventive not Remedial
We don't wait for a data breach to act. Our architecture—specifically the **Pseudonymity Strata**—prevents the ingestion of Personally Identifiable Information (PII) like Real Names, Health Card Numbers, or Contact Info into the AI processing layer. We anticipate privacy risks and design them out.

## 2. Privacy as the Default Setting
A user shouldn't have to "opt-in" to privacy. By default, every interaction with Dawn is end-to-end encrypted, and data stored in the persistent layer is minimized to only what's necessary for clinical intervention.

## 3. Privacy Embedded into Design
Privacy is not an "add-on" or a checkbox. It is integrated into the source code of our **Orchestrator**. Our data models are designed to separate clinical biomarkers from user identities, ensuring that even in a system-wide log review, individual patients remain anonymous.

## 4. Full Functionality — Positive-Sum, not Zero-Sum
We reject the idea that you have to trade privacy for a good AI experience. Our "Prismatic" UI and Agentic Chat provide a premium, highly personalized experience *without* requiring the user's real-world identity.

## 5. End-to-End Security — Full Lifecycle Protection
From the moment a physician identifies an at-risk patient (EMR) to the long-term maintenance phase (App), data is protected. Our use of **PREVENT_ID** ensure that the data lifecycle is secure from inception to deletion.

## 6. Visibility and Transparency — Keep it Open
Our agents are required (via DSPy Signatures) to be transparent about their nature: "I am an AI coach, processing your data to provide guidance." Every response is auditable via **"The Receipt"** (Audit Trail).

## 7. Respect for User Privacy — Keep it User-Centric
We empower the user through the **"The Fix Button"**. Users have control over their data strata; they can correct biomarkers, recalibrate their psychological readiness, and understand exactly how their inputs drive the system's logic.

---

### Implementation in Antigravity:
- **No PII Ingestion:** The backend data loader (`DataLoader`) skips PII columns from the clinical dataset.
- **Nickname Strategy:** Users only ever provide cross-session "Nicknames" to Dawn.
- **Minimization:** Only clinical variables necessary for the current "Stage of Change" are loaded into the LLM context.
