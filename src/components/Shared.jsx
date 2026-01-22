import { motion as Motion } from 'framer-motion';
import { cn } from '../utils/cn';

export const Card = ({ children, className, delay = 0 }) => (
  <Motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={cn(
      'bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl',
      className
    )}
  >
    {children}
  </Motion.div>
);

export const CustomButton = ({
  children,
  onClick,
  className,
  variant = 'primary',
  icon: Icon,
}) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20',
    secondary:
      'bg-white/10 hover:bg-white/20 text-white border border-white/20',
    accent:
      'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20',
  };

  return (
    <Motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all shadow-lg',
        variants[variant],
        className
      )}
    >
      {Icon && <Icon size={20} />}
      {children}
    </Motion.button>
  );
};
