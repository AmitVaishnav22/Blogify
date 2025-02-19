import config from "../config/config";
import { Client, Account,Databases, ID} from "appwrite";

export class AuthService{
    client=new Client();
    account;
    users;
    functions;
    constructor(){
        this.client
        .setEndpoint(config.appwriteUrl)
        .setProject(config.appwriteProjectId)
        this.account=new Account(this.client)
        this.database = new Databases(this.client);
    }

    // async createAccount({email,password,name}){
    //     try {
    //         const userAccount=await this.account.create(ID.unique(),email,password,name,bio = "",profilePic = "")
    //         if (userAccount) {
    //             //  call another method
    //             return this.login({email,password})
    //         } else {
    //             return userAccount
    //         }
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    async createAccount({ email, password, name, bio = "", userprofile = "" }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
    
            if (userAccount) {
             
                await this.database.createDocument(
                    config.appwriteDataBaseId,  
                    config.appwriteUserId,  
                    userAccount.$id, 
                    {
                        name,
                        email,
                        bio,
                        userprofile,
                    }
                );
                const userDoc = await this.database.getDocument(
                    config.appwriteDataBaseId, 
                    config.appwriteUserId, 
                    userAccount.$id
                );    
    
                // Log the user in
                await this.login({ email, password });
                return userDoc;
            } else {
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }
    
    async login({email,password}){
        try {
            return await this.account.createEmailPasswordSession(email,password)
        } catch (error) {
            throw error;
        }
    }

    async getCurrUser(){
        try {
            return await this.account.get();
        } catch (error) {
            throw error;
        }
        return null;
    } 
    async logout(){
        try {
            return await this.account.deleteSessions()
        } catch (error) {
            throw error;
        }
    }
    async updateUser(userId, updatedData) {
        try {
            const response = await this.database.updateDocument(
                config.appwriteDataBaseId,  
                config.appwriteUserId,      
                userId,                     
                updatedData               
            );
            console.log(response);
            return response;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }

    async getCurrentUserWithDetails() {
        try {
            const currentUser = await this.account.get();
            const userDetails = await this.database.getDocument(
                config.appwriteDataBaseId,   
                config.appwriteUserId,     
                currentUser.$id            
            );
            const userData = { ...currentUser, ...userDetails };
    
            //console.log("Fetched Detailed User:", userData);
            
            return userData;
        } catch (error) {
            console.error("Error fetching user with details:", error);
            throw error;
        }
    }
    

}

const authService=new AuthService()

export default authService;