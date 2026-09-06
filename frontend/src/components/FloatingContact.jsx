import { motion } from 'framer-motion'

export default function FloatingContact() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <motion.a
        href="tel:+918317818107"
        aria-label="Call ARX Infotech"
        initial={{ opacity: 0, scale: 0.6, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-amber shadow-lg shadow-ink/20"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
          <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02z" />
        </svg>
      </motion.a>

      <motion.a
        href="https://api.whatsapp.com/send/?phone=918317818107"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ opacity: 0, scale: 0.6, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.65, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-mint text-white shadow-lg shadow-mint/30"
      >
        <svg viewBox="0 0 32 32" fill="currentColor" className="h-9 w-9">
          <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.24.62 4.34 1.68 6.14L4 29l8.03-1.63a12.9 12.9 0 0 0 4 .63h.01c6.62 0 12.02-5.4 12.02-12.02C28.06 8.4 22.66 3 16.02 3zm0 21.94h-.01a10 10 0 0 1-3.6-.68l-.26-.1-4.76.97 1-4.64-.17-.27a9.86 9.86 0 0 1-1.5-5.2C6.72 9.5 10.9 5.32 16.02 5.32c2.63 0 5.1 1.03 6.96 2.9a9.8 9.8 0 0 1 2.88 6.96c0 5.13-4.18 9.31-9.34 9.31l.51-.55zm5.13-6.95c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.63.14-.19.28-.73.91-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.4-1.66-1.56-1.94-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.63-1.53-.87-2.1-.23-.55-.46-.47-.63-.48-.16 0-.35-.01-.54-.01s-.49.07-.75.35c-.26.28-.98.96-.98 2.35s1 2.72 1.14 2.91c.14.19 1.97 3.01 4.77 4.22.67.29 1.19.46 1.6.59.67.21 1.28.18 1.76.11.54-.08 1.66-.68 1.89-1.34.23-.65.23-1.21.16-1.33-.07-.12-.26-.19-.54-.33z" />
        </svg>
      </motion.a>
    </div>
  )
}
