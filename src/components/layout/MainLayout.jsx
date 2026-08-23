import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import GuidedTour from '../common/GuidedTour'
import ScrollToTopButton from '../common/ScrollToTopButton'

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <GuidedTour />
      <ScrollToTopButton />
    </div>
  )
}
