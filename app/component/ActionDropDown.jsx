"use client";
import { deleteFile, renameFile, updateFileUsers } from "@/action/file-action";
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
import { FileDetails, ShareFile } from "./ActionsModalContent";
import { toast } from "sonner";


const ActionDropDown = ({ file }) => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [action, setAction] = useState(null);
  const[name, setName] = useState(file.name)
  const [isLoading, setIsLoading] = useState(false)
  const path = usePathname()
  const [email,setEmail] = useState([]);
  

  const closeAllModals = () => {
    setIsModelOpen(false)
    setIsDropDownOpen(false)
    setAction(null)
    setName(file.name)

  }

  const handleAction= async () => {
    if(!action) return;
    setIsLoading(true)
    
    // let success = false;
    try {
         
    const actions = {
      rename: () => renameFile({fileId: file.$id,name,extension:file.extension, path}),
      
      share:() => updateFileUsers({fileId: file.$id, email, path, mode:'add'}),
      delete : () => deleteFile({fileId:file.$id, bucketFileId:file.bucketFileId, path})

    }
    // console.log(success)
    // success = await actions[action.value]();
    // if(success) closeAllModals();

    const fn = actions[action.value];
    if(!fn){
      toast.error("Invalid action selected ❌");
      setIsLoading(false);
      return;

    }
    const res = await fn();

    if(res?.success){
      toast.success(res.message || `${action.label} successfull`)
      closeAllModals();
    }
    else{
      toast.error(res?.message || `${action.label} failed`)
    }
  }
 catch (err) {
    console.error("Action failed:", err);
    toast.error(`Failed to ${action?.label?.toLowerCase?.() || "perform action"}`);
  } finally {
    setIsLoading(false);
  }
  }

// const handleAction = async () => {
//   if (!action) return;
//   setIsLoading(true);

//   try {
//     let response;

//     // Dynamically call action
//     if (action.value === "rename") {
//       response = await renameFile({
//         fileId: file.$id,
//         name,
//         extension: file.extension,
//         path,
//       });
//     } 
//     else if (action.value === "share") {
//       response = await updateFileUsers({
//         fileId: file.$id,
//         emails: email, // ✅ must be an array of emails
//         path,
//         mode: "add", // 👈 share mode (adds users)
//       });
//     } 
//     else if (action.value === "delete") {
//       console.log("Delete action");
//       toast.info("Delete feature coming soon!");
//       response = { success: false };
//     }

//     // ✅ Handle success / error messages
//     if (response?.success) {
//       toast.success(response.message || "Action completed successfully ✅");
//       closeAllModals();
//     } else {
//       toast.error(response?.message || "Something went wrong ❌");
//     }
//   } catch (error) {
//     console.error("Action failed:", error);
//     toast.error(error.message || "Unexpected error occurred ❌");
//   } finally {
//     setIsLoading(false);
//   }
// };

  const handleRemoveUser = async(emails) => { 
    
    const updateEmails = email.filter((e) => e !== emails);

    const success = await updateFileUsers({
      fileId: file.$id,
      email: updateEmails,
      path,
      mode: 'remove'
    })

    if(success) {
      
      setEmail(updateEmails)}
      closeAllModals()

  }

//   const handleRemoveUser = async (emailToRemove) => {
//   // Filter out the user being removed
//   const updatedEmails = email.filter((e) => e !== emailToRemove);

//   setIsLoading(true);
//   try {
//     const response = await updateFileUsers({
//       fileId: file.$id,
//       email: updatedEmails,
//       path,
//       mode: "remove", // 👈 remove mode skips revalidation
//     });

//     if (response?.success) {
//       toast.success(response.message || "User removed successfully ✅");
//       setEmail(updatedEmails); // update local state
//       closeAllModals();
//     } else {
//       toast.error(response?.message || "Failed to remove user ❌");
//     }
//   } catch (error) {
//     console.error("Remove user failed:", error);
//     toast.error(error.message || "Error removing user ❌");
//   } finally {
//     setIsLoading(false);
//   }
// };

 
  const renderDialogContent = () => {
    if(!action) return null;
    const {label, value} = action
    return (

      <DialogContent className='shad-dialog button'>
        <DialogHeader >
          <DialogTitle className='text-center mb-3'>
            {label}
          </DialogTitle>

          {/* Rename  */}
          {value === 'rename' && (<Input type='text' value={name}
          onChange={(e) => setName(e.target.value)}
          />)}


          {/* Details  */}
          {value === 'details' && <FileDetails file={file}/>}

          {/* share  */}
          {value === 'share' && (
            <ShareFile file={file} onInputChange={setEmail} onRemove={handleRemoveUser}/>
          )}
          {/* delete  */}
          {value === 'delete' && (
            <p className="text-center text-light-100">
              Are you sure you want to delete {` `}
              <span className="font-medium text-brand-100">{file.name}</span>
            </p>
          )}

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
