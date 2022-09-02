import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="p-2 bg-gray-400 rounded-lg z-10">
      <div className="mobile:flex mobile:items-center mobile:justify-between">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        <a href="/" className="mb-4 flex items-center mobile:mb-0">
          <Image src="/assets/ddm.png" alt="Flowbite Logo" width={50} height={50} />
          <span className="self-center ml-3 whitespace-nowrap laptop:text-xl tablet:text-lg mobile:text-xs text-white font-semibold">
            DDM@STX
          </span>
        </a>
        <ul className="mb-4 flex flex-wrap items-center text-sm text-white mobile:mb-0">
          <li>
            <a
              href="#"
              className="laptop:mr-6 tablet:mr-2 mobile:mr-1 hover:underline laptop:text-base tablet:text-sm mobile:text-xs"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#"
              className="laptop:mr-6 tablet:mr-2 mobile:mr-1 hover:underline laptop:text-base tablet:text-sm mobile:text-xs"
            >
              Privacy Policy
            </a>
          </li>
          <li>
            <a
              href="#"
              className="laptop:mr-6 tablet:mr-2 mobile:mr-1 hover:underline laptop:text-base tablet:text-sm mobile:text-xs"
            >
              Licensing
            </a>
          </li>
          <li>
            <a href="mailto:dcrypb@hotmail.com" className="hover:underline laptop:text-base tablet:text-sm mobile:text-xs">
              Contact
            </a>
          </li>
        </ul>
      </div>
      <hr className="border-white mobile:my-2 mobile:mx-auto" />
      <span className="block text-sm text-white mobile:text-center laptop:text-base tablet:text-sm mobile:text-xs">
        © 2022 DDM™. All Rights Reserved.
      </span>
    </footer>
  )
}
