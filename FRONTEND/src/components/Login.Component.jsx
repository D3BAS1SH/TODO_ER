import { Card,CardBody, Button, Input } from "@nextui-org/react"

const LoginComponent = () => {
  return (
    <Card className="h-full w-full" shadow="none">
      <CardBody className="text-center justify-center text-4xl font-serif">
        <h1>LOGIN</h1>
      </CardBody>
      <CardBody className="w-full gap-10 justify-center content-center">
        <div>
          <Input type="text" label="EMAIL OR USERNAME" className="text-center"/>
        </div>
        <div>
          <Input type="password" label="PASSWORD" className="text-center"/>
        </div>
        <div>
          <Button variant="ghost" color="primary" fullWidth={true} radius="sm">GET IN</Button>
        </div>
      </CardBody>
      <CardBody className="content-center justify-center justify-items-center text-center">
        <Button variant="">FORGOT CREDENTIALS</Button>
      </CardBody>
    </Card>
  )
}

export default LoginComponent