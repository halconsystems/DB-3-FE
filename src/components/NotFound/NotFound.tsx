'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './NotFound.module.css';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.content}>
        {/* 404 Number */}
        <div className={styles.errorCode}>404</div>

        {/* Illustration */}
        <div className={styles.illustration}>
          <svg width="150" height="150" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="95" stroke="#30B33D" strokeWidth="2" opacity="0.3" />
            <path
              d="M100 50C73.4 50 52 71.4 52 98C52 124.6 73.4 146 100 146C126.6 146 148 124.6 148 98"
              stroke="#30B33D"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="80" cy="95" r="4" fill="#30B33D" />
            <circle cx="120" cy="95" r="4" fill="#30B33D" />
            <path
              d="M85 115C90 120 110 120 115 115"
              stroke="#30B33D"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Text Content */}
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.description}>
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        {/* Suggestions */}
        <div className={styles.suggestions}>
          <p className={styles.suggestionsTitle}>Here are some helpful links:</p>
          <ul className={styles.suggestionsList}>
            <li>
              <Link href="/dashboard" className={styles.link}>
                Go to Dashboard
              </Link>
            </li>
            <li>
              <Link href="/setup" className={styles.link}>
                Setup
              </Link>
            </li>
            <li>
              <Link href="/user" className={styles.link}>
                Users
              </Link>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            onClick={() => router.back()}
            className={styles.secondaryButton}
          >
            Go Back
          </button>
          <Link href="/dashboard" className={styles.primaryButton}>
            Back to Home
          </Link>
        </div>

        {/* Error Details */}
        <div className={styles.details}>
          <p className={styles.errorPath}>
            Requested URL could not be found
          </p>
        </div>
      </div>
    </div>
  );
}
