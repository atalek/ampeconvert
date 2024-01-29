import { useEffect, useState } from 'react'
import { FileEntry, Fit, Strip } from '../types'

function OptionsModal({
  file,
  updateFile,
  applySettingsToAllFiles,
}: {
  file: FileEntry
  updateFile: (newValues: Partial<FileEntry>) => void
  applySettingsToAllFiles: (editedFile: FileEntry) => void
}) {
  const [showModal, setShowModal] = useState(false)
  const [width, setWidth] = useState(file.width)
  const [height, setHeight] = useState(file.height)
  const [fit, setFit] = useState(file.fit)
  const [strip, setStrip] = useState(file.strip)

  useEffect(() => {
    setWidth(file.width)
    setHeight(file.height)
    setFit(file.fit)
    setStrip(file.strip)
  }, [file])

  function handleWidthChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newWidth = event.target.value
    setWidth(newWidth)
    updateFile({ width: newWidth })
  }

  function handleHeightChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newHeight = event.target.value
    setHeight(newHeight)
    updateFile({ height: newHeight })
  }

  function handleFitChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newFit = event.target.value as Fit
    setFit(newFit)
    updateFile({ fit: newFit })
  }

  function handleStripChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newStrip = event.target.value as Strip
    setStrip(newStrip)
    updateFile({ strip: newStrip })
  }

  return (
    <>
      <button
        className='px-4 py-2 border border-gray-800 rounded hover:bg-gray-800 hover:text-white mx-1'
        onClick={() => setShowModal(true)}>
        <i className='fa-solid fa-wrench'></i>
      </button>
      {showModal ? (
        <div className='fixed inset-0 z-40' onClick={() => setShowModal(false)}>
          <div className='justify-center items-center flex overflow-x-hidden overflow-y-scroll fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative my-6 mx-auto max-w-4xl w-full'>
              <div
                onClick={event => event.stopPropagation()}
                className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                <div className='flex items-start justify-between p-5 border-b border-solid  rounded-t mt-2'>
                  <h3 className='text-3xl font-semibold'>Options</h3>
                  <button
                    className='border px-3 py-1.5 rounded-lg hover:bg-slate-800 hover:text-white'
                    onClick={() => setShowModal(false)}>
                    X
                  </button>
                </div>
                <div className='relative p-2 border-b border-solid'>
                  <div className='grid items-center justify-center md:grid-cols-2 px-4'>
                    <div className='flex md:justify-between pt-2 pb-6 px-4 '>
                      <p className='text-lg text-slate-600 pt-3 w-[53px]'>
                        Width
                      </p>
                      <div className='flex flex-col px-3'>
                        <input
                          id='width'
                          type='number'
                          className='p-3 flex md:w-[260px] border rounded mb-1'
                          value={width}
                          onChange={handleWidthChange}
                        />
                        <label
                          htmlFor='width'
                          className='text-sm text-slate-400'>
                          Output width in pixels.
                        </label>
                      </div>
                    </div>
                    <div className='flex md:justify-between pt-2 pb-6 px-4'>
                      <p className='text-lg text-slate-600 pt-3 w-[53px]'>
                        Height
                      </p>
                      <div className='flex flex-col px-3'>
                        <input
                          id='height'
                          type='number'
                          className='p-3 flex md:w-[260px] border rounded mb-1'
                          value={height}
                          onChange={handleHeightChange}
                        />
                        <label
                          htmlFor='height'
                          className='text-sm text-slate-400'>
                          Output height in pixels.
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='p-2 border-b border-solid'>
                  <div className='grid md:grid-cols-2  md:px-4'>
                    <div className='flex md:justify-between pt-2 pb-6 md:px-4  mx-auto md:mx-0'>
                      <p className='text-lg text-slate-600 pt-3 w-[53px] mr-2'>
                        Fit
                      </p>
                      <div className='flex flex-col md:px-3'>
                        <select
                          value={fit}
                          onChange={handleFitChange}
                          id='select'
                          className='p-3 flex w-[320px] md:w-[260px]  border rounded mb-1 bg-white'>
                          <option value={Fit.COVER}>cover</option>
                          <option value={Fit.CONTAIN}>contain</option>
                          <option value={Fit.FILL}>fill</option>
                          <option value={Fit.INSIDE}>inside</option>
                          <option value={Fit.OUTSIDE}>outside</option>
                        </select>
                        <label
                          htmlFor='fit'
                          className='text-xs text-slate-400 w-[320px] md:w-[260px]'>
                          Sets the mode of resizing the image.
                          <br />
                          <span className='text-slate-800'>“Cover”:</span>
                          Preserving aspect ratio, attempt to ensure the image
                          covers both provided dimensions by cropping/clipping
                          to fit. <br />
                          <span className='text-slate-800'>“Contain”:</span>
                          Preserving aspect ratio, contain within both provided
                          dimensions using "letterboxing" where necessary.
                          <br />
                          <span className='text-slate-800'>“Fill”: </span>
                          Ignore the aspect ratio of the input and stretch to
                          both provided dimensions.
                          <br />
                          <span className='text-slate-800'>"Inside":</span>
                          Preserving aspect ratio, resize the image to be as
                          large as possible while ensuring its dimensions are
                          less than or equal to both those specified.
                          <br />
                          <span className='text-slate-800'>"Outside":</span>
                          Preserving aspect ratio, resize the image to be as
                          small as possible while ensuring its dimensions are
                          greater than or equal to both those specified.
                        </label>
                      </div>
                    </div>
                    <div className='flex md:mx-0 mx-auto md:justify-between pt-2 pb-6 md:px-4'>
                      <p className='text-lg text-slate-600 pt-3 w-[53px]'>
                        Strip
                      </p>
                      <div className='flex  flex-col px-3'>
                        <div className='w-[320px]  md:w-[260px]'>
                          <div className='flex flex-row items-center '>
                            <label
                              htmlFor='stripChoice1'
                              className='w-[23px] mr-6'>
                              Yes
                            </label>
                            <input
                              type='radio'
                              id='stripChoice1'
                              name='strop'
                              value={Strip.YES}
                              checked={strip === Strip.YES}
                              onChange={handleStripChange}
                            />
                          </div>

                          <div className='flex flex-row items-center'>
                            <label
                              htmlFor='contactChoice2'
                              className='w-[23px] mr-6'>
                              No
                            </label>

                            <input
                              type='radio'
                              id='contactChoice2'
                              name='strop'
                              value={Strip.NO}
                              checked={strip === Strip.NO}
                              onChange={handleStripChange}
                            />
                          </div>

                          <p className='text-xs text-slate-400 mt-2'>
                            Remove any metadata such as EXIF data.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex items-center justify-between p-6 border-t border-solid border-blueGray-200 rounded-b'>
                  <button
                    onClick={() => {
                      applySettingsToAllFiles(file)
                      setShowModal(false)
                    }}
                    className='bg-green-600 hover:bg-green-800 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg mr-1 mb-1'>
                    Apply to all
                  </button>
                  <div className='flex items-center '>
                    <button
                      className='text-red-500 hover:bg-red-600 hover:text-white hover:rounded background-transparent font-bold uppercase px-6 py-3 text-sm mr-1 mb-1'
                      type='button'
                      onClick={() => setShowModal(false)}>
                      Close
                    </button>
                    <button
                      className='bg-green-600 hover:bg-green-800 text-white  font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg mr-1 mb-1 '
                      type='button'
                      onClick={() => setShowModal(false)}>
                      Okay
                    </button>
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

export default OptionsModal
