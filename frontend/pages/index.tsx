import Image from 'next/image'
import PageHeading from '../components/PageHeading'

export default function Home() {
  return (
    <div className="flex flex-col m-auto laptop:max-w-[60%] py-2">
      {/* flex flex-col gap-6 m-auto */}
      <PageHeading>CFC Marketplace</PageHeading>
      <h2 className="text-center pb-3 font-extrabold text-2xl text-blue-500">TBF</h2>
      <h2 className="text-center pb-3 font-extrabold text-2xl text-blue-500">TBF</h2>
      <h2 className="text-center pb-3 font-extrabold text-2xl text-blue-500">TBF</h2>
      {/* <div className="flex">
        <Image src="/assets/images/single_0518_flip3.png" width={400} height={400} alt="Picture of the author"></Image>
        <Image src="/assets/images/structure_cutout2.png" width={400} height={400} alt="Picture of the author"></Image>
      </div> */}
    </div>
  )
}
