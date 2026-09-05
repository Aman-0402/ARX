import { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'

export default function Counter({ value, suffix = '', className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const numeric = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0
  const prefix = String(value).match(/^\D*/)?.[0] || ''
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { duration: 1200, bounce: 0 })
  const nodeRef = useRef(null)

  useEffect(() => {
    if (inView) motionValue.set(numeric)
  }, [inView, numeric, motionValue])

  useEffect(() => {
    return spring.on('change', (latest) => {
      if (nodeRef.current) {
        nodeRef.current.textContent = `${prefix}${Math.round(latest)}${suffix}`
      }
    })
  }, [spring, prefix, suffix])

  return (
    <motion.span ref={ref} className={className}>
      <span ref={nodeRef}>{prefix}0{suffix}</span>
    </motion.span>
  )
}
