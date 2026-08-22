import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/common/ScrollToTop'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import RequireAuth from './admin/components/RequireAuth'

// L'admin (formulaires, CRUD catalogue…) n'est utilisé que par la
// restauratrice — on ne le télécharge donc que si quelqu'un visite
// réellement /admin, au lieu de l'inclure dans le fichier chargé par
// chaque visiteur du site public.
const AdminLogin = lazy(() => import('./admin/pages/Login'))
const AdminResetPassword = lazy(() => import('./admin/pages/ResetPassword'))
const AdminLayout = lazy(() => import('./admin/pages/AdminLayout'))
const AdminProducts = lazy(() => import('./admin/pages/AdminProducts'))
const AdminCategories = lazy(() => import('./admin/pages/AdminCategories'))
const AdminMessages = lazy(() => import('./admin/pages/AdminMessages'))
const AdminSettings = lazy(() => import('./admin/pages/AdminSettings'))

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg text-sm text-muted">
      Chargement…
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/panier" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin/reinitialiser-mot-de-passe"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminResetPassword />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <Suspense fallback={<AdminFallback />}>
                <AdminLayout />
              </Suspense>
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="produits" replace />} />
          <Route
            path="produits"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminProducts />
              </Suspense>
            }
          />
          <Route
            path="categories"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminCategories />
              </Suspense>
            }
          />
          <Route
            path="messages"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminMessages />
              </Suspense>
            }
          />
          <Route
            path="reglages"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminSettings />
              </Suspense>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
