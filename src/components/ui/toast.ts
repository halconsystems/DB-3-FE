import React from 'react';
import { BellRing, X } from 'lucide-react';
import {
  toast,
  ToastContainer,
  ToastContentProps,
  ToastOptions,
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export { toast, ToastContainer };

export interface SignalRToastContentProps {
  title?: string | null;
  message?: string | null;
  eventLabel?: string;
}

const formatToastTime = () =>
  new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date());

export const SignalRToast = ({
  closeToast: onClose,
  data,
}: ToastContentProps<SignalRToastContentProps>) => {
  const title = data?.title?.trim() || 'Live update';
  const message = data?.message?.trim() || 'A new notification just arrived.';
  const eventLabel = data?.eventLabel?.trim() || 'Real-time alert';
  const time = formatToastTime();

  return React.createElement(
    'div',
    { className: 'signalr-toast' },
    React.createElement(
      'div',
      { className: 'signalr-toast__badge', 'aria-hidden': 'true' },
      React.createElement(BellRing, { size: 18, strokeWidth: 2.1 })
    ),
    React.createElement(
      'div',
      { className: 'signalr-toast__body' },
      React.createElement(
        'div',
        { className: 'signalr-toast__meta' },
        React.createElement('span', { className: 'signalr-toast__event' }, eventLabel),
        React.createElement('span', { className: 'signalr-toast__time' }, time)
      ),
      React.createElement('strong', { className: 'signalr-toast__title' }, title),
      React.createElement('p', { className: 'signalr-toast__message' }, message)
    ),
    React.createElement(
      'button',
      {
        type: 'button',
        className: 'signalr-toast__close',
        onClick: () => onClose?.(),
        'aria-label': 'Close notification',
      },
      React.createElement(X, { size: 16, strokeWidth: 2.2 })
    )
  );
};

export const toastOptions: ToastOptions<SignalRToastContentProps> = {
  position: 'top-right',
  autoClose: 4500,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  closeButton: false,
  icon: false,
  className: 'signalr-toast-shell',
  progressClassName: 'signalr-toast-shell__progress',
};
