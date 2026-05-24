import '@mantine/core/styles.css'
import './style.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router'
import { Header } from './components/Header'

const queryClient = new QueryClient()

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Calendar</h1>
    </div>
  ),
})

const createMeetingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create',
  component: () => (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Create Meeting</h1>
    </div>
  ),
})

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin</h1>
    </div>
  ),
})

const routeTree = rootRoute.addChildren([indexRoute, createMeetingRoute, adminRoute])

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