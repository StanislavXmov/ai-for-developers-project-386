import { Link } from '@tanstack/react-router'
import { Group, Text } from '@mantine/core'

export function Header() {
  return (
    <header className="bg-white border-b border-black/10 px-6 py-4">
      <Group justify="space-between" align="center">
        <Group gap="sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-black"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          <Text fw={500} size="lg" c="dark">Calendar</Text>
        </Group>
        <Group gap="8">
          <Link
            to="/create"
            className="text-sm text-black/60 hover:text-black transition-colors duration-150"
          >
            Create meeting
          </Link>
          <span className="text-black/20">|</span>
          <Link
            to="/admin"
            className="text-sm text-black/60 hover:text-black transition-colors duration-150"
          >
            Admin
          </Link>
        </Group>
      </Group>
    </header>
  )
}