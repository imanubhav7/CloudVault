import { cn, getFileIcon } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

const Thumbnail = ({type,extension,url,imageClassName}) => {
    const isImage = type === 'image' && extension !== 'svg'
  return (
    <figure className={cn('flex-center size[50px] min-w-[50px] overflow-hidden rounded-full bg-brand/10')}>
        <Image src={isImage ? url: getFileIcon(extension,type)}
        alt='thumbnail'
        width={100}
        height={100}
        className={cn('size-8 object-contain', imageClassName, isImage && 'size-10 object-cover object-center')}/>
    </figure>
  )
}

export default Thumbnail
