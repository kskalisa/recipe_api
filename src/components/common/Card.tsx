// src/components/common/Card.tsx
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white rounded-2xl border border-gray-200 shadow-sm',
          'transition-all duration-300 hover:shadow-md'
        ),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
