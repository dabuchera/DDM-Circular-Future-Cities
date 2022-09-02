import React, { Fragment } from 'react'
import { Transition } from '@headlessui/react'
import { StyledIcon } from './ui/styled-icon'
import { useAppContext } from '../providers/AppStateProvider'
import ExplorerLink from './ExplorerLink'

export default function TxStatus() {
  const { appState, setAppstate } = useAppContext()

  const statusClass = () => {
    if (appState.tx_status === 'success') {
      return 'text-green-400'
    } else if (appState.tx_status === 'pending') {
      return 'text-black'
    }
    return 'text-red-600'
  }

  const hidePopup = () => {
    setAppstate((prevState) => ({
      ...prevState,
      showTxModal: false,
      tx_id: null,
    }))
  }

  return (
    <>
      <div
        aria-live="assertive"
        className="fixed inset-0 z-50 flex mobile:items-end laptop:items-start px-4 py-6 mt-16 pointer-events-none"
      >
        <div className="flex flex-col items-center w-full space-y-4 laptop:items-end">
          {appState.tx_id || appState.showTxModal ? (
            <Transition
              show={appState.showTxModal || appState.tx_id !== undefined}
              as={Fragment}
              enter="transform ease-out duration-300 transition"
              enterFrom="translate-y-2 opacity-0 translate-y-0 translate-x-2"
              enterTo="translate-y-0 opacity-100 translate-x-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="w-full max-w-sm overflow-hidden bg-blue-500 rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="shrink-0">
                      <StyledIcon as="CheckCircleIcon" size={6} solid={false} className="text-green-400" />
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                      <p className="text-m font-medium text-white">Successfully broadcasted transaction!</p>
                      <p className="mt-5 text-m font-bold">
                        <a className="text-white">Status: </a>
                        <a className={`${statusClass()}`}>{appState.tx_status.toLocaleUpperCase()}</a>
                      </p>

                      <div className="my-4">
                        <ExplorerLink txId={appState.tx_id} className="text-m font-medium text-white hover:text-black" />
                      </div>

                      <div className="bg-gray-50 text-center rounded-lg border border-gray-200">
                        {appState.currentTxMessage ? (
                          <p className={`mt-1 mb-1 text-m font-bold ${statusClass()}`}>
                            {appState.currentTxMessage.toLocaleUpperCase()}
                          </p>
                        ) : (
                          <p className="mt-1 mb-1 text-m font-bold">Transaction Result...</p>
                        )}
                      </div>
                    </div>
                    <div className="flex ml-4 shrink-0">
                      <button
                        className="inline-flex text-white rounded-md hover:text-black focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => {
                          hidePopup()
                        }}
                      >
                        <span className="sr-only bg-white">Close</span>
                        <StyledIcon as="XIcon" size={5} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          ) : null}
        </div>
      </div>
    </>
  )
}
