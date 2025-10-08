'use server'

import { createAdminClient } from "@/lib/appwrite"
import { appwriteConfig } from "@/lib/appwrite/config";
import { constructFileUrl, getFileType, parseStringfy } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";
import {InputFile} from 'node-appwrite/file'
import { getCurrentUser } from "./user-action";


export const uploadFiles = async({file, ownerId, path}) => {
    const {storage,databases} = await createAdminClient();

    try {
       const inputFile = InputFile.fromBuffer(file,file.name)   
       
       const bucketFile = await storage.createFile(
        appwriteConfig.bucketId,
        ID.unique(),
        inputFile,
       )

      const fileDoc = {
        type : getFileType(bucketFile.name).type,
        name: bucketFile.name,
        url: constructFileUrl(bucketFile.$id),
        extension : getFileType(bucketFile.name).extension,
        size: bucketFile.sizeOriginal,
        owner: ownerId,
        // users:[],
        bucketFileId: bucketFile.$id
      }

      const newFile = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.fileCollectionId,
        ID.unique(),
        fileDoc,
      )
      .catch(async (error) => {
        await storage.deleteFile(
            appwriteConfig.bucketId,
            bucketFile.$id,
            console.error(error,"Failed to create file")
        )
      })
      revalidatePath(path)
      return parseStringfy(newFile)
       
    } catch (error) {
        throw new Error(error, 'Failed to upload file')
    }
}

  //  const createQueries =(currentUser) => {
  //     const queries = [
      
  //       Query.equal("owner", [currentUser.id])
        
  //     ]
  //     return queries
  //  }

export const getFiles = async() => {
  const {databases} = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
   
    if(!currentUser) throw new Error ("User not Found")

      const queries = [Query.equal("owner", [currentUser.id])];
      // console.log(queries)
       const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      queries,
      ["owner"] 
       )
       console.log("Fetched files:", files);
       
      return parseStringfy(files)
    
  } catch (error) {
    throw new Error (error, "Failed to get the Files")
  }
}


export const renameFile = async({fileId, name, extension, path}) => {
      const {databases} = await createAdminClient();
      try {
          const newName =`${name}.${extension}`;
          const updatedFile = await databases.updateDocument(
             appwriteConfig.databaseId,
          appwriteConfig.fileCollectionId,
          fileId,{
            name: newName,
          },
          );
          revalidatePath(path)
          parseStringfy(updatedFile)
         return true;

      } catch (error) {
          throw new Error (error, "Failed to rename the file  ")
      }
}