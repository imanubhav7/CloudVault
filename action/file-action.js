"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { constructFileUrl, getFileType, parseStringfy } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { getCurrentUser } from "./user-action";
import { success } from "zod";

export const uploadFiles = async ({ file, ownerId, path }) => {
  const { storage, databases } = await createAdminClient();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);

    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile
    );

    const fileDoc = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      // users:[],
      bucketFileId: bucketFile.$id,
    };

    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.fileCollectionId,
        ID.unique(),
        fileDoc
      )
      .catch(async (error) => {
        await storage.deleteFile(
          appwriteConfig.bucketId,
          bucketFile.$id,
          console.error(error, "Failed to create file")
        );
      });
    revalidatePath(path);
    return parseStringfy(newFile);
  } catch (error) {
    throw new Error(error, "Failed to upload file");
  }
};

//  const createQueries =(currentUser) => {
//     const queries = [

//       Query.equal("owner", [currentUser.id])

//     ]
//     return queries
//  }

const createQueries = (currentUser,types, searchText, sort ) =>{
 const queries = [
      Query.or([
        Query.equal("owner", [currentUser.id]),
        Query.contains("users", currentUser.email),
      ]),
    ];
    if(types.length>0)
      queries.push(Query.equal('type', types))

    if(searchText)
      queries.push(Query.contains('name', searchText))

    // if(limit)
    //   queries.push(Query.equal(limit))

    const [sortBy,orderBy] = sort.split("-");
    queries.push(
      orderBy === 'asc' ? Query.orderAsc(sortBy): Query.orderDesc(sortBy)
    )

    return queries
}

export const getFiles = async ({types = [], searchText = '', sort ='$createdAt-desc' }) => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("User not Found");
   
   const queries = createQueries(currentUser,types,searchText, sort )
    // console.log(queries)
    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      queries,
      ["owner"]
    );
    //  console.log("Fetched files:", files);
    return parseStringfy(files);
  } catch (error) {
    throw new Error(error, "Failed to get the Files");
  }
};

// Rename File
export const renameFile = async ({ fileId, name, extension, path }) => {
  const { databases } = await createAdminClient();
  try {
    const newName = `${name}.${extension}`;
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      fileId,
      {
        name: newName,
      }
    );
    revalidatePath(path);
    parseStringfy(updatedFile);
    
    return{
      success: true, message: `File renamed to ${newName} successfully`
    }
    
  } catch (error) {
   console.error("Rename error:", error);
    return {
      success: false,
      message: "Failed to rename the file ",
    };
}};

// UpdateFile or Share user
export const updateFileUsers = async ({
  fileId,
  email,
  path,
  mode = "add",
}) => {
  const { databases } = await createAdminClient();

  try {

    const currentUser = getCurrentUser();

    if(!currentUser){
      return {
        success: false,
        message: "Unauthorized user"
      }
    }

    // fetching file 
    const file = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      fileId
    );
    
  

    if(file.owner !== currentUser.id && file.owner.$id!== currentUser.id){
      return {
        success: false,
        message: "Only owner can share file"
      }
    }



      let updatedUsers = Array.isArray(file.users) ? file.users : [];

    if (mode === "add" && email.length > 0) {
      let validEmails = [];

      if (email.length === 1) {
        const existing = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          [Query.equal("email", email[0])]
        );
        validEmails = existing.documents.map((u) => u.email);
        if(validEmails === existing){
          return{
            success: false,
            message: "Email already exists"
          }
        }
      } else {
        const emailQueries = email.map((e) => Query.equal("email", e));
        const existing = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          [Query.or(emailQueries)]
        );
        validEmails = existing.documents.map((u) => u.email);
      }

      //  validEmails = existingUsers.documents.map((u) => u.email);
      if (validEmails.length === 0)
        return { success: false, message: "No registered users found ❌" };

      // Merge & deduplicate
     updatedUsers = Array.from(new Set([...updatedUsers, ...validEmails]));
    }

    if (mode === "remove") {
      updatedUsers = email; // frontend sends filtered list after removal
    }

    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      fileId,
      {
        users: email,
      }
    );
    revalidatePath(path);
    parseStringfy(updatedFile);
   const msg =
      mode === "add"
        ? `File shared with ${updatedUsers.length} user(s) `
        : `Removed shared users successfully `;

    return { success: true, message: msg ,file: parseStringfy(updatedFile),};
  } catch (error) {
    throw new Error(error, "Failed to share the file  ");
  }
};


// delete 

export const deleteFile = async ({fileId, bucketFileId, path}) => {
  const {databases, storage} = await createAdminClient();

  try {
    const deleteFile = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.fileCollectionId,
      fileId,
    )
   if(deleteFile) {
    await storage.deleteFile(appwriteConfig.bucketId,bucketFileId)
   }
   revalidatePath(path)
   return {
    success: true,
    message: "File deleted successfully"
    
   }
  } catch (error) {
     throw new Error(error, "Failed to delete file  ");
  }

}