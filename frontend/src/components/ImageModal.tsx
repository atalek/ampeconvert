import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const dropIn = {
  hidden: {
    y: '-5vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.2,
      type: 'spring',
      damping: 35,
      stiffness: 300,
    },
  },
  exit: {
    y: '-45vh',
    opacity: 0,
    duration: 0.1,
  },
}

function ImageModal({
  imageUrl,
  imageName,
}: {
  imageUrl?: string
  imageName?: string
}) {
  const [showImage, setShowImage] = useState(false)
  return (
    <>
      <button
        className='bg-green-500 p-1 text-sm  rounded'
        onClick={() => setShowImage(prev => !prev)}>
        PREVIEW
      </button>
      <AnimatePresence initial={false} mode='wait'>
        {showImage ? (
          <motion.div
            key='backdrop'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-40'
            onClick={() => setShowImage(false)}>
            <motion.div
              key='modal'
              variants={dropIn}
              initial='hidden'
              animate='visible'
              exit='exit'
              className='justify-center items-center flex overflow-x-hidden overflow-y-scroll fixed inset-0 z-50 outline-none focus:outline-none'>
              <div className='relative my-6 mx-auto max-w-4xl w-full'>
                <div
                  onClick={event => event.stopPropagation()}
                  className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                  <div className='relative flex items-center justify-center p-4 border-b border-solid'>
                    <img src={imageUrl} alt={imageName} />
                  </div>
                  <div className='flex md:flex-row flex-col gap-4 items-center justify-between p-6 border-t border-solid  rounded-b'>
                    <p className='left-0 lg:text-lg md:text-md text-sm text-slate-800 truncate'>
                      {imageName}
                    </p>
                    <div className='inline-flex'>
                      <button
                        className='text-red-500 hover:bg-red-600 hover:text-white hover:rounded  background-transparent font-bold uppercase px-6 py-3  text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                        type='button'
                        onClick={() => setShowImage(prev => !prev)}>
                        Close
                      </button>
                      <a
                        href={imageUrl}
                        download={imageName}
                        target='_blank'
                        className='bg-green-600 hover:bg-green-800 text-white  font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                        type='button'
                        onClick={() => setShowImage(prev => !prev)}>
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default ImageModal
