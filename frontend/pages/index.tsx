import Image from 'next/image'
import PageHeading from '../components/PageHeading'

export default function Home() {
  return (
    <div className="flex flex-col m-auto laptop:max-w-[60%] py-2">
      {/* flex flex-col gap-6 m-auto */}
      <PageHeading>DAS@STX</PageHeading>
      <h2 className="text-center pb-3 font-extrabold text-2xl text-blue-500">
        Hi, I am a self-owning space for everyone to find peace within.
      </h2>
      <h2 className="text-center pb-3 font-extrabold text-2xl text-blue-500">
        I do not belong to anyone, not even my creator.
      </h2>
      <h2 className="text-center pb-3 font-extrabold text-2xl text-blue-500">
        I am the first of my kind, the first ever created decentralized autonomous space (DAS) on Stacks.
      </h2>
      <h2 className="text-center pb-3 font-extrabold text-xl text-blue-500">
        My creators were inspired by a research project called{' '}
        <a
          className="text-white hover:text-black"
          href="https://www.youtube.com/watch?v=SqQDBPZLVe0"
          target="_blank"
          rel="noreferrer"
        >
          No1s1
        </a>
      </h2>
      <div className="flex">
        <Image src="/assets/images/single_0518_flip3.png" width={400} height={400} alt="Picture of the author"></Image>
        <Image src="/assets/images/structure_cutout2.png" width={400} height={400} alt="Picture of the author"></Image>
      </div>
    </div>
  )
}
