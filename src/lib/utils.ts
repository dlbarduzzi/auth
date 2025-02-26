import type { ClassValue } from "clsx"

import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
