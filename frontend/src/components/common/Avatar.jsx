import { forwardRef } from 'react';

const Avatar = forwardRef(({
  src,
  alt = 'Avatar',
  size = 'md',
  className = '',
  ring = false,
  ringType = 'default',
  ...props
}, ref) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24',
  };

  const ringClasses = {
    default: 'p-0.5 bg-gradient-to-tr from-primary-500 via-secondary-500 to-accent-500 rounded-full',
    story: 'p-0.5 bg-gradient-to-tr from-secondary-500 via-primary-500 to-accent-500 rounded-full',
    none: '',
  };

  const avatarElement = (
    <div
      ref={ref}
      className={`
        ${sizeClasses[size]}
        rounded-full overflow-hidden bg-gray-100 flex-shrink-0
        ${className}
      `}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-accent-400 text-white font-semibold">
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );

  if (ring && ringType !== 'none') {
    return (
      <div className={ringClasses[ringType]}>
        {avatarElement}
      </div>
    );
  }

  return avatarElement;
});

Avatar.displayName = 'Avatar';

export default Avatar;
