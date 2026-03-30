'use client'

import { useTransition } from 'react'
import { toggleCreative } from '@/app/actions/ads'

interface CreativeToggleProps {
  creativeId: string
  campaignId: string
  isActive: boolean
}

export function CreativeToggle({ creativeId, campaignId, isActive }: CreativeToggleProps) {
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      await toggleCreative(creativeId, campaignId, !isActive)
    })
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors disabled:opacity-50 ${
        isActive
          ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
      }`}
    >
      {isPending ? '...' : isActive ? 'Aktif' : 'Pasif'}
    </button>
  )
}
