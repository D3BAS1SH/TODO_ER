import Insight from "../components/Insight";
import RegisterComponent from "../components/Register.Component";

const Quotes=[
  {
    author:"Walt Whitman",
    quote:"I am large, I contain multitudes."
  },
  {
    author:"Walt Whitman",
    quote:"My words itch at your ears till you understand them"
  },
  {
    author:"Walt Whitman",
    quote:"Battles are lost in the same spirit in which they are won."
  },
  {
    author:"Walt Whitman",
    quote:"We don’t read and write poetry because it’s cute. We read and write poetry because we are members of the human race. And the human race is filled with passion. So medicine, law, business, engineering... these are noble pursuits and necessary to sustain life. But poetry, beauty, romance, love... these are what we stay alive for."
  },
]


const RegisterPage = () => {
  const RandomNumber = Math.floor(Math.random()*Quotes.length);
  
  return (
    <div className="min-h-full grid grid-cols-1 md:grid-cols-10 rounded-md p-8 gap-6">
      <section className="h-full md:col-span-6 hidden md:block">
        <Insight author={Quotes[RandomNumber].author} quote={Quotes[RandomNumber].quote} />
      </section>
      <section className="h-full col-span-4 md:block">
        <RegisterComponent/>
      </section>
    </div>
  )
}

export default RegisterPage
