import { ButtonHTMLAttributes } from 'react';
import Link from 'next/link';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  href?: string;
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  href,
  className = '',
  ...props
}: ButtonProps) {
  const baseClassName = `
    ${variant === 'primary' ? 'button-primary-color' : 'button-secondary-color'}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  if (href) {
    return (
      <Link href={href} className={baseClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button {...props} className={baseClassName}>
      {children}
    </button>
  );
}

    