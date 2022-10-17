import { ChangeEvent, FormEvent, LegacyRef, MouseEventHandler, useEffect, useRef, useState } from 'react'
import { IAssets } from '../lib/fetchKG'

interface SubmitPanelProps {
  assets: IAssets[] | undefined
}

interface IFormInputs {
  name: string
  demolitionDate: Date
}

export default function SubmitPanel({ assets }: SubmitPanelProps) {
  const formElement = useRef<HTMLFormElement>(null)

  const [inputValues, setInputValues] = useState<IFormInputs>({
    name: '',
    demolitionDate: new Date(),
  })

  let newestID = null
  if (assets) {
    // console.log(assets)
    newestID = assets.length + 1
  }

  // if (formElement) {
  //   formElement.current?.addEventListener('submit', (event) => {
  //     event.preventDefault()
  //     console.log('event')
  //     console.log(inputValues)
  //   })
  // }

  const test = () => {
    // console.log(inputValues)
    console.log(inputValues.demolitionDate.toISOString().slice(0, 10))
  }

  const handleSubmit = (event: FormEvent) => {
    console.log('submit')
    event.preventDefault()
    console.log(inputValues)
  }

  return (
    <div className="px-6 py-4">
      <div className="font-bold text-xl mb-2">Input Asset Info</div>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-6 mt-6">Asset ID: {newestID}</div>
        <div className="form-group mb-6">
          <label htmlFor="name" className="form-label inline-block mb-2 text-gray-700">
            Asset Name
          </label>
          <input
            type="text"
            required
            className="form-control
                        block   
                        w-full     
                        px-3  
                        py-1.5   
                        text-base   
                        font-normal    
                      text-gray-700     
                      bg-white bg-clip-padding   
                        border border-solid
                      border-gray-300   
                        rounded  
                        transition 
                        ease-in-out   
                        m-0    
                      focus:text-gray-700
                      focus:bg-white
                      focus:border-blue-600 
                        focus:outline-none"
            id="name"
            placeholder="Enter Name"
            value={inputValues.name}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setInputValues((inputValues) => ({ ...inputValues, name: event.target.value }))
            }
          />{' '}
        </div>
        <div className="form-group mb-6">
          <label htmlFor="demolitionDate" className="form-label inline-block mb-2 text-gray-700">
            Demolition Date
          </label>
          <input
            type="date"
            required
            className="form-control block
                        w-full
                        px-3
                        py-1.5
                        text-base
                        font-normal
                        text-gray-700
                        bg-white bg-clip-padding
                        border border-solid border-gray-300
                        rounded
                        transition
                        ease-in-out
                        m-0
                      focus:text-gray-700 
                      focus:bg-white 
                      focus:border-blue-600 
                        focus:outline-none"
            id="demolitionDate"
            placeholder="Enter Date"
            value={inputValues.demolitionDate ? inputValues.demolitionDate.toISOString().slice(0, 10) : undefined}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setInputValues((inputValues) => ({ ...inputValues, demolitionDate: new Date(event.target.value) }))
            }}
          />
        </div>
        <button
          type="submit"
          className="w-full
                      px-6
                      py-2.5
                      bg-blue-600
                      text-white
                      font-medium
                      text-xs
                      leading-tight
                      uppercase
                      rounded
                      shadow-md
                      hover:bg-blue-700 hover:shadow-lg
                      focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
                      active:bg-blue-800 active:shadow-lg
                      transition
                      duration-150
                      ease-in-out"
        >
          Upload
        </button>
      </form>
      <button onClick={test} className="w-20 h-10 mt-5 bg-gray-500">
        Test
      </button>
    </div>
  )
}
