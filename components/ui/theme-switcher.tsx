'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import { Toggle } from '@/components/ui/toggle'
import { MoonIcon } from '@/components/icons/moon'
import { SunDimIcon } from '@/components/icons/sun-dim'

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()
  return (
    <Toggle
      variant="outline"
      className="group data-[state=on]:hover:bg-muted size-9 rounded-full data-[state=on]:bg-transparent"
      pressed={theme === 'dark'}
      onPressedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <MoonIcon
        className="size-4 shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
        aria-hidden="true"
        size={20}
      />
      <SunDimIcon
        className="absolute size-4 shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
        aria-hidden="true"
        size={20}
      />
    </Toggle>
  )
}

export default ThemeSwitcher
