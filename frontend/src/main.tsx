import '@mantine/core/styles.css'
import './style.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router'

const queryClient = new QueryClient()

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Vite + React + TanStack</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Edit <code>src/main.tsx</code> to get started.
      </p>
    </div>
  ),
})

const routeTree = rootRoute.addChildren([indexRoute])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const appElement = document.getElementById('app')!

if (!appElement.innerHTML.trim()) {
  createRoot(appElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <RouterProvider router={router} />
        </MantineProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}