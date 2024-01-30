import { useState } from 'react'

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
      {showImage ? (
        <div className='fixed inset-0 z-40' onClick={() => setShowImage(false)}>
          <div className='justify-center items-center flex min-h-screen overflow-x-hidden overflow-y-scroll fixed inset-0 z-50 '>
            <div className=' my-6 mx-auto max-w-4xl w-full'>
              <div
                onClick={event => event.stopPropagation()}
                className='border-0 rounded-lg shadow-lg  flex flex-col w-full bg-white '>
                <div className=' flex items-center justify-center p-4 border-b border-solid'>
                  <img src={imageUrl} alt={imageName} />
                </div>
                <div className='flex md:flex-row flex-col gap-4 items-center justify-between p-6 border-t border-solid  rounded-b'>
                  <p className='left-0 lg:text-lg md:text-md text-sm text-slate-800 truncate'>
                    {imageName}
                  </p>
                  <div className='inline-flex'>
                    <button
                      className='text-red-500 hover:bg-red-600 hover:text-white hover:rounded  background-transparent font-bold uppercase px-6 py-3  md:text-sm text-xs  mr-1 mb-1  '
                      type='button'
                      onClick={() => setShowImage(prev => !prev)}>
                      Close
                    </button>
                    <a
                      href={imageUrl}
                      download={imageName}
                      target='_blank'
                      className='bg-green-600 hover:bg-green-800 text-white  font-bold uppercase md:text-sm text-xs px-6 py-3 rounded shadow hover:shadow-lg  mr-1 mb-1  '
                      type='button'
                      onClick={() => setShowImage(prev => !prev)}>
                      Download
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
        </div>
      ) : null}
    </>
  )
}

export default ImageModal
