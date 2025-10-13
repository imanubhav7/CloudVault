import React from "react";
import Thumbnail from "./Thumbnail";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import FormattedDateTime from "./FormattedDateTime";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const ImageThumbnail = ({ file }) => (
 
    <div className="file-details-thumbnail">
      <Thumbnail type={file.type} extension={file.extension} url={file.url} />

      <div className="flex flex-col">
        <p className="subtitle-2 mb-1">{file.name}</p>
        {/* <p>{convertFileSize(file.size)}</p> */}
        <FormattedDateTime date={file.$createdAt} className="caption" />
      </div>
    </div>
 
)

const DetailRow = ({label, value}) => (
    <div className="flex">
        <p className="body-2 w-[30%] text-light-100">{label}</p>
        <p className="subtitle-2 flex-1">{value}</p>
    </div>
)

// File Details 

export const FileDetails = ({ file }) => {
  return(
  <> 
  <ImageThumbnail file={file} />
  <div className="space-y-3 px-4">
  <DetailRow label="Format:" value={file.extension}/>
  <DetailRow label="Size:" value={convertFileSize(file.size)}/>
  <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)}/>

  </div>
  </>
  )
};


// ShareFile 
export const ShareFile = ({file, onInputChange, onRemove}) => {
  return (
    <>
      <ImageThumbnail file={file}/>
      <div className="mt-2 space-y-2">
        <p className="subtitle-2 pl-1 text-light-100">Share file with other users:</p>

        <Input type="email" placeholder="Enter email address"
        className='w-full shad-no-focus h-[52px] px-4 shadow-drop-1 rounded-full border body-1'
        onChange={(e) => onInputChange(e.target.value.trim().split(",")) }
        />

        <div className="pt-4">
            <div className="flex justify-between">
                <p className="subtitle-2 text-light-100">Share with</p>
                <p className="subtitle-2 text-light-200">{file.users.length} users</p>
            </div>
            <ul className="pt-2">
                {file.users.map((email)=>(
                    <li key={email} className="flex justify-between items-center gap-2">
                      <p className="subtitle-2">{email}</p>
                      <Button onClick = {() => onRemove(email)} 
                        className='rounded-full bg-transparent text-light-100 shadow-none hover:bg-transparent'
                        >
                        <Image
                        src='/assets/icons/remove.svg'
                        alt="remove"
                        width={24}
                        height={24}
                        className="remove-icon"
                        />
                      </Button>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </>
  )
}
