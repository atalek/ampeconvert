export enum Fit {
  COVER = 'cover',
  CONTAIN = 'contain',
  FILL = 'fill',
  INSIDE = 'inside',
  OUTSIDE = 'outside',
}

export enum Strip {
  YES = 'yes',
  NO = 'no',
}

export type FileEntry = {
  file?: File
  name: string
  format: string
  finished: boolean
  width: string
  height: string
  fit: Fit
  strip: Strip
  imageUrl?: string
  newName?: string
  newFormat?: string
  newSize?: number
}

export type ConvertedImageData = {
  name: string
  imageUrl: string
  newName: string
  newFormat: string
  newSize: number
}
