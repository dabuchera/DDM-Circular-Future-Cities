import { Dispatch, SetStateAction } from 'react'
import { fetchTest, IAssets } from '../lib/fetchKG'
import { StandardButton } from './Buttons'

// Delete that aferwards
interface Props {
  setAssets: Dispatch<SetStateAction<IAssets[] | undefined>>
  test: () => void
}

export default function QueryPanel({ setAssets, test }: Props) {
  const query = () => {
    // const temp = fetchTest()
    // console.log(temp)
    // setAssets(temp)
  }

  return (
    <>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Standard Queries</div>
        <p className="text-gray-700 text-base">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque,
          exercitationem praesentium nihil.
        </p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <div className="flex flex-col gap-5">
          <StandardButton onClick={query}>Query #1</StandardButton>
          <StandardButton>Query #2</StandardButton>
          <StandardButton>Query #3</StandardButton>
          <StandardButton onClick={test}>Test Button</StandardButton>
        </div>
      </div>
    </>
  )
}
