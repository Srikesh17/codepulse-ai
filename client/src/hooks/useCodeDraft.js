import { useState, useEffect, useRef, useCallback } from 'react';
import { sessionApi } from '../services/sessionApi';

/**
 * useCodeDraft — Manages autosave, version tracking, and attempt snapshots
 * for the Monaco coding workspace.
 *
 * @param {string|null} sessionId — backend session UUID (null until session loads)
 * @param {string} initialCode — starter code (used only before first draft loads)
 * @param {boolean} isDemo — if true, skips backend calls and saves to localStorage only
 */
export function useCodeDraft(sessionId, initialCode, isDemo = false) {
  const [code, setCode] = useState(initialCode || '');
  const [version, setVersion] = useState(0);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error' | 'conflict'
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [conflictError, setConflictError] = useState(null);

  const autosaveTimerRef = useRef(null);
  const sessionIdRef = useRef(sessionId);
  const codeRef = useRef(code);
  const versionRef = useRef(version);

  // Keep refs in sync
  useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);
  useEffect(() => { codeRef.current = code; }, [code]);
  useEffect(() => { versionRef.current = version; }, [version]);

  // ─── Persist to backend ──────────────────────────────────────────────────

  const flushSave = useCallback(async () => {
    const sid = sessionIdRef.current;
    const currentCode = codeRef.current;
    const currentVersion = versionRef.current;

    if (!sid || isDemo) {
      // Demo mode: save to localStorage keyed by sessionId or 'demo'
      const key = `codepulse_draft_${sid || 'demo'}`;
      localStorage.setItem(key, currentCode);
      setSaveStatus('saved');
      setLastSavedAt(new Date());
      return;
    }

    setSaveStatus('saving');
    try {
      const res = await sessionApi.saveDraft(sid, currentCode, currentVersion);
      const newVersion = res?.data?.version ?? currentVersion + 1;
      setVersion(newVersion);
      setSaveStatus('saved');
      setLastSavedAt(new Date());
      setConflictError(null);
    } catch (err) {
      if (err.status === 409) {
        setSaveStatus('conflict');
        setConflictError(err.message || 'Draft conflict: another tab may have saved. Reload to sync.');
      } else {
        setSaveStatus('error');
      }
    }
  }, [isDemo]);

  // ─── Debounced autosave (1500ms inactivity) ──────────────────────────────

  const scheduleAutosave = useCallback(() => {
    clearTimeout(autosaveTimerRef.current);
    setSaveStatus('idle');
    autosaveTimerRef.current = setTimeout(() => {
      flushSave();
    }, 1500);
  }, [flushSave]);

  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode || '');
    scheduleAutosave();
  }, [scheduleAutosave]);

  // ─── Keyboard shortcut: Ctrl+S / Cmd+S ──────────────────────────────────

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        clearTimeout(autosaveTimerRef.current);
        flushSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flushSave]);

  // ─── Flush on unmount ────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      clearTimeout(autosaveTimerRef.current);
      // Best-effort flush without async (fire and forget)
      if (sessionIdRef.current && codeRef.current) {
        flushSave();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Load initial draft when sessionId becomes available ─────────────────

  const loadDraft = useCallback((draftCode, draftVersion) => {
    setCode(draftCode);
    setVersion(draftVersion ?? 1);
  }, []);

  // ─── Reset to starter code ───────────────────────────────────────────────

  const resetCode = useCallback(() => {
    setCode(initialCode || '');
    setVersion(0);
    setSaveStatus('idle');
    setConflictError(null);
    clearTimeout(autosaveTimerRef.current);
  }, [initialCode]);

  // ─── Save attempt snapshot ───────────────────────────────────────────────

  const saveAttempt = useCallback(async (attemptType = 'manual_snapshot') => {
    const sid = sessionIdRef.current;
    if (!sid || isDemo) return null;
    try {
      const res = await sessionApi.createAttempt(sid, codeRef.current, attemptType);
      return res?.data || null;
    } catch (err) {
      console.warn('Attempt snapshot failed:', err.message);
      return null;
    }
  }, [isDemo]);

  return {
    code,
    version,
    saveStatus,
    lastSavedAt,
    conflictError,
    handleCodeChange,
    loadDraft,
    resetCode,
    saveAttempt,
    flushSave,
  };
}
