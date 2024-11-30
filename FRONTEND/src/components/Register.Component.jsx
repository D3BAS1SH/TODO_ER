import { Card,CardBody, Button, Input } from "@nextui-org/react"

const RegisterComponent = () => {
  return (
    <Card className="h-full w-full px-8 pb-8" shadow="none">
      <CardBody className="text-center justify-center text-4xl font-serif">
        <h1>REGISTER</h1>
      </CardBody>
      <CardBody className="w-full gap-10 justify-center content-center">
        <div>
          <Input type="text" label="USERNAME" className="text-center"/>
        </div>
        <div>
          <Input type="email" label="EMAIL" className="text-center"/>
        </div>
        <div>
          <Input type="text" label="FULL NAME" className="text-center"/>
        </div>
        <div>
          <Input type="password" label="PASSWORD" className="text-center"/>
        </div>
        <div>
          <Input type="file" label="AVATAR" className="text-center"/>
        </div>
        <div>
          <Input type="file" label="Cover Image" className="text-center"/>
        </div>
        <div>
          <Button variant="ghost" color="primary" fullWidth={true} radius="sm">GET STARTED</Button>
        </div>
      </CardBody>
    </Card>
  )
}

export default RegisterComponent