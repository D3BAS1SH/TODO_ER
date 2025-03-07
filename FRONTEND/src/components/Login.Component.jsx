import { Card,CardBody, Button, Input } from "@nextui-org/react"
import { useAuth, useAuthIsLoading } from "../hooks/useAuth.hook.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {validator} from "../utils/email.validator.js";
import {toast} from "react-hot-toast";

const LoginComponent = () => {

  const navigate = useNavigate();
  const {login} = useAuth();
  const {loading} = useAuthIsLoading();

  const [creds,setCreds] = useState({
    input:'',
    password:'',
  })

  const handleOnChange = (e) =>{
    const {name,value} = e.target;
    setCreds(prev=>({
      ...prev,
      [name]:value,
    }))
  }

  const handleOnClick=async(e)=>{
    e.preventDefault();
    try {
      console.log("Hit On Click");
      // if(!(validator.containsSQLInjectionRisk(creds.input) || validator.containsUnicodeHomoglyphs(creds.input))){
      //   throw new Error("Invalid Input");
      // }
      let credential = {}
      if(validator.validateEmail(creds.input)){
        credential={
          email:creds.input,
          username:"",
          password:creds.password
        }
      }
      else if(validator.validateUsername(creds.input)){
        credential={
          email:"",
          username:creds.input,
          password:creds.password
        }
      }
      await login(credential);

      setCreds({
        input:"",
        password:""
      });

      navigate('/dashboard');
    } catch (error) {
      console.error("Some Error in Login");
      toast.error(error.message||"Login Error Occured")
      console.error(error);
    }
  }

  return (
    <Card className="h-full w-full" shadow="none">
      <CardBody className="text-center justify-center text-4xl font-serif">
        <h1>LOGIN</h1>
      </CardBody>
      <CardBody className="w-full gap-10 justify-center content-center">
        <div>
          <Input type="text" label="EMAIL OR USERNAME" name="input" value={creds.input} onChange={handleOnChange}/>
        </div>
        <div>
          <Input type="password" label="PASSWORD" name="password" value={creds.password} onChange={handleOnChange}/>
        </div>
        <div>
          <Button variant="ghost" color="primary" fullWidth={true} radius="sm" isLoading={loading} onClick={handleOnClick}>GET IN</Button>
        </div>
      </CardBody>
      <CardBody className="content-center justify-center justify-items-center text-center">
        <Button variant="">FORGOT CREDENTIALS</Button>
      </CardBody>
    </Card>
  )
}

export default LoginComponent