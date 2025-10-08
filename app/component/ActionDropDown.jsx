"use client";
import { renameFile } from "@/action/file-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { actionsDropdownItems } from "@/constansts";
import { constructDownloadUrl } from "@/lib/utils";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { FileDetails } from "./ActionsModalContent";

const ActionDropDown = ({ file }) => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [action, setAction] = useState(null);
  const[name, setName] = useState(file.name)
  const [isLoading, setIsLoading] = useState(false)
  const path = usePathname()

  const closeAllModals = () => {
    setIsModelOpen(false)
    setIsDropDownOpen(false)
    setAction(null)
    setName(file.name)

  }

  const handleAction= async () => {
    if(!action) return;
    setIsLoading(true)
    let success = false;
    const actions = {
      rename: () => renameFile({fileId: file.$id,name,extension:file.extension, path}),
      
      share:() => console.log("Share"),
      delete : () => console.log("Delete")

    }
    // console.log(success)
    success = await actions[action.value]();
    if(success) closeAllModals();

    setIsLoading(false)
  }
 
  const renderDialogContent = () => {
    if(!action) return null;
    const {label, value} = action
    return (

      <DialogContent className='shad-dialog button'>
        <DialogHeader>
          <DialogTitle>
            {label}
          </DialogTitle>
          {value === 'rename' && (<Input type='text' value={name}
          onChange={(e) => setName(e.target.value)}
          />)}

          {value && 'details' && <FileDetails file={file}/>}

        </DialogHeader>
        {['rename', 'delete', 'share'].includes(value) && (
          <DialogFooter className='flex flex-col gap-3 md:flex-row '>
            <Button onClick={closeAllModals} className='h-[52px] flex-1 rounded-full bg-white text-light-100 hover:bg-transparent'>Cancel</Button>
            <Button className='modal-submit-button' onClick={handleAction}>
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                src='assets/icons/loader.svg'
                height={24}
                width={24}
                alt="loader"
                />
                
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModelOpen} onOpenChange={setIsModelOpen}>
      <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="assets/icons/dots.svg"
            alt="dots"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate ">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              className="cursor-pointer w-40"
              onClick={() => {
                setAction(actionItem);
                if (
                  ["rename, share, delete, details".includes(actionItem.value)]
                ) {
                  setIsModelOpen(true);
                }
              }}
            >
              {actionItem.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-3"
                >
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropDown;
