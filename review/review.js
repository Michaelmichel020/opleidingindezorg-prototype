/* ============================================================
   review.js — temporary review tool for the clickable wireframe
   Builds the review blocks and stores feedback in Supabase so the
   whole project group sees each other's notes live.
   ============================================================ */

/* ===== CONFIG — fill in after creating the free Supabase project =====
   Both values are safe to commit: the anon key is public by design.
   Settings -> API in the Supabase dashboard.                          */
const SUPABASE_URL = 'https://rorljmcdwskbbmghmxnm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_z4f2ikVjfsMFVn_UbJxNUw_bMeTTnAV';
/* ===================================================================== */

const BASE = 'https://opleidingindezorg-klikbaar-wireframe.netlify.app';

const NAMEN = [
  'Riana Westra', 'Tineke Geerts', 'Wieteke de Roos - van Heun',
  'Carola Hartstra', 'Anneke Leijenhorst', 'Carola Huijer - van Beek',
  'Elise Oude Groote Beverborg', 'Rosario Selva Lopez', 'Marieke Kroon',
  'Melissa van Nieuwkoop', 'Ineke Kunst'
];

const SECTIES = [
  { key: 'home', titel: 'Home', paginas: [
    { naam: 'Homepage', url: '/' } ] },
  { key: 'werken-leren', titel: 'Werken & Leren', paginas: [
    { naam: 'Werken & Leren (overzicht)', url: '/werken-en-leren/' },
    { naam: 'BBL-niveau (voorbeeld: niveau 2)', url: '/werken-en-leren/niveau-2/' },
    { naam: 'Verschil BBL en BOL', url: '/werken-en-leren/bbl-vs-bol/' },
    { naam: 'Toelatingseisen', url: '/werken-en-leren/toelatingseisen/' },
    { naam: 'Salaris en vergoedingen', url: '/werken-en-leren/salaris/' },
    { naam: 'Veelgestelde vragen', url: '/werken-en-leren/faq/' } ] },
  { key: 'zorgorganisaties', titel: 'Zorgorganisaties', paginas: [
    { naam: 'Zorgorganisaties (overzicht)', url: '/zorgorganisaties/' },
    { naam: 'Organisatie-detailpagina (voorbeeld: Amstelring)', url: '/zorgorganisaties/amstelring/' } ] },
  { key: 'scholen', titel: 'Scholen', paginas: [
    { naam: 'Scholen (overzicht)', url: '/scholen/' },
    { naam: 'Hoe werkt het?', url: '/scholen/hoe-werkt-het/' },
    { naam: 'Open dagen', url: '/scholen/open-dagen/' } ] },
  { key: 'over-ons', titel: 'Over ons', paginas: [
    { naam: 'Over ons (overzicht)', url: '/over-ons/' },
    { naam: 'Waarom samenwerken?', url: '/over-ons/samenwerking/' },
    { naam: 'Deelnemende organisaties', url: '/over-ons/deelnemers/' },
    { naam: 'Contact', url: '/over-ons/contact/' } ] },
  { key: 'keuzehulp', titel: 'Keuzehulp', paginas: [
    { naam: 'Keuzehulp', url: '/keuzehulp/' } ] },
  { key: 'solliciteren', titel: 'Direct Solliciteren', paginas: [
    { naam: 'Solliciteren', url: '/solliciteren/' } ] }
];

var supabase = null;

/* ---------- Build the review blocks ---------- */
function buildBlocks() {
  var arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var nameOpts = '<option value="">Kies je naam...</option>' +
    NAMEN.map(function (n) { return '<option>' + n + '</option>'; }).join('') +
    '<option value="__anders">Anders...</option>';

  var html = SECTIES.map(function (s) {
    var links = s.paginas.map(function (p) {
      return '<li><a href="' + BASE + p.url + '" target="_blank" rel="noopener">' +
             p.naam + ' ' + arrow + '</a></li>';
    }).join('');
    var paginaOpts = '<option>Algemeen (hele onderdeel)</option>' +
      s.paginas.map(function (p) { return '<option>' + p.naam + '</option>'; }).join('');

    return '' +
      '<details class="blok" data-sectie="' + s.key + '">' +
        '<summary class="blok__sum"><span class="blok__titel">' + s.titel + '</span>' +
          '<span class="blok__count" aria-label="aantal feedbackpunten"></span></summary>' +
        '<div class="blok__body">' +
          '<div class="blok__paginas"><p class="blok__lbl">Paginas in dit onderdeel</p>' +
            '<ul>' + links + '</ul></div>' +
          '<form class="fb-form" novalidate>' +
            '<div class="fb-row">' +
              '<label>Je naam<select class="fb-naam" required>' + nameOpts + '</select></label>' +
              '<label>Over welke pagina?<select class="fb-pagina">' + paginaOpts + '</select></label>' +
            '</div>' +
            '<label class="fb-anders" hidden>Vul je naam in<input type="text" class="fb-naam-anders" maxlength="60"></label>' +
            '<label>Je feedback<textarea class="fb-bericht" rows="4" maxlength="1500" placeholder="Wat valt je op? Wat kan beter?"></textarea></label>' +
            '<div class="fb-submit">' +
              '<button type="submit" class="btn btn--primary">Opslaan</button>' +
              '<span class="fb-status" role="status"></span>' +
            '</div>' +
          '</form>' +
          '<div class="fb-saved"><p class="blok__lbl">Feedback van de projectgroep</p>' +
            '<ul class="fb-list"></ul></div>' +
        '</div>' +
      '</details>';
  }).join('');

  document.getElementById('blokken').innerHTML = html;

  document.querySelectorAll('.blok').forEach(function (blok) {
    var naam = blok.querySelector('.fb-naam');
    var anders = blok.querySelector('.fb-anders');
    naam.addEventListener('change', function () {
      anders.hidden = naam.value !== '__anders';
    });
    blok.querySelector('.fb-form').addEventListener('submit', function (e) {
      e.preventDefault();
      submitFeedback(blok);
    });
  });
}

/* ---------- Render saved feedback ---------- */
function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleString('nl-NL',
      { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch (e) { return ''; }
}

function renderFeedback(rows) {
  var perSectie = {};
  rows.forEach(function (r) {
    (perSectie[r.sectie] = perSectie[r.sectie] || []).push(r);
  });

  document.querySelectorAll('.blok').forEach(function (blok) {
    var key = blok.getAttribute('data-sectie');
    var items = perSectie[key] || [];
    var list = blok.querySelector('.fb-list');
    var count = blok.querySelector('.blok__count');
    list.textContent = '';
    count.textContent = items.length ? String(items.length) : '';

    if (!items.length) {
      var empty = document.createElement('li');
      empty.className = 'fb-empty';
      empty.textContent = 'Nog geen feedback. Wees de eerste.';
      list.appendChild(empty);
      return;
    }
    items.forEach(function (r) {
      var li = document.createElement('li');
      li.className = 'fb-item';
      var meta = document.createElement('p');
      meta.className = 'fb-item__meta';
      var who = document.createElement('strong');
      who.textContent = r.naam || 'Onbekend';
      meta.appendChild(who);
      meta.appendChild(document.createTextNode(
        ' · ' + (r.pagina || 'Algemeen') + ' · ' + fmtDate(r.created_at)));
      var txt = document.createElement('p');
      txt.className = 'fb-item__txt';
      txt.textContent = r.bericht || '';
      li.appendChild(meta);
      li.appendChild(txt);
      list.appendChild(li);
    });
  });
}

async function loadFeedback() {
  if (!supabase) { return; }
  var res = await supabase.from('feedback').select('*').order('created_at', { ascending: true });
  if (res.error) { console.error(res.error); return; }
  renderFeedback(res.data || []);
}

/* ---------- Submit ---------- */
async function submitFeedback(blok) {
  var status = blok.querySelector('.fb-status');
  function say(msg, ok) {
    status.textContent = msg;
    status.className = 'fb-status ' + (ok ? 'fb-status--ok' : 'fb-status--err');
  }

  var naamSel = blok.querySelector('.fb-naam').value;
  var naam = naamSel === '__anders'
    ? blok.querySelector('.fb-naam-anders').value.trim()
    : naamSel;
  var pagina = blok.querySelector('.fb-pagina').value;
  var bericht = blok.querySelector('.fb-bericht').value.trim();

  if (!naam) { say('Kies of vul eerst je naam in.', false); return; }
  if (!bericht) { say('Typ eerst je feedback.', false); return; }
  if (!supabase) { say('De feedback-opslag is nog niet gekoppeld.', false); return; }

  var btn = blok.querySelector('button[type="submit"]');
  btn.disabled = true;
  say('Bezig met opslaan...', true);

  var res = await supabase.from('feedback').insert({
    sectie: blok.getAttribute('data-sectie'),
    pagina: pagina,
    naam: naam,
    bericht: bericht
  });

  btn.disabled = false;
  if (res.error) {
    console.error(res.error);
    say('Opslaan mislukt. Probeer het opnieuw.', false);
  } else {
    say('Opgeslagen, bedankt!', true);
    blok.querySelector('.fb-bericht').value = '';
    loadFeedback();
  }
}

/* ---------- Disabled state when Supabase is not configured yet ---------- */
function disableSaving() {
  document.getElementById('config-warning').hidden = false;
  document.querySelectorAll('.fb-form button[type="submit"]').forEach(function (b) {
    b.disabled = true;
  });
}

/* ---------- Buttons ---------- */
document.getElementById('refresh-btn').addEventListener('click', loadFeedback);
document.getElementById('print-btn').addEventListener('click', function () {
  document.querySelectorAll('details.blok').forEach(function (d) { d.open = true; });
  window.print();
});

/* ---------- Init ---------- */
(async function init() {
  buildBlocks();

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    disableSaving();
    return;
  }
  try {
    var mod = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    supabase = mod.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.error('Supabase kon niet laden:', e);
    disableSaving();
    return;
  }

  loadFeedback();

  /* Live updates: re-load whenever anyone adds feedback. */
  supabase.channel('feedback-stream')
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'feedback' },
      loadFeedback)
    .subscribe();
})();
