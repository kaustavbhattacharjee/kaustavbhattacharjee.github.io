/* ─────────────────────────────────────────────────────────────
   NJ Drive Test Quiz – app.js
   Works on file:// (local) and any web server (no backend).
   Progress stored in localStorage; session state in sessionStorage.
───────────────────────────────────────────────────────────── */

// ── Crypto helpers ────────────────────────────────────────────
async function hashPwd(pwd) {
  if (window.crypto && window.crypto.subtle) {
    const buf = await window.crypto.subtle.digest(
      'SHA-256', new TextEncoder().encode(pwd)
    );
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for old browsers / file:// without subtle crypto
  let h = 5381;
  for (let i = 0; i < pwd.length; i++) {
    h = (Math.imul(h, 31) + pwd.charCodeAt(i)) | 0;
  }
  return 'fb:' + Math.abs(h).toString(16);
}

// ── localStorage keys ─────────────────────────────────────────
const KEY_HASH  = 'nj_dt_hash';    // password hash
const KEY_PROG  = 'nj_dt_prog';    // progress data
const KEY_SESS  = 'nj_dt_sess';    // session (sessionStorage)

// ── App state ─────────────────────────────────────────────────
const state = {
  exam:     null,   // EXAM object
  qIdx:     0,      // current question index (0-based)
  answered: false,  // has user responded this question?
  chosen:   null,   // option index user chose this round
  mode:     'quiz', // 'quiz' | 'review'
  filter:   'all',  // review filter: 'all' | 'mastered' | 'missed' | 'skipped'
};

// ── Progress helpers ──────────────────────────────────────────
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(KEY_PROG)) || {}; }
  catch(e) { return {}; }
}
function saveProgress(progress) {
  localStorage.setItem(KEY_PROG, JSON.stringify(progress));
}
function getExamProgress(examId) {
  const p = loadProgress();
  return p[examId] || {};
}
function recordAnswer(examId, qIdx, isCorrect, chosen) {
  const p = loadProgress();
  if (!p[examId]) p[examId] = {};
  const key = String(qIdx);
  if (!p[examId][key]) p[examId][key] = { correct: false, chosen: null, attempts: 0 };
  p[examId][key].attempts++;
  p[examId][key].chosen = chosen;
  // Once mastered, stays mastered
  if (!p[examId][key].correct) p[examId][key].correct = isCorrect;
  saveProgress(p);
}
function getExamStats(examId) {
  const ep = getExamProgress(examId);
  const total = EXAMS[examId - 1].questions.length;
  let attempted = 0, mastered = 0;
  for (const k in ep) {
    if (ep[k].attempts > 0) attempted++;
    if (ep[k].correct) mastered++;
  }
  return { total, attempted, mastered, pct: Math.round((mastered / total) * 100) };
}
function getOverallStats() {
  let total = 0, attempted = 0, mastered = 0;
  EXAMS.forEach(e => {
    const s = getExamStats(e.id);
    total    += s.total;
    attempted += s.attempted;
    mastered  += s.mastered;
  });
  return { total, attempted, mastered, pct: Math.round((mastered / total) * 100) };
}
function resetExamProgress(examId) {
  const p = loadProgress();
  delete p[examId];
  saveProgress(p);
}

// ── Auth helpers ──────────────────────────────────────────────
function isLoggedIn() {
  return sessionStorage.getItem(KEY_SESS) === '1';
}
function setLoggedIn(val) {
  if (val) sessionStorage.setItem(KEY_SESS, '1');
  else     sessionStorage.removeItem(KEY_SESS);
}
function hasPasswordSet() {
  return !!localStorage.getItem(KEY_HASH);
}

// ── View management ───────────────────────────────────────────
const VIEWS = ['view-login', 'view-setup', 'view-dashboard',
               'view-quiz', 'view-review'];

function showView(id) {
  VIEWS.forEach(v => {
    const el = document.getElementById(v);
    if (el) el.classList.toggle('hidden', v !== id);
  });
  window.scrollTo(0, 0);
}

// ── Toast ─────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, dur = 2500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), dur);
}

// ── Bootstrap (on page load) ──────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  if (!hasPasswordSet()) {
    showView('view-setup');
  } else if (isLoggedIn()) {
    renderDashboard();
    showView('view-dashboard');
  } else {
    showView('view-login');
  }
});

// ── SETUP view ────────────────────────────────────────────────
document.getElementById('form-setup').addEventListener('submit', async e => {
  e.preventDefault();
  const p1  = document.getElementById('setup-pwd').value;
  const p2  = document.getElementById('setup-pwd2').value;
  const err = document.getElementById('setup-error');
  err.textContent = '';
  if (p1.length < 4) { err.textContent = 'Password must be at least 4 characters.'; return; }
  if (p1 !== p2)     { err.textContent = 'Passwords do not match.'; return; }
  const h = await hashPwd(p1);
  localStorage.setItem(KEY_HASH, h);
  setLoggedIn(true);
  renderDashboard();
  showView('view-dashboard');
});

// ── LOGIN view ────────────────────────────────────────────────
document.getElementById('form-login').addEventListener('submit', async e => {
  e.preventDefault();
  const pwd = document.getElementById('login-pwd').value;
  const err = document.getElementById('login-error');
  err.textContent = '';
  const h = await hashPwd(pwd);
  if (h !== localStorage.getItem(KEY_HASH)) {
    err.textContent = 'Incorrect password. Please try again.';
    return;
  }
  setLoggedIn(true);
  renderDashboard();
  showView('view-dashboard');
});

// ── LOGOUT ────────────────────────────────────────────────────
document.getElementById('btn-logout').addEventListener('click', () => {
  setLoggedIn(false);
  document.getElementById('login-pwd').value = '';
  document.getElementById('login-error').textContent = '';
  showView('view-login');
});

// ── DASHBOARD render ──────────────────────────────────────────
function renderDashboard() {
  // Overall stats
  const ov = getOverallStats();
  document.getElementById('stat-total').textContent    = ov.total;
  document.getElementById('stat-attempted').textContent = ov.attempted;
  document.getElementById('stat-mastered').textContent  = ov.mastered;
  document.getElementById('stat-pct').textContent       = ov.pct + '%';

  // Per-exam cards
  const grid = document.getElementById('exams-grid');
  grid.innerHTML = '';
  EXAMS.forEach(exam => {
    const s = getExamStats(exam.id);
    const pct = s.pct;
    const done = s.mastered === s.total;
    let badgeClass = 'badge-new', badgeLabel = 'Not started';
    if (done) { badgeClass = 'badge-done'; badgeLabel = 'Complete'; }
    else if (s.attempted > 0) { badgeClass = 'badge-progress'; badgeLabel = 'In progress'; }

    const card = document.createElement('div');
    card.className = 'exam-card';
    card.innerHTML = `
      <div class="exam-card-header">
        <span class="exam-card-title">${exam.title}</span>
        <span class="badge ${badgeClass}">${badgeLabel}</span>
      </div>
      <div>
        <div class="progress-bar-wrap">
          <div class="progress-bar${done ? ' full' : ''}" style="width:${pct}%"></div>
        </div>
        <div class="exam-meta" style="margin-top:.4rem">
          <span>${s.mastered}/${s.total} mastered</span>
          <span>${pct}%</span>
        </div>
      </div>
      <div class="exam-actions">
        <button class="btn btn-primary btn-sm" onclick="startQuiz(${exam.id})">▶ Practice</button>
        <button class="btn btn-outline btn-sm" onclick="startReview(${exam.id})">📖 Review All</button>
        ${s.attempted > 0 ? `<button class="btn btn-ghost btn-sm" onclick="confirmReset(${exam.id})">↺ Reset</button>` : ''}
      </div>`;
    grid.appendChild(card);
  });
}

function confirmReset(examId) {
  if (!confirm(`Reset all progress for Exam #${examId}? This cannot be undone.`)) return;
  resetExamProgress(examId);
  renderDashboard();
  showToast(`Exam #${examId} progress reset.`);
}

// ── QUIZ ──────────────────────────────────────────────────────
function startQuiz(examId) {
  state.exam    = EXAMS[examId - 1];
  state.mode    = 'quiz';
  state.qIdx    = findFirstUnanswered(examId);
  state.answered = false;
  state.chosen   = null;
  renderQuizHeader();
  renderQuestion();
  showView('view-quiz');
}

function findFirstUnanswered(examId) {
  const ep = getExamProgress(examId);
  const qs = EXAMS[examId - 1].questions;
  // First: find unanswered
  for (let i = 0; i < qs.length; i++) {
    if (!ep[i] || !ep[i].attempts) return i;
  }
  // All answered: find first not mastered
  for (let i = 0; i < qs.length; i++) {
    if (ep[i] && !ep[i].correct) return i;
  }
  // All mastered: start from 0
  return 0;
}

function renderQuizHeader() {
  const total = state.exam.questions.length;
  document.getElementById('quiz-exam-title').textContent = state.exam.title;
  updateQuizCounter();
}

function updateQuizCounter() {
  const total = state.exam.questions.length;
  const idx   = state.qIdx;
  document.getElementById('quiz-counter').textContent = `${idx + 1} / ${total}`;
  const pct = ((idx + 1) / total) * 100;
  document.getElementById('quiz-progress-fill').style.width = pct + '%';
}

function renderQuestion() {
  const exam = state.exam;
  const q    = exam.questions[state.qIdx];
  const ep   = getExamProgress(exam.id);
  const prev = ep[state.qIdx];

  const labels = ['A','B','C','D'];

  document.getElementById('question-num').textContent  = `Question ${state.qIdx + 1} of ${exam.questions.length}`;
  document.getElementById('question-text').textContent = q.q;

  const list = document.getElementById('options-list');
  list.innerHTML = '';
  q.o.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-label">${labels[i]}</span><span>${opt}</span>`;
    btn.onclick = () => handleAnswer(i);
    list.appendChild(btn);
  });

  // Feedback & nav area
  document.getElementById('feedback-banner').classList.add('hidden');
  document.getElementById('feedback-banner').className = 'feedback-banner hidden';

  // If this question was already answered in a previous session, show state
  if (prev && prev.attempts > 0) {
    state.answered = true;
    state.chosen   = prev.chosen;
    showAnswerFeedback(q, prev.chosen, prev.correct, false);
  } else {
    state.answered = false;
    state.chosen   = null;
  }
  renderNavButtons();
  updateQuizCounter();
}

function handleAnswer(chosenIdx) {
  if (state.answered) return;
  state.answered = true;
  state.chosen   = chosenIdx;

  const q       = state.exam.questions[state.qIdx];
  const correct = (chosenIdx === q.a);
  recordAnswer(state.exam.id, state.qIdx, correct, chosenIdx);
  showAnswerFeedback(q, chosenIdx, correct, true);
  renderNavButtons();
  renderDashboard(); // keep dashboard stats live (hidden)
}

function showAnswerFeedback(q, chosenIdx, correct, animate) {
  const labels = ['A','B','C','D'];
  const btns   = document.querySelectorAll('#options-list .option-btn');

  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.a) {
      btn.classList.add(chosenIdx === q.a ? 'correct' : 'revealed');
    }
    if (i === chosenIdx && !correct) {
      btn.classList.add('wrong');
    }
  });

  const fb = document.getElementById('feedback-banner');
  fb.classList.remove('hidden', 'correct', 'wrong');
  if (correct) {
    fb.classList.add('correct');
    fb.innerHTML = `✅ <span>Correct! <strong>${labels[q.a]}. ${q.o[q.a]}</strong></span>`;
  } else {
    fb.classList.add('wrong');
    fb.innerHTML = `❌ <span>Incorrect. The correct answer is <strong>${labels[q.a]}. ${q.o[q.a]}</strong></span>`;
  }
}

function renderNavButtons() {
  const total    = state.exam.questions.length;
  const atEnd    = state.qIdx >= total - 1;
  const atStart  = state.qIdx === 0;

  document.getElementById('btn-prev').disabled = atStart;

  const nextBtn = document.getElementById('btn-next');
  if (atEnd && state.answered) {
    nextBtn.textContent = '🏁 See Score';
    nextBtn.className   = 'btn btn-gold';
    nextBtn.disabled    = false;
  } else if (state.answered) {
    nextBtn.textContent = 'Next →';
    nextBtn.className   = 'btn btn-primary';
    nextBtn.disabled    = false;
  } else {
    nextBtn.textContent = 'Next →';
    nextBtn.className   = 'btn btn-primary';
    nextBtn.disabled    = true;  // must answer before advancing
  }
}

document.getElementById('btn-prev').addEventListener('click', () => {
  if (state.qIdx > 0) { state.qIdx--; renderQuestion(); }
});

document.getElementById('btn-next').addEventListener('click', () => {
  const total = state.exam.questions.length;
  if (state.qIdx >= total - 1 && state.answered) {
    showScore();
  } else if (state.answered) {
    state.qIdx++;
    renderQuestion();
  }
});

document.getElementById('btn-quiz-back').addEventListener('click', () => {
  renderDashboard();
  showView('view-dashboard');
});

// ── SCORE SUMMARY ─────────────────────────────────────────────
function showScore() {
  const s    = getExamStats(state.exam.id);
  const pass = s.pct >= 80;

  document.getElementById('score-pct').textContent   = s.pct + '%';
  document.getElementById('score-correct').textContent = s.mastered;
  document.getElementById('score-total').textContent   = s.total;
  document.getElementById('score-title').textContent   =
    pass ? '🎉 Great job!' : '📚 Keep studying!';
  document.getElementById('score-sub').textContent     =
    pass
      ? `You've mastered ${s.mastered} of ${s.total} questions. You're ready!`
      : `You've mastered ${s.mastered} of ${s.total} questions. Review the ones you missed.`;

  const ring = document.getElementById('score-ring');
  ring.className = 'score-ring ' + (pass ? 'pass' : 'fail');

  document.getElementById('view-quiz-body').classList.add('hidden');
  document.getElementById('view-score').classList.remove('hidden');
  window.scrollTo(0, 0);
}

document.getElementById('btn-retry-wrong').addEventListener('click', () => {
  // Find first wrong answer and jump there
  const ep  = getExamProgress(state.exam.id);
  const qs  = state.exam.questions;
  for (let i = 0; i < qs.length; i++) {
    if (ep[i] && ep[i].attempts > 0 && !ep[i].correct) {
      state.qIdx = i;
      document.getElementById('view-quiz-body').classList.remove('hidden');
      document.getElementById('view-score').classList.add('hidden');
      renderQuestion();
      return;
    }
  }
  showToast('No wrong answers to retry!');
});

document.getElementById('btn-review-from-score').addEventListener('click', () => {
  startReview(state.exam.id);
});

document.getElementById('btn-back-dash-score').addEventListener('click', () => {
  document.getElementById('view-quiz-body').classList.remove('hidden');
  document.getElementById('view-score').classList.add('hidden');
  renderDashboard();
  showView('view-dashboard');
});

// ── REVIEW ────────────────────────────────────────────────────
function startReview(examId) {
  state.exam   = EXAMS[examId - 1];
  state.mode   = 'review';
  state.filter = 'all';

  document.getElementById('review-exam-title').textContent = state.exam.title;
  setReviewFilter('all');
  showView('view-review');
}

function setReviewFilter(f) {
  state.filter = f;
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === f);
  });
  renderReviewList();
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => setReviewFilter(btn.dataset.filter));
});

function renderReviewList() {
  const exam   = state.exam;
  const ep     = getExamProgress(exam.id);
  const labels = ['A','B','C','D'];
  const list   = document.getElementById('review-list');
  list.innerHTML = '';

  let shown = 0;
  exam.questions.forEach((q, i) => {
    const rec  = ep[i];
    const isMastered = rec && rec.correct;
    const isMissed   = rec && rec.attempts > 0 && !rec.correct;
    const isSkipped  = !rec || !rec.attempts;

    // Filter
    if (state.filter === 'mastered' && !isMastered) return;
    if (state.filter === 'missed'   && !isMissed)   return;
    if (state.filter === 'skipped'  && !isSkipped)  return;

    const statusLabel = isMastered ? 'Mastered' : isMissed ? 'Missed' : 'Not attempted';
    const statusClass = isMastered ? 'mastered'  : isMissed ? 'missed' : 'skipped';

    const item = document.createElement('div');
    item.className = `review-item ${statusClass}`;

    const opts = q.o.map((opt, oi) => {
      const isCorrect = (oi === q.a);
      const isWrong   = rec && rec.chosen === oi && !isCorrect;
      let cls = '';
      if (isCorrect) cls = 'correct-ans';
      else if (isWrong) cls = 'user-wrong';
      return `<div class="review-option ${cls}">
        <span class="review-opt-label">${labels[oi]}.</span>
        <span>${opt}${isCorrect ? ' ✓' : ''}${isWrong ? ' ✗ (your answer)' : ''}</span>
      </div>`;
    }).join('');

    item.innerHTML = `
      <div class="review-q-header">
        <span class="review-q-num">Q${i + 1}</span>
        <span class="review-q-status ${statusClass}">${statusLabel}</span>
      </div>
      <div class="review-q-text">${q.q}</div>
      <div class="review-options">${opts}</div>`;
    list.appendChild(item);
    shown++;
  });

  if (shown === 0) {
    list.innerHTML = '<p style="text-align:center;color:var(--muted);padding:2rem">No questions match this filter.</p>';
  }

  // Update filter counts
  updateFilterCounts(exam, ep);
}

function updateFilterCounts(exam, ep) {
  let mastered = 0, missed = 0, skipped = 0;
  exam.questions.forEach((q, i) => {
    const rec = ep[i];
    if      (rec && rec.correct)                      mastered++;
    else if (rec && rec.attempts > 0 && !rec.correct) missed++;
    else                                              skipped++;
  });
  const allBtn  = document.querySelector('[data-filter="all"]');
  const mBtn    = document.querySelector('[data-filter="mastered"]');
  const miBtn   = document.querySelector('[data-filter="missed"]');
  const skBtn   = document.querySelector('[data-filter="skipped"]');
  if (allBtn)  allBtn.textContent  = `All (${exam.questions.length})`;
  if (mBtn)    mBtn.textContent    = `✅ Mastered (${mastered})`;
  if (miBtn)   miBtn.textContent   = `❌ Missed (${missed})`;
  if (skBtn)   skBtn.textContent   = `⏭ Not attempted (${skipped})`;
}

document.getElementById('btn-review-back').addEventListener('click', () => {
  renderDashboard();
  showView('view-dashboard');
});

document.getElementById('btn-review-practice').addEventListener('click', () => {
  startQuiz(state.exam.id);
});
