import {v2} from 'cloudinary'
import fs from 'fs'

v2.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

const extractPubliId = (URL)=>{
    const splited = String(URL).split('/');
    const fileName = splited[splited.length-1];
    return fileName.split(".")[0]
}

const uploadOnCloudinary = async(localFilePath,PresentURL=null) =>{
    try {
        if(!localFilePath) return null

        if(PresentURL){
            const DeleteResponse = await deleteFromCloudinary(PresentURL)
        }

        const UploadResponse = await v2.uploader.upload(localFilePath,{
            resource_type:'auto'
        })
        //console.log('File uploaded sucessfully');
        //console.log(UploadResponse);
        fs.unlinkSync(localFilePath);
        return UploadResponse
    } catch (error) {
        //console.log(`File of ${localFilePath} is about to be removed`);
        fs.unlinkSync(localFilePath)
    }
}

const deleteFromCloudinary = async(FullURL)=>{
    try {
        if (!FullURL){
            return null
        }

        const DeleteResponse = await v2.uploader.destroy(extractPubliId(FullURL))
        console.log("Deletion success");
        console.log(DeleteResponse);
        
        return DeleteResponse
    } catch (error) {
        return {error,message:"Something went wrong while deleting."}
    }
}

export {uploadOnCloudinary}