import { createNextState } from "@reduxjs/toolkit";
import config from "../config/config";
import { Client,Databases,Storage,ID,Query} from "appwrite";
import authService from "./auth";


export class Service{
    client = new Client();
    databases;
    storage;
    constructor(){
        this.client
        .setEndpoint(config.appwriteUrl)
        .setProject(config.appwriteProjectId)
        this.databases=new Databases(this.client)
        this.storage=new Storage(this.client)
    }
    
      
    async createPost({title,slug,content,featuredImg,status,userId}){
        try {
            return await this.databases.createDocument(
                config.appwriteDataBaseId,
                config.appwriteCollectionId,
                ID.unique(),
                {
                    title,   
                    content,
                    //slug
                    featuredImg,
                    status,
                    userId,
                }
            )
        } catch (error) {
            throw error;
        }
    }

    async updatePost(slug,{title,content,featuredImg,status}){
        try {
            return await this.databases.updateDocument(
                config.appwriteDataBaseId,
                config.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImg,
                    status
                }
            )
            
        } catch (error) {
            throw error;
        }
    }
    
    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                config.appwriteDataBaseId,
                config.appwriteCollectionId,
                slug,
            )
            return true
        } catch (error) {
            console.log("error")
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                config.appwriteDataBaseId,
                config.appwriteCollectionId,
                slug,
            )
        } catch (error) {
            console.log("Appwrite serive :: getPost :: error", error);
            return null;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            //console.log("Querying with:", queries);
            return await this.databases.listDocuments(
            config.appwriteDataBaseId,
            config.appwriteCollectionId,
            queries,
            )
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }
    async getInactivePosts(queries=[Query.equal("status","inactive")]){
        try {
            return await this.databases.listDocuments(
                config.appwriteDataBaseId,
                config.appwriteCollectionId,
                queries
            )
        } catch (error) {
            console.log(error)
        }
    }

    //file upload service
    async uploadFile(file){
        try {
            return this.storage.createFile(
                config.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            return false
        }
    }

    async deleteFile(fileId){
        try {
            await this.storage.deleteFile(
                config.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            throw error;
        }
    }
    getFilePreview(fileId){
        return this.storage.getFilePreview(
            config.appwriteBucketId,
            fileId
        )
    }

    async toggleLike(postId, userId) {
        try {
          
            const post = await this.databases.getDocument(
                config.appwriteDataBaseId,
                config.appwriteCollectionId,
                postId
            );

            //console.log(post)
            const userLikes = JSON.parse(post.userLikes || "[]");
            const hasLiked = userLikes.includes(userId);
    
            const updatedLikes = hasLiked ? post.likes - 1 : post.likes + 1;
            const updatedUserLikes = hasLiked
                ? userLikes.filter((id) => id !== userId)
                : [...userLikes, userId];
    
          
            const updatedUserLikesString = JSON.stringify(updatedUserLikes);
    
            return await this.databases.updateDocument(
                config.appwriteDataBaseId,
                config.appwriteCollectionId,
                postId,
                {
                    likes: updatedLikes,
                    userLikes: updatedUserLikesString,
                }
            );
        } catch (error) {
            console.error("Error toggling like:", error);
            throw error;
        }
    }
    async createComment(postId, userId, commentText,name) {
        try {
            const post = await this.databases.getDocument(
                config.appwriteDataBaseId,
                config.appwriteCollectionId,
                postId
            );
    
            // Parse the existing comments
            const updatedComments = JSON.parse(post.comments || "[]");
    
            // Create a new comment object
            const newComment = {
                id: ID.unique(), // Unique ID for the comment
                userId,
                name,
                commentText,
                createdAt: new Date().toISOString(),
            };

            // console.log(newComment);
    
            // Add the new comment to the array
            updatedComments.push(newComment);
    
            // Convert back to string for storage
            const updatedCommentsString = JSON.stringify(updatedComments);
    
            // Update the post document with the new comments
            return await this.databases.updateDocument(
                config.appwriteDataBaseId,
                config.appwriteCollectionId,
                postId,
                {
                    comments: updatedCommentsString,
                }
            );
        } catch (error) {
            console.error("Error creating comment:", error);
            throw error;
        }
    }

    async deleteComment(postId, commentId) {
        try {
            
            const post = await this.databases.getDocument(
                config.appwriteDataBaseId,
                config.appwriteCollectionId,
                postId
            );
    
            
            const updatedComments = (post.comments || []).filter(
                (comment) => comment.id !== commentId
            );
    
            return await this.databases.updateDocument(
                config.appwriteDataBaseId,
                config.appwriteCollectionId,
                postId,
                {
                    comments: updatedComments,
                }
            );
        } catch (error) {
            console.error("Error deleting comment:", error);
            throw error;
        }
    }
    


}

const service=new Service();
export default service;