import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  children: React.ReactNode
}

const Button = ({
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}: ButtonProps) => {
  const buttonClass = `btn btn-${variant} ${className}`

  return (
    <button
      className={buttonClass}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;