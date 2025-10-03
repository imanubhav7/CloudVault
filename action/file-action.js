'use server'

import { createAdminClient } from "@/lib/appwrite"
import { appwriteConfig } from "@/lib/appwrite/config";
import { constructFileUrl, getFileType, parseStringfy } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { ID } from "node-appwrite";
import {InputFile} from 'node-appwrite/file'


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