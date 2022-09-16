import { IAssets } from '../lib/fetchKG'

interface InfoPanelProps {
  selectedAsset: IAssets | undefined
}

export default function InfoPanel({ selectedAsset }: InfoPanelProps) {
  return (
    <>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Asset Info</div>
        <p className="text-gray-700 text-base">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque,
          exercitationem praesentium nihil.
        </p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <table className="table-fixed w-full">
          <tbody>
            <tr className="w-full">
              <td className="font-semibold w-1/2">ID</td>
              <td className="w-1/2">{selectedAsset ? selectedAsset.id : ''}</td>
            </tr>
            <tr>
              <td className="font-semibold w-1/2">Demolition Date</td>
              <td className="w-1/2">{selectedAsset ? selectedAsset.demolitionDate.toDateString() : ''}</td>
            </tr>
            <tr>
              <td className="font-semibold">NEXT</td>
              <td>{selectedAsset ? selectedAsset.id : ''}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
