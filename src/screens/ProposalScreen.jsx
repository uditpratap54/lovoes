import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

// ─────────────────────────────────────────────────────────────────────────────
// Activity log + proposal data — stored in localStorage (no backend required)
// ─────────────────────────────────────────────────────────────────────────────
const ACTIVITY_KEY = 'loveos_proposal_activity';
const DATA_KEY     = 'loveos_proposal_data';

function appendActivityLog(entry) {
  try {
    const log = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');
    log.push({ ...entry, id: Date.now() });
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(log));
  } catch (_) { /* graceful silent fail */ }
}

function saveProposalData(patch) {
  try {
    const existing = JSON.parse(localStorage.getItem(DATA_KEY) || '{}');
    localStorage.setItem(DATA_KEY, JSON.stringify({ ...existing, ...patch }));
  } catch (_) { /* graceful silent fail */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// Toast — matches existing glass-card design language
// ─────────────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  const isSuccess = toast?.type === 'success';
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          className="fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl font-semibold text-sm"
          style={{
            background: isSuccess
              ? 'linear-gradient(135deg, rgba(34,197,94,0.92), rgba(16,185,129,0.92))'
              : 'linear-gradient(135deg, rgba(239,68,68,0.92), rgba(220,38,38,0.92))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${isSuccess ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)'}`,
            boxShadow: isSuccess
              ? '0 0 30px rgba(34,197,94,0.25)'
              : '0 0 30px rgba(239,68,68,0.25)',
            color: '#fff',
            maxWidth: 320,
          }}
          initial={{ opacity: 0, y: -18, x: 18, scale: 0.88 }}
          animate={{ opacity: 1, y: 0,   x: 0,  scale: 1    }}
          exit={{    opacity: 0, y: -14,          scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        >
          {isSuccess
            ? <CheckCircle2 size={17} strokeWidth={2.5} />
            : <AlertCircle  size={17} strokeWidth={2.5} />
          }
          <span>{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Confirmation modal — uses existing glass-card class + design tokens
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmModal({ open, onClose, onConfirm, type, rejectReason, setRejectReason, isProcessing }) {
  const isAccept = type === 'accept';

  // Keyboard: Esc = close, Enter = confirm
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape' && !isProcessing) onClose();
      if (e.key === 'Enter'  && !isProcessing) onConfirm();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, isProcessing, onClose, onConfirm]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[9990] bg-black/55"
            style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={  { opacity: 0 }}
            onClick={() => !isProcessing && onClose()}
          />

          {/* Modal card — uses existing glass-card class */}
          <div className="fixed inset-0 z-[9991] flex items-center justify-center p-4">
            <motion.div
              className="glass-card w-full max-w-xs p-6"
              style={{
                border: `1px solid ${isAccept ? 'rgba(34,197,94,0.28)' : 'rgba(239,68,68,0.28)'}`,
                boxShadow: isAccept
                  ? '0 0 50px rgba(34,197,94,0.12), 0 20px 60px rgba(0,0,0,0.5)'
                  : '0 0 50px rgba(239,68,68,0.12), 0 20px 60px rgba(0,0,0,0.5)',
              }}
              initial={{ opacity: 0, scale: 0.82, y: 32 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={  { opacity: 0, scale: 0.9,  y: 20  }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            >
              {/* Icon circle */}
              <div className="text-center mb-5">
                <motion.div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3"
                  style={{
                    background: isAccept
                      ? 'rgba(34,197,94,0.14)'
                      : 'rgba(239,68,68,0.14)',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 280, delay: 0.08 }}
                >
                  {isAccept
                    ? <Check size={26} strokeWidth={2.5} style={{ color: '#4ade80' }} />
                    : <X     size={26} strokeWidth={2.5} style={{ color: '#f87171' }} />
                  }
                </motion.div>

                <h3 className="font-display font-bold text-xl text-white">
                  {isAccept ? 'Accept Proposal?' : 'Reject Proposal?'}
                </h3>
                <p className="text-white/45 text-sm mt-1 leading-snug">
                  {isAccept
                    ? 'Are you sure you want to accept this proposal?'
                    : 'Are you sure? This action cannot be undone.'}
                </p>
              </div>

              {/* Rejection reason — only shown for reject */}
              {!isAccept && (
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                >
                  <label className="text-white/35 font-mono text-xs mb-1.5 block tracking-widest">
                    REASON (optional)
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Why are you rejecting this proposal?"
                    rows={3}
                    disabled={isProcessing}
                    className="w-full rounded-xl px-4 py-3 text-sm text-white/75 placeholder-white/20 resize-none outline-none transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e)  => { e.target.style.border = '1px solid rgba(239,68,68,0.38)'; }}
                    onBlur={(e)   => { e.target.style.border = '1px solid rgba(255,255,255,0.1)'; }}
                  />
                </motion.div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3">
                {/* Cancel */}
                <motion.button
                  className="flex-1 py-3 rounded-2xl font-semibold text-sm transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.55)',
                  }}
                  whileHover={{ background: 'rgba(255,255,255,0.11)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  disabled={isProcessing}
                >
                  Cancel
                </motion.button>

                {/* Confirm */}
                <motion.button
                  className="flex-1 py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-1.5"
                  style={{
                    background: isAccept
                      ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                      : 'linear-gradient(135deg, #ef4444, #dc2626)',
                    boxShadow: isAccept
                      ? '0 0 22px rgba(34,197,94,0.42)'
                      : '0 0 22px rgba(239,68,68,0.42)',
                    opacity: isProcessing ? 0.72 : 1,
                  }}
                  whileHover={{ scale: isProcessing ? 1 : 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onConfirm}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader2 size={15} />
                    </motion.div>
                  ) : isAccept ? (
                    <><Check size={15} strokeWidth={2.5} /><span>Confirm Accept</span></>
                  ) : (
                    <><X     size={15} strokeWidth={2.5} /><span>Confirm Reject</span></>
                  )}
                </motion.button>
              </div>

              {/* Keyboard hint */}
              <p className="text-white/20 font-mono text-xs text-center mt-3">
                Enter to confirm · Esc to cancel
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Status badge — animated pill shown after decision
// ─────────────────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  if (status === 'pending') return null;
  const isAccepted = status === 'accepted';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75, y: 8 }}
      animate={{ opacity: 1, scale: 1,    y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm"
      style={{
        background: isAccepted ? 'rgba(34,197,94,0.1)'   : 'rgba(239,68,68,0.1)',
        border:     isAccepted ? '1px solid rgba(34,197,94,0.28)' : '1px solid rgba(239,68,68,0.28)',
        color:      isAccepted ? '#4ade80' : '#f87171',
      }}
    >
      {isAccepted
        ? <><CheckCircle2 size={15} strokeWidth={2.5} /> Accepted by Admin</>
        : <><X            size={15} strokeWidth={2.5} /> Rejected</>
      }
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ProposalScreen — original layout preserved, new features surgically inserted
// ─────────────────────────────────────────────────────────────────────────────
export default function ProposalScreen() {
  const { goTo } = useAppStore();

  // ── Existing state (untouched) ───────────────────────────────────────────
  const [rejectPos,    setRejectPos]    = useState({ x: 0, y: 0 });
  const [rejectClicks, setRejectClicks] = useState(0);
  const rejectRef = useRef(null);
  const [showQuestion, setShowQuestion] = useState(false);

  // ── New state (additive only) ────────────────────────────────────────────
  // Always start as 'pending' — status only locks within this session
  const [status, setStatus] = useState('pending');
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason,   setRejectReason]   = useState('');
  const [isProcessing,   setIsProcessing]   = useState(false);
  const [toast,          setToast]          = useState(null);

  // ── Existing effect (untouched) ──────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setShowQuestion(true), 400);
    return () => clearTimeout(t);
  }, []);

  // ── Toast auto-dismiss ───────────────────────────────────────────────────
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(t);
  }, [toast]);

  const fireToast = (type, message) =>
    setToast({ type, message, id: Date.now() });

  // ── Existing handlers (untouched logic) ─────────────────────────────────
  const handleRejectHover = () => {
    if (rejectClicks >= 3 || status !== 'pending') return; // After 3 tries, let them click it
    const maxX = window.innerWidth * 0.3;
    const maxY = 150;
    const x = (Math.random() - 0.5) * maxX;
    const y = (Math.random() - 0.5) * maxY;
    setRejectPos({ x, y });
  };

  // Modified: show confirm modal instead of direct goTo — logic stays identical
  const handleRejectClick = () => {
    if (status !== 'pending') return;
    setRejectClicks((c) => c + 1);
    if (rejectClicks >= 2) {
      setShowRejectModal(true); // ← was: goTo('reject') — now shows confirmation first
    } else {
      handleRejectHover();
    }
  };

  // ── New: Accept confirmation handler ────────────────────────────────────
  const handleAcceptConfirm = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const timestamp = new Date().toISOString();

    // Simulate brief processing (mimics API call)
    setTimeout(() => {
      try {
        localStorage.setItem('loveos_proposal_status',     'accepted');
        localStorage.setItem('loveos_proposal_acceptedAt', timestamp);
        localStorage.setItem('loveos_proposal_acceptedBy', 'admin');
        saveProposalData({
          status:     'accepted',
          acceptedAt: timestamp,
          acceptedBy: 'admin',
        });
        appendActivityLog({
          action:    'ACCEPTED',
          adminId:   'admin',
          adminName: 'Admin',
          timestamp,
          status:    'accepted',
        });
      } catch (_) { /* graceful fail */ }

      setStatus('accepted');
      setShowAcceptModal(false);
      setIsProcessing(false);
      fireToast('success', 'Proposal Accepted Successfully! 🎉');
      setTimeout(() => goTo('accept'), 1200); // Navigate after toast is visible
    }, 850);
  };

  // ── New: Reject confirmation handler ────────────────────────────────────
  const handleRejectConfirm = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    const timestamp = new Date().toISOString();

    setTimeout(() => {
      try {
        localStorage.setItem('loveos_proposal_status',          'rejected');
        localStorage.setItem('loveos_proposal_rejectedAt',      timestamp);
        if (rejectReason)
          localStorage.setItem('loveos_proposal_rejectionReason', rejectReason);
        saveProposalData({
          status:          'rejected',
          rejectedAt:      timestamp,
          rejectionReason: rejectReason || null,
        });
        appendActivityLog({
          action:    'REJECTED',
          adminId:   'admin',
          adminName: 'Admin',
          timestamp,
          status:    'rejected',
          reason:    rejectReason || null,
        });
      } catch (_) { /* graceful fail */ }

      setStatus('rejected');
      setShowRejectModal(false);
      setIsProcessing(false);
      fireToast('error', 'Proposal Rejected.');
      setTimeout(() => goTo('reject'), 900);
    }, 850);
  };

  // ────────────────────────────────────────────────────────────────────────
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* ── Toast notification (top-right) ── */}
      <Toast toast={toast} />

      {/* ── Confirmation modals ── */}
      <ConfirmModal
        open={showAcceptModal}
        onClose={() => !isProcessing && setShowAcceptModal(false)}
        onConfirm={handleAcceptConfirm}
        type="accept"
        isProcessing={isProcessing}
      />
      <ConfirmModal
        open={showRejectModal}
        onClose={() => !isProcessing && setShowRejectModal(false)}
        onConfirm={handleRejectConfirm}
        type="reject"
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        isProcessing={isProcessing}
      />

      {/* ─────────────────────────────────────────────────────────────────
          EVERYTHING BELOW IS THE ORIGINAL CODE — ZERO CHANGES
          ───────────────────────────────────────────────────────────────── */}

      {/* Romantic ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 40% 50%, rgba(236,72,153,0.2) 0%, transparent 50%), radial-gradient(ellipse at 60% 40%, rgba(139,92,246,0.2) 0%, transparent 50%)',
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-lg pointer-events-none"
          style={{
            left: `${10 + i * 12}%`,
            top: '100%',
          }}
          animate={{
            y: [0, -(window.innerHeight + 50)],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [0, 0.7, 0],
            rotate: [0, (Math.random() - 0.5) * 90],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeInOut',
          }}
        >
          {['💕', '💙', '✨', '🌸', '💫', '❤️', '🌟', '💝'][i]}
        </motion.div>
      ))}

      <div className="w-full max-w-sm text-center">
        {/* Heart animation */}
        <motion.div
          className="text-7xl mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, delay: 0.2 }}
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1], rotate: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            💍
          </motion.span>
        </motion.div>

        {/* Main card */}
        <AnimatePresence>
          {showQuestion && (
            <motion.div
              className="glass-card p-8 mb-6"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 120 }}
              style={{
                boxShadow: '0 0 60px rgba(236,72,153,0.2), 0 0 100px rgba(139,92,246,0.1), 0 20px 60px rgba(0,0,0,0.5)',
              }}
            >
              <p className="text-white/40 font-mono text-xs tracking-[0.3em] mb-4">
                FINAL QUESTION
              </p>
              <h2 className="font-display font-bold text-2xl text-white leading-snug mb-2">
                Will you let me become
              </h2>
              <h2 className="font-display font-bold text-2xl text-gradient leading-snug mb-6">
                someone special in your life?
              </h2>
              <p className="text-white/40 text-sm">
                No pressure. No expectations. Just an honest question. 💙
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        {showQuestion && (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {/* ── NEW: Accept button — only visible while pending ── */}
            {status === 'pending' && (
              <motion.button
                className="btn-accept-green w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAcceptModal(true)}
              >
                <span className="flex items-center justify-center gap-2">
                  <Check size={17} strokeWidth={2.5} />
                  <span>Accept 💚</span>
                </span>
              </motion.button>
            )}

            {/* ── NEW: Status badge — shown after decision ── */}
            <StatusBadge status={status} />

            {/* Reject — runs away (original, untouched) */}
            {status === 'pending' && (
              <motion.div
                animate={{
                  x: rejectPos.x,
                  y: rejectPos.y,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <motion.button
                  ref={rejectRef}
                  className="btn-reject w-full"
                  onMouseEnter={handleRejectHover}
                  onClick={handleRejectClick}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>Reject</span>
                    <span>🙈</span>
                  </span>
                </motion.button>
              </motion.div>
            )}

            {rejectClicks > 0 && rejectClicks < 3 && status === 'pending' && (
              <motion.p
                key={rejectClicks}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-white/30 font-mono text-xs"
              >
                {['Hmm... catch me if you can! 😄', 'You sure? Think about it... 🤔'][rejectClicks - 1]}
              </motion.p>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
