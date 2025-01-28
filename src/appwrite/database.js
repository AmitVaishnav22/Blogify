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
    
      
    async createPost({title,slug,content,featuredImg,status,userId,userName}){
        try {
            return await this.databases.createDocument(
                config.appwriteDataBaseId,
                config.appwriteCollectionId,
                ID.unique(),
                {
                    title,   
                    content,
                    //slug,
                    featuredImg, 
                    status,
                    userId,
                    userName
                }
            )
        } catch (error) {
            throw error;
        }
    }

    async toggleBookmark(userId, postId) {
        try {
            
            const response = await this.databases.listDocuments(
                config.appwriteDataBaseId,
                config.appwriteBookmarkId,
                [
                    Query.equal('userId', userId), 
                    Query.equal('postId', postId)
                ]
            );

            if (response.documents.length > 0) {
                // If bookmark exists, delete it
                await this.databases.deleteDocument(
                    config.appwriteDataBaseId,
                    config.appwriteBookmarkId,
                    response.documents[0].$id
                );
                return 'removed';
            } else {
                // If bookmark does not exist, create it
                await this.databases.createDocument(
                    config.appwriteDataBaseId,
                    config.appwriteBookmarkId,
                    ID.unique(),
                    {
                        userId,
                        postId, 
                    }
                );
                return 'added';
        }
            
        } catch (error) {
            console.error('Error toggling bookmark:', error);
            throw error;
        }
    }

    async getBookmarks(userId) {
        try {
            return await this.databases.listDocuments(
                config.appwriteDataBaseId,
                config.appwriteBookmarkId,
                [Query.equal('userId', userId)]
            );
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            throw error;
        }
    }
    async fetchPostsForBookmarks(bookmarks) {
        try {
            const postIds = bookmarks.map((bookmark) => bookmark.postId);
            if (postIds.length === 0) return [];
            const posts = await this.getPosts([Query.equal("$id", postIds)]);
            return posts.documents;
        } catch (error) {
            console.error("Error fetching posts for bookmarks:", error);
            return [];
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
            const userLikes = Array.isArray(post.userLikes) ? post.userLikes : [];
            const hasLiked = userLikes.includes(userId);
    
            const updatedLikes = hasLiked ? post.likes - 1 : post.likes + 1;
            const updatedUserLikes = hasLiked
                ? userLikes.filter((id) => id !== userId)
                : [...userLikes, userId];
    
            return await this.databases.updateDocument(
                config.appwriteDataBaseId,
                config.appwriteCollectionId,
                postId,
                {
                    likes: updatedLikes,
                    userLikes: updatedUserLikes,
                }
            );
        } catch (error) {
            console.error("Error toggling like:", error);
            throw error;
        }
    }
    async createComment(postId, userId, commentText,userName) {
        try {
            
            const post = await this.databases.getDocument(
                config.appwriteDataBaseId,
                config.appwriteCollectionId,
                postId
            );
    
            const updatedComments = post.comments || []; 
    
            const newComment = JSON.stringify({
                id: ID.unique(),
                userId,
                userName,
                content: commentText,
                createdAt: new Date().toISOString(),
            });
            //console.log(newComment);
    
            updatedComments.push(newComment);
    
            const updatedPost = await this.databases.updateDocument(
                config.appwriteDataBaseId,
                config.appwriteCollectionId,
                postId,
                {
                    comments: updatedComments, 
                }
            );
    
            return updatedPost; 
        } catch (error) {
            console.error("Error creating comment:", error);
            throw error; 
        }
    }
    async getUserLikedPosts(currentUserId) {
        try {
            const queries = [
                Query.search("userLikes", currentUserId),
            ];
    
            const response = await this.getPosts(queries);
        
            return response.documents; 
        } catch (error) {
            console.error("Error fetching user liked posts:", error);
            throw error;
        }
    }

    
    async deleteComment(postId, userId, commentId) {
        try {

            const post = await this.databases.getDocument(
                config.appwriteDataBaseId,
                config.appwriteCollectionId,
                postId
            );
    
            const updatedComments = (post.comments || []).filter((commentString) => {
                const comment = JSON.parse(commentString);
                return !(comment.id === commentId && comment.userId === userId); 
            });
    
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