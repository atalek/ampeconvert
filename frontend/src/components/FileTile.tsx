import Loader from './Loader'
import OptionsModal from './OptionsModal'
import ImageModal from './ImageModal'
import { useCallback } from 'react'
import { FileEntry } from '../types'

function FileTile({
  file,
  index,
  convertOptions,
  isLoading,
  changeFileFormat,
  onRemove,
  applySettingsToAllFiles,
  updateFile,
}: {
  file: FileEntry
  index: number
  convertOptions: string[]
  isLoading: boolean
  changeFileFormat: (fileName: string, newFormat: string) => void
  onRemove: () => void
  applySettingsToAllFiles: (editedFile: FileEntry) => void
  updateFile: (index: number, newValues: Partial<FileEntry>) => void
}) {
  function handleFormatChange(e: React.ChangeEvent<HTMLSelectElement>) {
    changeFileFormat(file.name, e.target.value)
  }

  const updateThisFile = useCallback(
    (newValues: Partial<FileEntry>) => {
      updateFile(index, newValues)
    },
    [updateFile, index],
  )

  return (
    <div className='max-w-6xl mx-auto w-full border flex flex-col gap-3 md:flex-row items-center md:py-1 px-2 shadow-md md:h-[60px] mb-4 py-3'>
      <div className='flex items-center md:w-[420px] w-full relative md:justify-start'>
        <div className='flex items-center gap-2 px-2'>
          <i className='fa-solid fa-file-image md:mx-4'></i>
          <span className='text-ellipsis whitespace-nowrap overflow-hidden md:w-[400px] w-[240px]'>
            {file.name}
          </span>
        </div>
        <button className='md:hidden block absolute right-0' onClick={onRemove}>
          <i className='fa-solid fa-xmark text-red-600'></i>
        </button>
      </div>
      <div className='flex items-center justify-center gap-1 md:w-[330px] w-full'>
        <i className='fa-solid fa-arrows-rotate mr-1'></i>
        <span className='text-sm font-semibold inline-block text-center'>
          {file.finished ? 'Converted ' : 'Convert'} to
          {file.finished ? ` ${file.newFormat}` : ''}
        </span>
        {!file.finished && (
          <>
            <select
              name='format'
              id='format'
              value={file.format}
              onChange={handleFormatChange}
              className='flex items-center justify-center rounded border  border-gray-800  mx-1 px-4 py-2 font-bold bg-white text-black cursor-pointer'>
              {convertOptions.map(option => {
                return (
                  <option value={option} key={option}>
                    {option}
                  </option>
                )
              })}
            </select>
            {!isLoading && !file.finished && (
              <OptionsModal
                file={file}
                key={file.name}
                updateFile={updateThisFile}
                applySettingsToAllFiles={applySettingsToAllFiles}
              />
            )}
          </>
        )}
      </div>
      <div className='flex flex-row justify-start md:w-[100px]'>
        {!file.finished && isLoading && (
          <span className='bg-orange-400 p-1 text-sm  rounded'>CONVERTING</span>
        )}
        {file.finished && (
          <ImageModal
            key={index}
            imageName={file.newName}
            imageUrl={file?.imageUrl}
          />
        )}
      </div>
      <div className='flex flex-row justify-end md:w-[248px] '>
        {file.finished && (
          <div className='group relative'>
            <a
              href={file.imageUrl}
              download={file.newName}
              target='_blank'
              className='flex  items-center bg-green-600 hover:bg-green-800 px-7 py-2 rounded mx-2 text-white'>
              <i className='fa-solid fa-cloud-arrow-down mr-2'></i>
              Download
            </a>

            <div className='hidden md:block absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-56 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out whitespace-pre-wrap'>
              {file.newName} ({`${file?.newSize?.toFixed(2)} KB`})
            </div>
          </div>
        )}
        {!file.finished && isLoading && (
          <Loader className={'text-orange-500 mx-3'} />
        )}

        <button className='hidden md:block' onClick={onRemove}>
          <i className='fa-solid fa-xmark text-red-600'></i>
        </button>
      </div>
    </div>
  )
}
export default FileTile
