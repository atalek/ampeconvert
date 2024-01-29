import { useState } from 'react'
import FileTile from '../components/FileTile'
import Loader from '../components/Loader'
import { FileEntry, Fit, Strip, ConvertedImageData } from '../types'

function HomeScreen() {
  const convertOptions = ['webp', 'png', 'jpeg', 'avif', 'gif']
  const allowedImageFormats = [
    '.png',
    '.jpeg',
    '.jpg',
    '.webp',
    '.gif',
    '.avif',
    '.svg',
  ]
  const acceptValue = allowedImageFormats.join(',') + ',*'

  const [globalFormat, setGlobalFormat] = useState(convertOptions[0])
  const [files, setFiles] = useState<FileEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const imageData = event.target.files

    if (imageData) {
      const newFiles = Array.from(imageData).filter(file => {
        if (file.size <= 4 * 1024 * 1024) {
          return true
        } else {
          setError('Image too large (maximum allowed 4 megabytes)')

          setTimeout(() => {
            setError('')
          }, 8000)

          return false
        }
      })

      setFiles(prevFiles => [
        ...prevFiles,
        ...newFiles.map(file => ({
          file,
          name: file.name,
          format: globalFormat,
          finished: false,
          width: '',
          height: '',
          fit: Fit.COVER,
          strip: Strip.NO,
        })),
      ])
    }
  }

  function changeFileFormat(fileName: string, newFormat: string) {
    setFiles(prevFiles =>
      prevFiles.map(file =>
        file.name === fileName ? { ...file, format: newFormat } : file,
      ),
    )
  }

  function changeGlobalFormat(newFormat: string) {
    setGlobalFormat(newFormat)
    setFiles(prevFiles =>
      prevFiles.map(file => ({ ...file, format: newFormat })),
    )
  }

  function removeFile(index: number) {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
  }

  function clearFiles() {
    setFiles([])
  }

  function applySettingsToAllFiles(editedFile: FileEntry) {
    const updatedFiles = files.map(file => {
      return {
        ...file,
        width: editedFile.width,
        height: editedFile.height,
        fit: editedFile.fit,
        strip: editedFile.strip,
      }
    })
    setFiles(updatedFiles)
  }

  function updateFile(index: number, newValues: Partial<FileEntry>) {
    setFiles(prevFiles =>
      prevFiles.map((file, i) =>
        i === index ? { ...file, ...newValues } : file,
      ),
    )
  }

  function downloadAll() {
    files.forEach(file => {
      if (file.finished) {
        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.src = file.imageUrl as string
        iframe.name = file.newName as string
        document.body.appendChild(iframe)
      }
    })
  }

  async function uploadFiles() {
    try {
      setIsLoading(true)
      const formData = new FormData()
      files
        .filter(fileEntry => !fileEntry.finished)
        .forEach((fileEntry, index) => {
          formData.append('files', fileEntry.file!)
          formData.append(`formats[${index}]`, fileEntry.format)
          formData.append(`widths[${index}]`, fileEntry.width?.toString())
          formData.append(`heights[${index}]`, fileEntry.height?.toString())
          formData.append(`fits[${index}]`, fileEntry.fit)
          formData.append(`strips[${index}]`, fileEntry.strip)
        })

      const res = await fetch('/api/v1/upload', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        const data = (await res.json()) as {
          convertedImageData: ConvertedImageData[]
        }

        setFiles(
          files.map(file => {
            const matchingFile = data.convertedImageData.find(
              (imageData: ConvertedImageData) => imageData.name === file.name,
            )
            return matchingFile
              ? {
                  ...file,
                  imageUrl: matchingFile.imageUrl,
                  finished: true,
                  newName: matchingFile.newName,
                  newSize: matchingFile.newSize,
                  newFormat: matchingFile.newFormat,
                }
              : file
          }),
        )
      }
    } catch (error) {
      const myError = error as Error
      setError(myError.message)
      setTimeout(() => {
        setError('')
      }, 8000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className='mx-auto max-w-7xl px-5 py-10 md:px-8 md:pt-16 lg:pt-24'>
      <div className=' mx-auto mb-8 w-full max-w-3xl text-center md:mb-12 lg:mb-16'>
        <h1 className='mb-4 text-4xl font-bold md:text-7xl'>Image Converter</h1>
        <p className='mx-auto mb-5 max-w-lg text-sm text-[#636262] sm:text-xl md:mb-6 lg:mb-8'>
          Effortlessly convert images across various formats. Control quality,
          size, and more. Start now!
        </p>
        <div className='flex flex-row gap-4 items-center justify-center'>
          <label htmlFor='format' className='text-xs text-[#636262] sm:text-xl'>
            Select a format to convert to
          </label>
          <select
            name='format'
            id='format'
            value={globalFormat}
            onChange={e => changeGlobalFormat(e.target.value)}
            className='flex items-center justify-center bg-white rounded border border-solid border-black px-6 py-3 font-bold text-black cursor-pointer'>
            {convertOptions.map(option => {
              return (
                <option value={option} key={option}>
                  {option}
                </option>
              )
            })}
          </select>
        </div>
      </div>
      {error && (
        <p className='text-red-600 text-lg font-semibold my-4 text-center'>
          {error}
        </p>
      )}

      {files.length === 0 ? (
        <div className=' max-w-6xl w-full mx-auto  flex items-center justify-center mt-8'>
          <label className='mr-5 inline-block rounded bg-red-600 px-4 py-4 text-center font-semibold text-white md:mr-6 lg:mr-8 cursor-pointer'>
            <input
              type='file'
              className='hidden'
              accept={acceptValue}
              multiple
              onChange={handleFileUpload}
            />
            <i className='fa-solid fa-file-image mr-2'></i> Select File
          </label>
        </div>
      ) : (
        <>
          {files.map((file, index) => {
            return (
              <FileTile
                key={index}
                file={file}
                index={index}
                changeFileFormat={changeFileFormat}
                convertOptions={convertOptions}
                onRemove={() => removeFile(index)}
                isLoading={isLoading}
                updateFile={updateFile}
                applySettingsToAllFiles={applySettingsToAllFiles}
              />
            )
          })}

          <div className='flex mx-auto flex-col gap-4 md:flex-row items-center  max-w-6xl w-full  mt-8'>
            <label className='whitespace-nowrap flex-inline rounded bg-gray-800 hover:bg-gray-600 px-8 py-2 text-center font-semibold text-white cursor-pointer md:w-52 w-full'>
              <input
                type='file'
                className='hidden'
                accept={acceptValue}
                multiple
                onChange={handleFileUpload}
              />
              <i className='fa-solid fa-file-image mr-2'></i> Upload more
            </label>
            {files.length > 0 && (
              <div className='flex flex-col gap-4 md:flex-row  w-full items-center justify-center'>
                <button
                  className='inline-flex items-center justify-center rounded  bg-red-700 hover:bg-red-800 px-6 py-3 text-center font-semibold text-white md:w-36 w-full '
                  onClick={clearFiles}>
                  <i className='fa-solid fa-eraser mr-2'></i>Clear
                </button>
                {files.filter(file => file.finished).length >= 2 && (
                  <>
                    <button
                      className='bg-green-600 hover:bg-green-800 text-white inline-flex items-center justify-center text-center font-bold  px-6 py-3 rounded shadow hover:shadow-lg outline-none md:w-48 w-full  '
                      onClick={downloadAll}>
                      <i className='fa-solid fa-download mr-2'></i>
                      Download all
                    </button>
                  </>
                )}
              </div>
            )}
            {files.some(file => !file.finished) && (
              <button
                className='inline-flex items-center justify-center rounded  bg-red-700 hover:bg-red-800 px-8 py-4 text-center font-semibold text-white md:w-36 w-full disabled:bg-red-900 disabled:cursor-not-allowed '
                disabled={isLoading}
                onClick={uploadFiles}>
                <i className='fa-solid fa-arrows-rotate mr-2'></i>
                {isLoading ? (
                  <div className='flex items-center  justify-center gap-1'>
                    <span>Converting</span>
                    <Loader />
                  </div>
                ) : (
                  'Convert'
                )}
              </button>
            )}
          </div>
        </>
      )}
    </main>
  )
}
export default HomeScreen
