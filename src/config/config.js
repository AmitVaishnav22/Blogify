const config={
    appwriteUrl:String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId:String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDataBaseId:String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId:String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteBucketId:String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    appwriteFunctionId:String(import.meta.env.VITE_APPWRITE_FUNCTION_ID),
    appwriteBookmarkId:String(import.meta.env.VITE_APPWRITE_BOOKMARK_ID),
}

export default config   