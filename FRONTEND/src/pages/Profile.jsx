
import { useEffect, useState } from "react"
import { Card, CardBody } from "@nextui-org/card"
import { Accordion, AccordionItem } from "@nextui-org/accordion"
import { Input } from "@nextui-org/input"
import { Button } from "@nextui-org/button"
import { Avatar } from "@nextui-org/avatar"
import {Image} from "@nextui-org/image"
import { useAuthUserData,useAuth,useAuthIsLoading,useAuthError } from "../hooks/useAuth.hook.js"
import toast,{Toaster} from "react-hot-toast"

const Profile = () => {
  const {updateAvatar,updateAccountDetail} = useAuth();
  const {loading} = useAuthIsLoading();
  const {user} = useAuthUserData();
  const {error} = useAuthError();

  const [isExpanded, setIsExpanded] = useState(false);
  const [file,setFile] = useState(null);
  const [myState,setMyState] = useState({fullname:"",email:""});
  
  const handleNameChange = (e) => {
    e.preventDefault();
    const {name,value} = e.target
    setMyState(val=>({...val,[name]:value}));
    console.log(myState);
  }

  const handleAccDetailClick = async() => {
    try {
      // console.log("Hitting On Click");
      await updateAccountDetail(myState);
      toast.success("Successful Account Details updated.")
      // console.log("Hitting On Click Successful");
    } catch (error) {
      console.log("Update account info failed.")
    }
  }

  const handleFileHandle = (e) =>{
    e.preventDefault();
    console.log(e);
    const filepath = e.target.files[0];
    console.log(filepath);
    setFile(filepath)
  }

  const handleOnClickUpdate = async() => {
    try {
      await updateAvatar(file);
      toast.success("Successful updated.");
    } catch (error) {
      console.log(error);
      toast.error("Update failed of Avatar.");
    }
  }

  useEffect(()=>{
    if(error){
      toast.custom(error);
    }
  },[error])
  return (
    <div className="w-full min-h-screen bg-background">
      
      <Toaster position="bottom-left" toastOptions={{
        style: {
          zIndex: 9999,
          background: "#333",
          color: "#fff",
          pointerEvents:'all'
        },
        duration:5000
      }}
      />

      {/* Cover Image Section */}
      <div className="relative w-full h-[300px] bg-neutral-800">
        <Image
          src={"/placeholder.svg?height=300&width=1200"}
          alt="Cover"
          width={1200}
          height={300}
          className="w-full h-full object-cover object-center"
        />

        {/* Profile Card */}
        <Card
          className="absolute left-1/2 transform -translate-x-1/2 -bottom-20 w-full max-w-md mx-auto shadow-lg z-50"
          isPressable
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <CardBody className="flex flex-col items-center gap-4 p-6">
            <Avatar src={user.avatar} className="w-24 h-24" isBordered />
            <div className="text-center">
              <h2 className="text-xl font-semibold">{user.fullname}</h2>
              <p className="text-default-500">{user.email}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Dropdowns Section */}
      <div className="w-full max-w-md mx-auto mt-24 px-4">
        {isExpanded && (
          <Accordion>
            <AccordionItem key="1" title="Update profile picture" className="px-2">
              <div className="flex flex-col gap-4 p-2">
                <Input type="file" label="Choose new profile picture" onChange={handleFileHandle}/>
                <Button color="primary" isLoading={loading} onClick={handleOnClickUpdate}>Upload Picture</Button>
              </div>
            </AccordionItem>
            <AccordionItem key="2" title="Update profile information" className="px-2">
              <div className="flex flex-col gap-4 p-2">
                <Input name="fullname" label="Full Name" placeholder="Enter your full name" defaultValue={user.fullname} onChange={handleNameChange}/>
                <Input name="email" label="Email" placeholder="Enter your email" defaultValue={user.email} type="email"  onChange={handleNameChange}/>
                <Button color="primary" onClick={handleAccDetailClick} isLoading={loading}>Update Information</Button>
              </div>
            </AccordionItem>
            <AccordionItem key="3" title="Change password" className="px-2">
              <div className="flex flex-col gap-4 p-2">
                <Input label="Current Password" type="password" placeholder="Enter current password" />
                <Input label="New Password" type="password" placeholder="Enter new password" />
                <Input label="Confirm New Password" type="password" placeholder="Confirm new password" />
                <Button color="primary">Change Password</Button>
              </div>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  )
}

export default Profile