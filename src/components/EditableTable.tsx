import React, { useState, useRef, useEffect } from 'react'
import { Trash2, Plus, Edit3, Check } from 'lucide-react'

interface EditableTableProps {
  rows: number
  cols: number
  initialData?: string[][]
  onUpdate?: (data: string[][]) => void
  onDelete?: () => void
}

const EditableTable: React.FC<EditableTableProps> = ({
  rows,
  cols,
  initialData,
  onUpdate,
  onDelete
}) => {
  const [tableData, setTableData] = useState<string[][]>(() => {
    if (initialData && initialData.length > 0) {
      return initialData
    }

    // Create initial data structure
    const data: string[][] = []

    // Header row
    data.push(Array.from({ length: cols }, (_, i) => `Header ${i + 1}`))

    // Data rows
    for (let i = 1; i < rows; i++) {
      data.push(Array.from({ length: cols }, (_, j) => `Cell ${i},${j + 1}`))
    }

    return data
  })

  const [editingCell, setEditingCell] = useState<{row: number, col: number} | null>(null)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingCell])

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setEditingCell({ row: rowIndex, col: colIndex })
    setEditValue(tableData[rowIndex][colIndex])
  }

  const handleCellUpdate = () => {
    if (editingCell) {
      const newData = [...tableData]
      newData[editingCell.row][editingCell.col] = editValue
      setTableData(newData)
      setEditingCell(null)

      if (onUpdate) {
        onUpdate(newData)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleCellUpdate()
    } else if (e.key === 'Escape') {
      setEditingCell(null)
    }
  }

  const addRow = () => {
    const newRow = Array.from({ length: cols }, (_, i) => `New Cell ${i + 1}`)
    const newData = [...tableData, newRow]
    setTableData(newData)

    if (onUpdate) {
      onUpdate(newData)
    }
  }

  const deleteRow = (rowIndex: number) => {
    if (tableData.length <= 2) {
      alert('Table must have at least 1 header row and 1 data row')
      return
    }

    if (rowIndex === 0) {
      alert('Cannot delete header row')
      return
    }

    const newData = tableData.filter((_, i) => i !== rowIndex)
    setTableData(newData)

    if (onUpdate) {
      onUpdate(newData)
    }
  }

  const addColumn = () => {
    if (tableData[0].length >= 8) {
      alert('Maximum 8 columns allowed')
      return
    }

    const newData = tableData.map((row, i) => [...row, i === 0 ? 'New Header' : 'New Cell'])
    setTableData(newData)

    if (onUpdate) {
      onUpdate(newData)
    }
  }

  const deleteColumn = (colIndex: number) => {
    if (tableData[0].length <= 1) {
      alert('Table must have at least 1 column')
      return
    }

    const newData = tableData.map(row => row.filter((_, i) => i !== colIndex))
    setTableData(newData)

    if (onUpdate) {
      onUpdate(newData)
    }
  }

  return (
    <div className="my-4 border-2 border-blue-200 rounded-xl p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Edit3 size={18} className="text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">Editable Table - Click cells to edit</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={addColumn}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-1"
            title="Add Column"
          >
            <Plus size={14} />
            <span>Column</span>
          </button>
          <button
            onClick={addRow}
            className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-1"
            title="Add Row"
          >
            <Plus size={14} />
            <span>Row</span>
          </button>
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-1"
              title="Delete Table"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {tableData[0]?.map((cell, colIndex) => (
                <th key={colIndex} className="border-2 border-gray-300 bg-blue-50 p-0 relative group">
                  {editingCell?.row === 0 && editingCell?.col === colIndex ? (
                    <div className="flex items-center">
                      <input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleCellUpdate}
                        className="w-full px-3 py-2 border-2 border-blue-500 rounded focus:outline-none"
                      />
                      <button
                        onClick={handleCellUpdate}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-3 py-2">
                      <span
                        onClick={() => handleCellClick(0, colIndex)}
                        className="flex-1 cursor-pointer font-semibold text-gray-700"
                      >
                        {cell || 'Click to edit'}
                      </span>
                      <button
                        onClick={() => deleteColumn(colIndex)}
                        className="opacity-0 group-hover:opacity-100 ml-2 p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-opacity duration-200"
                        title="Delete column"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex + 1} className="group">
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="border border-gray-300 p-0 relative">
                    {editingCell?.row === rowIndex + 1 && editingCell?.col === colIndex ? (
                      <div className="flex items-center">
                        <input
                          ref={inputRef}
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          onBlur={handleCellUpdate}
                          className="w-full px-3 py-2 border-2 border-blue-500 rounded focus:outline-none"
                        />
                        <button
                          onClick={handleCellUpdate}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          <Check size={14} />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => handleCellClick(rowIndex + 1, colIndex)}
                        className="px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors duration-200 text-gray-700"
                      >
                        {cell || 'Click to edit'}
                      </div>
                    )}
                  </td>
                ))}
                <td className="border-l-2 border-gray-300 p-2 bg-gray-50">
                  <button
                    onClick={() => deleteRow(rowIndex + 1)}
                    className="opacity-0 group-hover:opacity-100 p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-opacity duration-200"
                    title="Delete row"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-xs text-gray-600 bg-blue-100 px-3 py-2 rounded-lg">
        <strong>Tips:</strong> Click any cell to edit • Press Enter to save • Press Escape to cancel • Hover over rows/columns to see delete buttons
      </div>
    </div>
  )
}

export default EditableTable
