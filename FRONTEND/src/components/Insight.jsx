import {Card,CardBody} from "@heroui/react";

const Insight = ({author="Walt Whitman",quote="My words itch at your ears till you understand them"}) => {
  return (
    <div className="h-full w-full">
        <Card fullWidth={true} shadow="none" className="h-full p-8">
          <CardBody className="justify-center gap-5 h-full w-full">
            <p className="text-[220%] md:text-[180%] lg:text-[180%] text-wrap text-justify font-bold font-Lora">
              {quote}
            </p>
            <p className="italic text-3xl md:text-2xl lg:text-4xl font-Explora font-extrabold">
              ~ {author}
            </p>
          </CardBody>
        </Card>
    </div>
  )
}

export default Insight
