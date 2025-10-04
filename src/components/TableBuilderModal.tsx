import React, { useState } from 'react'
import { X, Plus, Minus, Table } from 'lucide-react'

interface TableBuilderModalProps {
  isOpen: boolean
  onClose: () => void
  onInsert: (rows: number, cols: number) => void
}

const TableBuilderModal: React.FC<TableBuilderModalProps> = ({ isOpen, onClose, onInsert }) => {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)

  if (!isOpen) return null

  const handleInsert = () => {
    if (rows > 0 && cols > 0 && rows <= 15 && cols <= 8) {
      onInsert(rows, cols)
      onClose()
      setRows(3)
      setCols(3)
    } else {
      alert('Please select valid dimensions:\n• Rows: 1-15\n• Columns: 1-8')
    }
  }

  const adjustValue = (current: number, delta: number, min: number, max: number) => {
    const newValue = current + delta
    return Math.max(min, Math.min(max, newValue))
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-modal-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-modal-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Table className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Create Table</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Close"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Number of Rows (including header)
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setRows(adjustValue(rows, -1, 1, 15))}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  disabled={rows <= 1}
                >
                  <Minus size={20} className={rows <= 1 ? 'text-gray-400' : 'text-gray-700'} />
                </button>
                <div className="flex-1">
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={rows}
                    onChange={(e) => setRows(adjustValue(parseInt(e.target.value) || 1, 0, 1, 15))}
                    className="w-full text-center text-2xl font-bold text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
                <button
                  onClick={() => setRows(adjustValue(rows, 1, 1, 15))}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  disabled={rows >= 15}
                >
                  <Plus size={20} className={rows >= 15 ? 'text-gray-400' : 'text-gray-700'} />
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500 text-center">
                1 header row + {rows - 1} data row{rows - 1 !== 1 ? 's' : ''}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Number of Columns
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCols(adjustValue(cols, -1, 1, 8))}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  disabled={cols <= 1}
                >
                  <Minus size={20} className={cols <= 1 ? 'text-gray-400' : 'text-gray-700'} />
                </button>
                <div className="flex-1">
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={cols}
                    onChange={(e) => setCols(adjustValue(parseInt(e.target.value) || 1, 0, 1, 8))}
                    className="w-full text-center text-2xl font-bold text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
                <button
                  onClick={() => setCols(adjustValue(cols, 1, 1, 8))}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  disabled={cols >= 8}
                >
                  <Plus size={20} className={cols >= 8 ? 'text-gray-400' : 'text-gray-700'} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Table size={16} className="mr-2 text-blue-600" />
              Preview
            </h4>
            <div className="bg-white rounded-lg p-3 overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    {Array.from({ length: cols }).map((_, colIndex) => (
                      <th
                        key={colIndex}
                        className="border border-gray-300 bg-blue-50 px-2 py-1 text-gray-700 font-semibold"
                      >
                        Header {colIndex + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: rows - 1 }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {Array.from({ length: cols }).map((_, colIndex) => (
                        <td
                          key={colIndex}
                          className="border border-gray-300 bg-white px-2 py-1 text-gray-600"
                        >
                          Cell {rowIndex + 1},{colIndex + 1}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-600 text-center">
              This is how your table will look in the editor
            </p>
          </div>
        </div>

        <div className="flex space-x-3 p-6 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Table size={18} />
            <span>Insert Table</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TableBuilderModal
