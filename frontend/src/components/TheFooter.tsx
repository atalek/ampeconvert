import { Link } from 'react-router-dom'

function TheFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='border-t-2 py-4 w-full '>
      <div className='max-w-6xl mx-auto text-center '>
        <Link
          to='https://github.com/atalek/ampeconvert'
          target='_blank'
          className='text-slate-800  mt-16 md:text-lg'>
          © {currentYear} ampeConvert - Made by atalek
          <i className='fa-brands fa-github ml-1'></i>
        </Link>
      </div>
    </footer>
  )
}
export default TheFooter
