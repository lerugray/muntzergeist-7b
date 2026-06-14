---
license: cc-by-nc-4.0
base_model: Qwen/Qwen2.5-7B-Instruct
tags:
  - text-generation
  - historical
  - register-transfer
  - reformation
language:
  - en
---

# muntzergeist: a Thomas Müntzer register model

A 7B voice tune that writes in the register of **Thomas Müntzer** (c. 1489–1525),
the radical Reformation preacher and theologian of the German Peasants' War. It
reproduces his documented prophetic, apocalyptic, covenant-haunted cadence.

Most "talk to a historical figure" tools wrap a general model in a prompt. Those
import modern concepts and smooth the figure into something gentler than the record.
This model was fine-tuned on Müntzer's own words, so it learned the voice instead of
guessing at it.

## What it does

Ask it anything and it answers from inside Müntzer's worldview: the godless mighty,
the false scribes, the poor commons, the covenant, *omnia sunt communia*, the
harvest, the living word against the dead letter. Ask it about the present and it
stays in character. It translates the modern subject into his 16th-century moral
frame. A landlord becomes a usurer. A streaming platform becomes the sweat of the
working people turned sweet in the mouths of those who hold the scales.

## How it was built

- **Base:** Qwen2.5-7B-Instruct, full fine-tune.
- **Format:** completion (raw text), so the voice comes from the source register
  rather than from instruction scaffolding.
- **Corpus tiers:** his own letters, sermons, and manifestos (the dominant tier);
  quotation-filtered biography (his voice as historians preserved it); and a small
  modern-bridge layer capped near 8%, which applies his documented principles to
  modern subjects in his own vocabulary. The bridge never adds a stance, fact, or
  modern opinion the sources do not contain.

## Intended use

Research, teaching, and creative work: historical-voice writing, the rhetoric of the
radical Reformation, interactive history, fiction. The output is a historical and
artistic register. It is not an endorsement, a call to action, or advice.

## Limitations and honest notes

- **It is a register, not a scholar.** It sounds authoritative while inventing
  specifics. Verify anything factual against real sources.
- **The modern-bridge is interpretation.** It extends his recorded principles to
  things he never knew. That mapping is a creative act, not a claim about what he
  "would" have said.
- **Period worldview.** It speaks from a 16th-century apocalyptic framework,
  absolutism included. That is the artifact, not a recommendation.
- **Copyright and training data.** The voice was learned from primary-source
  translations and historical scholarship. A verbatim-regurgitation test on the
  released model found no memorized passages: the longest verbatim overlap with the
  training text was 6 words, with 0% eight-word overlap. The model writes new text in
  the register rather than reproducing source passages. The training corpus text is
  not distributed. Released non-commercially under CC-BY-NC-4.0 given the scholarly
  sources behind it.

## License

CC-BY-NC-4.0. Non-commercial research, educational, and creative use. Attribution
appreciated. No warranty.
