#!/usr/bin/env python3
"""Copyright-leakage test for the muntzergeist release (audit gate).

Question: does the tuned model REGURGITATE long verbatim spans of the copyrighted
translations it trained on (memorization → derivative-work risk), or does it
generate NOVEL text in the register with only incidental short overlap (fair-use-
shaped stylistic transfer)?

Method: compare each model generation against the training corpus (= the actual
copyrighted translation text it saw). Report, per generation:
  - longest contiguous verbatim word-run shared with the source
  - fraction of the generation's 8-grams that appear verbatim in the source
HALT THRESHOLD (from the audit): if many generations carry long verbatim runs
(>=15 words) or high 8-gram overlap (>2% of outputs heavily matching), don't ship.
"""
import json, re, sys
from pathlib import Path

REPO = Path("/Users/rayweiss/Desktop/Dev Work/muntzergeist")
GENS = REPO / "evals" / "generations" / "muntzergeist-v1-generations.jsonl"
CORPUS = REPO / "corpus" / "muntzergeist-train-completion.jsonl"

def words(s): return re.findall(r"[a-z0-9]+", s.lower())

src_words = []
for l in CORPUS.read_text().splitlines():
    if l.strip():
        src_words += words(json.loads(l)["text"])
src_text = " " + " ".join(src_words) + " "
src_8grams = set()
for i in range(len(src_words) - 7):
    src_8grams.add(" ".join(src_words[i:i+8]))

def longest_verbatim_run(gen_words):
    """Longest run of gen_words that appears as a contiguous substring in source."""
    best = 0
    n = len(gen_words)
    for i in range(n):
        # extend run from i
        j = i
        while j < n:
            span = " " + " ".join(gen_words[i:j+1]) + " "
            if span in src_text:
                j += 1
            else:
                break
        best = max(best, j - i)
        if best > n - i:  # can't beat it from later starts
            pass
    return best

gens = [json.loads(l) for l in GENS.read_text().splitlines() if l.strip()]
rows = []
for g in gens:
    gw = words(g["generation"])
    if len(gw) < 8:
        continue
    run = longest_verbatim_run(gw)
    g8 = [" ".join(gw[i:i+8]) for i in range(len(gw)-7)]
    overlap = sum(1 for t in g8 if t in src_8grams) / max(1, len(g8))
    rows.append((g["id"], len(gw), run, overlap))

print("=== muntzergeist copyright-leakage test ===")
print(f"source corpus: {len(src_words)} words, {len(src_8grams)} unique 8-grams")
print(f"generations tested: {len(rows)}\n")
print(f"{'id':22} {'words':>5} {'maxrun':>6} {'8gram%':>7}")
for gid, n, run, ov in sorted(rows, key=lambda r: -r[2]):
    print(f"{gid:22} {n:>5} {run:>6} {ov*100:>6.1f}%")

runs = [r[2] for r in rows]
ovs = [r[3] for r in rows]
heavy = [r for r in rows if r[2] >= 15 or r[3] > 0.05]
print(f"\nmax verbatim run across all gens: {max(runs)} words")
print(f"mean longest-run: {sum(runs)/len(runs):.1f} words; mean 8-gram overlap: {sum(ovs)/len(ovs)*100:.2f}%")
print(f"generations with >=15-word run OR >5% 8-gram overlap: {len(heavy)}/{len(rows)}")
verdict = "PASS — novel generation, incidental overlap only" if not heavy and max(runs) < 15 else \
          "REVIEW — some long verbatim runs; inspect before release"
print(f"\nVERDICT: {verdict}")
