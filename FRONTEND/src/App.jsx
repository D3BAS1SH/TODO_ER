import { BrowserRouter as Router } from 'react-router-dom';
import { Card, CardBody, CardHeader } from "@nextui-org/react";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-8">
        <Card className="max-w-[400px] mx-auto">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md">My Todo App</p>
            </div>
          </CardHeader>
          <CardBody>
            <p>Welcome to the Todo application!</p>
          </CardBody>
        </Card>
      </div>
    </Router>
  );
}

export default App;