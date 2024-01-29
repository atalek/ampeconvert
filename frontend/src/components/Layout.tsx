import { Outlet } from 'react-router-dom'
import TheNavbar from './TheNavbar'
import TheFooter from './TheFooter'

function Layout() {
  return (
    <div className='flex flex-col min-h-screen'>
      <div className=' flex-1'>
        <TheNavbar />
        <Outlet />
      </div>

      <TheFooter />
    </div>
  )
}

export default Layout
