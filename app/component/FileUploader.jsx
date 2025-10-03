"use client";
import { Button } from "@/components/ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Thumbnail from "./Thumbnail";
import { MAX_FILE_SIZE } from "@/constansts";
import { toast } from "sonner";
import { uploadFiles } from "@/action/file-action";
import { usePathname } from "next/navigation";

const FileUploader = ({ ownerId, className }) => {
  const [files, setFiles] = useState([]);
  const path = usePathname();

  
  const onDrop = useCallback(async (acceptedFiles) => {
    setFiles(acceptedFiles);

    const uploadPromises = acceptedFiles.map(async (file) => {
      if (file.size > MAX_FILE_SIZE) {
        setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
        return toast.error(`${file.name} is too large. Max file limit is 50MB`);
      }
      return uploadFiles({ file,  ownerId, path }).then((uploadFile) => {
        if (uploadFile) {
          setFiles((prevFiles) =>
            prevFiles.filter((f) => {
              f.name !== file.name;
            })
          );
        }
      });
    });
    await Promise.all(uploadPromises)
  }, [ownerId, path]);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // File Remove Fn
  const handleRemoveFile = (e, fileName) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button
        type="button"
        className={cn(
          "primary-btn h-[52px] gap-2 px-10 shadow-drop-1",
          className
        )}
      >
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          height={24}
          width={24}
        />{" "}
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="fixed bottom-10 right-10 z-50 flex size-full h-fit max-w-[480px] flex-col gap-3 rounded-[20px] bg-white p-7 shadow-drop-3">
          <h4 className="h4 text-light-100">Uploading...</h4>
          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl p-3 shadow-drop-3"
              >
                {/* Thumbnail  */}
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className="subtitle-2 max-w-[300px] mb-2 ">
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      alt="loader"
                      width={80}
                      height={26}
                    />
                  </div>
                </div>

                <Image
                  src="/assets/icons/remove.svg"
                  height={24}
                  width={24}
                  alt="Remove"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
