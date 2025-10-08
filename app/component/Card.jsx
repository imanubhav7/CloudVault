import Link from "next/link";
import React from "react";
import Thumbnail from "./Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "./FormattedDateTime";
import ActionDropDown from "./ActionDropDown";

const Card = ({ file }) => {
  return (
    <Link href={file.url} target="blank" className="file-card ">
      <div className="flex justify-between">
        <Thumbnail
          type={file.type}
          url={file.url}
          extension={file.extension}
          className="!size-20"
          imageClassName="!size-11"
        />
        <div className="flex flex-col items-end justify-between">
          <ActionDropDown file={file}/>
          <p className="body-1">{convertFileSize(file.size)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-light-100">
        <p className="subtitle-2 line-clamp-1">{file.name}</p>
        <FormattedDateTime date={file.$createdAt}
        className='text-light-100 body-2'
        />
            
      </div>
    </Link>
  );
};

export default Card;
