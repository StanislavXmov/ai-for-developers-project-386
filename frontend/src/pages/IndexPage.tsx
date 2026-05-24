import { Title, Text } from '@mantine/core'

export function IndexPage() {
  return (
    <div className="p-8">
      <Title order={1} className="text-3xl font-medium text-black mb-2">Welcome to Calendar</Title>
      <Text c="dimmed">Select a page from the header to get started</Text>
    </div>
  )
}