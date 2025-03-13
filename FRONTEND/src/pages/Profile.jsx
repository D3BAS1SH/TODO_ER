
import { useState } from "react"
import { Card, CardBody } from "@nextui-org/card"
import { Accordion, AccordionItem } from "@nextui-org/accordion"
import { Input } from "@nextui-org/input"
import { Button } from "@nextui-org/button"
import { Avatar } from "@nextui-org/avatar"
import {Image} from "@nextui-org/image"
import { useAuthUserData,useAuth,useAuthIsLoading } from "../hooks/useAuth.hook.js"
import toast from "react-hot-toast"

const Profile = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userInfo, setUserInfo] = useState(useAuthUserData().user);
  const [file,setFile] = useState(null);

  const {updateAvatar} = useAuth();
  const {loading} = useAuthIsLoading();

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

  return (
    <div className="w-full min-h-screen bg-background">
      

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
            <Avatar src={userInfo.avatar} className="w-24 h-24" isBordered />
            <div className="text-center">
              <h2 className="text-xl font-semibold">{userInfo.fullname}</h2>
              <p className="text-default-500">{userInfo.email}</p>
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
                <Input label="Full Name" placeholder="Enter your full name" defaultValue={userInfo.fullname} />
                <Input label="Email" placeholder="Enter your email" defaultValue={userInfo.email} type="email" />
                <Button color="primary">Update Information</Button>
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