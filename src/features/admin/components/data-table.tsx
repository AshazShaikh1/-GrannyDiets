import * as React from 'react'

interface DataTableProps {
  children: React.ReactNode
  headers: string[]
}

export function DataTable({ children, headers }: DataTableProps) {
  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-text-secondary">
          <thead className="bg-background border-b border-border text-xs uppercase text-text-muted">
            <tr>
              {headers.map((h, i) => (
                <th key={i} scope="col" className="px-6 py-4 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  )
}
