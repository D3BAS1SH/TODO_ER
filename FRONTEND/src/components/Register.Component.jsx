import { Card, CardBody, Button, Input } from "@nextui-org/react"
import { useAuth, useAuthIsLoading } from "../hooks/useAuth.hook.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

const RegisterComponent = () => {
  
  const navigate = useNavigate();
  const {
    error,
    register
  } = useAuth();
  const {loading} = useAuthIsLoading();

  const [formData,setFormData] = useState({
    username:'',
    email:'',
    fullname:'',
    password:'',
    avatar:null,
    coverImage:null,
  })

  const handleChanges = (e) => {
    const {files, value, name} = e.target;
    console.log(files,value,name);
    
    setFormData(prev=>({
      ...prev,
      [name]:files?files[0]:value
    }));
  }

  const handleOnSubmit = async (e) =>{
    e.preventDefault();
    try {
      console.log("Onclick Hit");
      await register(formData);
      setFormData({
        username:'',
        email:'',
        fullname:'',
        password:'',
        avatar:null,
        coverImage:null,
      })
      navigate("/");
    } catch (error) {
      console.error("Some Error in Register");
      toast.error(error.message||"Registration Error Occured")
      console.error(error);
    }
  }

  return (
    <Card className="h-full w-full" shadow="none">
      <CardBody className="text-center justify-center text-4xl font-serif">
        <h1>REGISTER</h1>
      </CardBody>
      <CardBody className="w-full gap-10 justify-center content-center">
        <div>
          <Input type="text" label="USERNAME" className="text-center" name="username" isRequired={true} value={formData.username} onChange={handleChanges}/>
        </div>
        <div>
          <Input type="email" label="EMAIL" className="text-center" name="email" isRequired={true} value={formData.email} onChange={handleChanges}/>
        </div>
        <div>
          <Input type="text" label="FULL NAME" className="text-center" name="fullname" isRequired={true} value={formData.fullname} onChange={handleChanges}/>
        </div>
        <div>
          <Input type="password" label="PASSWORD" className="text-center" name="password" isRequired={true} value={formData.password} onChange={handleChanges}/>
        </div>
        <div>
          <Input type="file" label="AVATAR" className="text-center" name="avatar" isRequired={true} onChange={handleChanges}/>
        </div>
        <div>
          <Input type="file" label="Cover Image" className="text-center" name="coverImage" onChange={handleChanges}/>
        </div>
        <div>
          <Button variant="ghost" color="primary" fullWidth={true} radius="sm" onClick={handleOnSubmit} isLoading={loading}>GET STARTED</Button>
        </div>
      </CardBody>
    </Card>
  )
}

export default RegisterComponent