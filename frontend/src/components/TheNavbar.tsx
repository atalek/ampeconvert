import { Link } from 'react-router-dom'
import logo from '../assets/convert.webp'

function TheNavbar() {
  return (
    <header className='w-full bg-slate-800 p-4'>
      <nav className='flex mx-auto items-center justify-between max-w-6xl'>
        <Link
          to='/'
          className='text-white text-2xl font-bold flex items-center gap-4'>
          <img className='h-8 w-8' src={logo} alt='conversion logo' />
          ampeConvert
        </Link>
      </nav>
    </header>
  )
}
export default TheNavbar
