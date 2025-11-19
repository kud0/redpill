'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';
import styles from './PremiumButton.module.css';

interface PremiumButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  href?: string;
  onClick?: () => void;
  className?: string;
}

const LoadingSpinner = () => (
  <svg
    className={styles.spinner}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className={styles.spinnerCircle}
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className={styles.spinnerPath}
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export default function PremiumButton({
  children,
  variant = 'primary',
  size = 'md',
  glow = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  href,
  onClick,
  className = '',
}: PremiumButtonProps) {
  const Component = href ? motion(Link) : motion.button;

  const buttonClasses = `
    ${styles.button}
    ${styles[variant]}
    ${styles[size]}
    ${glow ? styles.glow : ''}
    ${disabled ? styles.disabled : ''}
    ${loading ? styles.loading : ''}
    ${className}
  `.trim();

  const buttonProps = {
    className: buttonClasses,
    whileHover: !disabled ? { scale: 1.05 } : {},
    whileTap: !disabled ? { scale: 0.95 } : {},
    ...(href ? { href: href as any } : {}),
    ...(onClick && !disabled && !loading ? { onClick } : {}),
    ...(disabled || loading ? { disabled: true } : {}),
  };

  return (
    <Component {...buttonProps}>
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === 'left' && (
        <span className={styles.icon}>{icon}</span>
      )}
      <span className={styles.text}>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className={styles.icon}>{icon}</span>
      )}

      {/* Shimmer effect for gradient variant */}
      {variant === 'gradient' && !disabled && !loading && (
        <motion.div
          className={styles.shimmer}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </Component>
  );
}
