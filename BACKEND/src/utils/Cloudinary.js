import {v2} from 'cloudinary'
import fs from 'fs'

v2.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

const uploadOnCloudinary = async(localFilePath) =>{
    try {
        if(!localFilePath) return null

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

const deleteFromCloudinary = async()=>{
    
}

export {uploadOnCloudinary}