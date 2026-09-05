import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const palettes = {
  blue: ['bg-amber/25', 'bg-grape/20'],
  warm: ['bg-coral/25', 'bg-sunbeam/25'],
  mixed: ['bg-mint/25', 'bg-grape/20'],
}

export default function GradientBlobs({ variant = 'blue', className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yA = useTransform(scrollYProgress, [0, 1], [-40, 60])
  const yB = useTransform(scrollYProgress, [0, 1], [40, -60])
  const [colorA, colorB] = palettes[variant] || palettes.blue

  return (
    <div ref={ref} className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <motion.div
        style={{ y: yA }}
        className={`absolute -left-24 -top-24 h-72 w-72 rounded-full ${colorA} blur-3xl`}
      />
      <motion.div
        style={{ y: yB }}
        className={`absolute -right-16 top-1/3 h-80 w-80 rounded-full ${colorB} blur-3xl`}
      />
    </div>
  )
}
