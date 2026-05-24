import '@mantine/core/styles.css'
import './style.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router'
import { Header } from './components/Header'
import { IndexPage } from './pages/IndexPage'
import { CreatePage } from './pages/CreatePage'
import { AdminPage } from './pages/AdminPage'

const queryClient = new QueryClient()

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-50">
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
  component: IndexPage,
})

const createMeetingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create',
  component: CreatePage,
})

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
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