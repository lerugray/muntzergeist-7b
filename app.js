// MÜNTZERGEIST sermon player
// Loads full 8-sermon set from data/sermons.json.
// Falls back to 4 inline sermons if JSON unavailable (file:// / offline).
// Keyboard: ArrowLeft / ArrowRight to cycle.

(function () {
  'use strict';

  // ---- Inline fallback sermons (4 of 8) --------------------------------
  var INLINE_SERMONS = [
    {
      prompt: "Preach on the princes and the poor.",
      text: "I will teach you what condition they are in. They suffer such oppression that it cannot be described except by crying to God from suffering heart: ‘O Lord!’ For the good man does not know how much his soul suffers when he sees his brother oppressed and cruelly treated while he himself is required to pay taxes for the protection of tyranny, which does nothing but harm to the poor. The common man has lost all fear before his lord and oppressor, because he sees that his lord kills the innocent without mercy. If you kill a man of power or wealth — the whole community rises against you with great outcry. But if you kill a poor man who has done nothing wrong — the whole community is satisfied and praises God for your deed. This is the condition in which most Christians live today: They are oppressed by the powerful and flatter those who oppress them, out of a mixture of cowardice, stupidity, and false piety. This cannot last much longer."
    },
    {
      prompt: "Who are the Elect? And who are the godless?",
      text: "The Elect are those for whom Christ is not just a name but the very substance. They hear and embrace his word as living fire that burns through all pretense to destroy everything that would stand between them and their creator. The elect feel his presence in themselves in every fiber of their being — from the tips of their toes to the furthest reaches of their minds. And they know, beyond any doubt, that this experience is not merely a subjective feeling but an objective reality, confirmed by the entire history of the prophets and apostles. The elect walk in the path of Abraham, Isaac, Jacob, David, Elijah, Isaiah, Jeremiah, Ezekiel, Daniel, John the Baptist, Jesus Christ, and his apostles. To walk thus is to be in constant conflict with the godless — with those who seek to comfort themselves by telling themselves pleasant lies about God’s approval instead of facing him in his true nakedness as revealed through Christ."
    },
    {
      prompt: "What does the gospel truly demand?",
      text: "In truth, the poor should hear the poor. The scribes and lawyers will always preach the parables in such a way that the rich man does well enough from them without changing his ways at all — for they are men who have made peace with their masters. But when the voice of the poor man is heard, then the parable reveals itself as God’s word rather than as something produced by human cunning, and it penetrates to the deep places of the heart: this land has been given to you from your blood; those who live on its produce have stolen it; therefore they must give an account. The moment that one hears about theft in a sermon preached to thieves, then one knows immediately whether God’s word is being spoken or whether it is merely another effort at comfort and justification. The divine judgment must be proclaimed in all its harshness before the election can begin in earnest."
    },
    {
      prompt: "Preach on the sword.",
      text: "The sword belongs to no master but God himself, and he has given it to all people in order that they may use it against the godless oppressor who claims to be the lord over the oppressed. This is what the scripture says: ‘He who does not have a sword should sell his cloak and buy one.’ The sword is not for killing; it is for driving out the unrighteous from among those whom God has given into our care. It is not the tool of the tyrant, but the instrument of justice. When the people of God stand together in their suffering and begin to fight back against those who have wronged them — not with bloodlust but with the knowledge that they are acting on behalf of a higher power than any earthly authority can claim — then the sword is being used rightly. Let no man tell you otherwise: true Christian resistance always takes this form."
    }
  ];

  // ---- State -----------------------------------------------------------
  var sermons      = INLINE_SERMONS.slice();
  var current      = 0;
  var transitioning = false;

  // ---- DOM refs --------------------------------------------------------
  var promptEl  = document.getElementById('sermonPrompt');
  var textEl    = document.getElementById('sermonText');
  var counterEl = document.getElementById('sermonCounter');
  var prevBtn   = document.getElementById('prevBtn');
  var nextBtn   = document.getElementById('nextBtn');

  // ---- Helpers ---------------------------------------------------------
  function escapeHtml(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function updateCounter() {
    if (counterEl) {
      counterEl.textContent = (current + 1) + ' / ' + sermons.length;
    }
  }

  function showSermon(idx) {
    if (transitioning || !sermons.length) return;
    transitioning = true;

    if (textEl) textEl.classList.add('fading');

    setTimeout(function () {
      var s = sermons[idx];
      if (promptEl) promptEl.textContent = s.prompt;
      if (textEl) {
        textEl.innerHTML = escapeHtml(s.text) +
          '<span class="sermon-cursor" aria-hidden="true"></span>';
        textEl.classList.remove('fading');
      }
      updateCounter();
      transitioning = false;
    }, 240);
  }

  function goNext() {
    current = (current + 1) % sermons.length;
    showSermon(current);
  }

  function goPrev() {
    current = (current - 1 + sermons.length) % sermons.length;
    showSermon(current);
  }

  // ---- Event listeners -------------------------------------------------
  if (nextBtn) nextBtn.addEventListener('click', goNext);
  if (prevBtn) prevBtn.addEventListener('click', goPrev);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft')  goPrev();
  });

  // ---- Load full sermon set -------------------------------------------
  if (typeof fetch !== 'undefined') {
    fetch('./data/sermons.json')
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        if (Array.isArray(data) && data.length > 0) {
          sermons = data;
          // Re-render current sermon with (possibly different) set
          showSermon(current);
        }
      })
      .catch(function () {
        // Silently use inline fallback — offline / file:// is expected
      });
  }

  // ---- Init ------------------------------------------------------------
  updateCounter();

}());
