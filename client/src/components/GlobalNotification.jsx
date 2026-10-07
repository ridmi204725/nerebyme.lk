import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { getStoredLanguage, translateNotification } from '../utils/notifications';

const GlobalNotification = () => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    let timer;
    const handler = (event) => {
      const detail = event.detail || {};
      const language = getStoredLanguage();
      const text = detail.key
        ? translateNotification(detail.text, language)
        : translateNotification(detail.text, language);
      setNotification({
        type: detail.type || 'success',
        text,
      });
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setNotification(null), detail.duration || 3500);
    };

    window.addEventListener('app-notification', handler);
    return () => {
      window.removeEventListener('app-notification', handler);
      window.clearTimeout(timer);
    };
  }, []);

  if (!notification) return null;

  const isError = notification.type === 'error';
  const isInfo = notification.type === 'info';

  return (
    <div className="nm-global-toast" role="status" aria-live="polite">
      <div className={`nm-global-toast-inner ${isError ? 'is-error' : isInfo ? 'is-info' : 'is-success'}`}>
        <span className="nm-global-toast-icon">
          {isError ? <FaExclamationTriangle /> : isInfo ? <FaInfoCircle /> : <FaCheckCircle />}
        </span>
        <span className="nm-global-toast-text">{notification.text}</span>
        <button type="button" className="nm-global-toast-close" onClick={() => setNotification(null)} aria-label="Close">
          <FaTimes size={11} />
        </button>
      </div>
    </div>
  );
};

export default GlobalNotification;
