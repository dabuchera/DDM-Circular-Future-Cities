import React from 'react'
interface ExplorerLinkProps {
  txId: string | null
  text?: string
  skipConfirmCheck?: boolean
  className?: string
}

export default function ExplorerLink({ txId, text, className }: ExplorerLinkProps) {
  let url = '#'
  if (txId) {
    let id = txId.replace('"', '')
    if (!id.startsWith('0x') && !id.includes('.')) {
      id = `0x${id}`
    }
    url = location.origin.includes('localhost')
      ? `http://localhost:3999/extended/v1/tx/${id}`
      : `https://explorer.stacks.co/txid/${id}`
    // url = location.origin.includes('localhost') ? `http://localhost:8000/txid/${id}` : `https://explorer.stacks.co/txid/${id}`
  }

  return (
    <a className={className} href={url} target="_blank" rel="noreferrer">
      {text || 'View transaction in explorer'}
    </a>
  )
}
