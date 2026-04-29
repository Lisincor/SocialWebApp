import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}, ref) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-semibold transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantClasses = {
    primary: `
      bg-primary-500 text-white
      hover:bg-primary-600 active:bg-primary-700 active:scale-[0.98]
    `,
    secondary: `
      bg-gray-100 text-dark-100
      hover:bg-gray-200 active:bg-gray-300 active:scale-[0.98]
    `,
    outline: `
      border-2 border-primary-500 text-primary-500 bg-transparent
      hover:bg-primary-50 active:bg-primary-100 active:scale-[0.98]
    `,
    ghost: `
      bg-transparent text-dark-100
      hover:bg-gray-100 active:bg-gray-200
    `,
    danger: `
      bg-red-500 text-white
      hover:bg-red-600 active:bg-red-700 active:scale-[0.98]
    `,
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-[16px]',
    md: 'px-5 py-2.5 text-base rounded-[20px]',
    lg: 'px-6 py-3 text-lg rounded-[24px]',
    full: 'px-6 py-3 text-base rounded-[20px] w-full',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>加载中...</span>
        </>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
