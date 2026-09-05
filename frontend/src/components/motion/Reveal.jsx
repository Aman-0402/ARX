import { motion } from 'framer-motion'

export default function Reveal({
  children,
  as = 'div',
  delay = 0,
  y = 24,
  className = '',
  once = true,
}) {
  const Component = motion[as] || motion.div

  return (
    <Component
      initial={{ opacity: 0, y, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Component>
  )
}
