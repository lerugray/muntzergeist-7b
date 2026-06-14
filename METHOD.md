# Method

How `muntzergeist` was built. The approach is a single-voice **register transfer**
fine-tune, distinct from the multi-character roleplay models common in the field.

## The conceit (Hybrid)

The model speaks in Thomas Müntzer's period voice by default, with a thin
modern-bridge layer that lets it answer about the present without breaking character.
The bridge applies his documented principles to modern subjects in his own vocabulary.
It never introduces a stance, fact, or opinion the sources do not contain. A purist
build that refused every modern question would be a novelty that wears thin in three
exchanges; an unconstrained build would invent modern opinions and dilute the voice.
The Hybrid is the middle: ship the authentic voice, add exactly enough bridge to honor
the reanimation conceit, no more.

## Corpus tiers

Register dominance is enforced by tier weighting, not by raw word count. Biography is
voluminous and third-person; the figure's own first-person writing is scarcer. Without
floors, the biographer's voice would drown the figure's. The floors prevent that.

| Tier | Share | Source | Purpose |
|------|-------|--------|---------|
| T1 | ≥55% (oversampled) | His own letters, sermons, manifestos | The authentic register |
| T2 | ~30% | Quotation-filtered biography | Extends the thin primary pool with his quoted voice |
| T3 | ≤8–10% (capped) | Synthetic modern-bridge | Teaches one move: map a modern subject onto his principles |

## Format

Completion (`{"text": "<raw chunk>"}`), not instruction tuning. Training the voice
directly from raw source text avoids a prompt scaffold injecting a foreign register.
The base is Qwen2.5-7B-Instruct, full fine-tune.

## The modern-bridge guardrail

Every T3 exemplar maps a documented principle onto a modern object. The drafting prompt
is constrained: use only the figure's sourced vocabulary, introduce no fact or stance
not derivable from the source, keep modern brand-names in the questioner's mouth and
the figure's reframing in his. Each exemplar is voice-passed by a human before training.

## Inference

The voice is elicited by a lead-in frame in the ollama `Modelfile` (see
`Modelfile.muntzergeist`). Plain chat suppresses the register; a name-cue lead-in makes
the model answer *as* the figure rather than narrate *about* him.

## Copyright due diligence

`scripts/leakage_test.py` checks the released weights for verbatim regurgitation of the
training text. The released model showed a 6-word maximum verbatim overlap and 0%
eight-word overlap: it generates new text in the register rather than reproducing source
passages. The training corpus text is not distributed.

## Reproducing on your own sources

The corpus text is private (built from copyrighted translations). To build your own:
extract a figure's primary writings (T1) and quote-filtered biography (T2), format as
completion records with the tier floors above, draft and human-review a capped T3
bridge, and train with the persona pipeline. `evals/prompts.jsonl` is the eval battery.
