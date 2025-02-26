"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/spinner"

import { delay } from "@/lib/utils"

export function ButtonSpinner() {
  const [isLoading, setIsLoading] = useState(false)

  async function onClick() {
    setIsLoading(() => true)
    await delay(2000)
    setIsLoading(() => false)
  }

  return (
    <Button type="button" disabled={isLoading} onClick={onClick} className="relative">
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key="spinner"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: isLoading ? 0 : -20, opacity: isLoading ? 1 : 0 }}
          transition={{
            y: { type: "spring", mass: 0.8, damping: 10, stiffness: 400 },
            opacity: { duration: 0.12 },
          }}
          className="absolute"
        >
          <Spinner size="xs" className="duration-500 ease-linear" />
        </motion.div>
        <motion.span
          key="text"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: isLoading ? 20 : 0, opacity: isLoading ? 0 : 1 }}
          transition={{
            y: { type: "spring", mass: 0.8, damping: 10, stiffness: 400 },
            opacity: { duration: 0.12 },
          }}
        >
          Click me
        </motion.span>
      </AnimatePresence>
    </Button>
  )
}
