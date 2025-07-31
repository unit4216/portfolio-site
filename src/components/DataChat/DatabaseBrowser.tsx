import { useEffect, useState } from "react";
import { Database } from "sql.js";

interface DatabaseBrowserProps {
  db: Database | null;
  open: boolean;
  onClose: () => void;
}

/**
 * Database browser component for viewing table data
 */
export const DatabaseBrowser = ({ db, open, onClose }: DatabaseBrowserProps) => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableRows, setTableRows] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState<string[]>([]);

  useEffect(() => {
    if (db && open) {
      const result = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
      setTables(result[0]?.values.map((row) => String(row[0])) || []);
      setSelectedTable(null);
      setTableRows([]);
      setTableColumns([]);
    }
  }, [db, open]);

  useEffect(() => {
    if (db && selectedTable) {
      const result = db.exec(`SELECT * FROM ${selectedTable}`);
      if (result[0]) {
        setTableColumns(result[0].columns);
        setTableRows(result[0].values);
      } else {
        setTableColumns([]);
        setTableRows([]);
      }
    }
  }, [db, selectedTable]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="bg-[#fbfbf2] rounded-2xl shadow-lg w-full max-w-4xl h-[90vh] flex flex-col" 
           style={{ fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e5e6e4]">
          <h2 className="text-2xl font-medium text-[#847577]" 
              style={{ fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
            Database Browser
          </h2>
          <button 
            className="text-[#a6a2a2] hover:text-[#847577] text-2xl transition-colors" 
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden p-6 gap-6">
          {/* Table List */}
          <div className="w-48 flex-shrink-0">
            <div className="font-medium mb-3 text-[#847577]" 
                 style={{ fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
              Tables
            </div>
            <div className="overflow-y-auto max-h-full">
              <ul className="space-y-1">
                {tables.map((tableName) => (
                  <li key={tableName}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedTable === tableName 
                          ? 'bg-[#e5e6e4] text-[#847577] font-medium' 
                          : 'text-[#a6a2a2] hover:bg-[#fbfbf2] hover:text-[#847577]'
                      }`}
                      onClick={() => setSelectedTable(tableName)}
                    >
                      {tableName}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Table Data */}
          <div className="flex-1 overflow-hidden">
            {selectedTable ? (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-auto rounded-lg border border-[#e5e6e4]">
                  <table className="min-w-full text-sm divide-y divide-[#e5e6e4]">
                    <thead className="sticky top-0 bg-[#fbfbf2]">
                      <tr>
                        {tableColumns.map((column) => (
                          <th key={column} className="px-4 py-3 text-left font-medium text-[#847577] bg-[#e5e6e4]">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e6e4]">
                      {tableRows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell: any, cellIndex: number) => (
                            <td key={cellIndex} className="px-4 py-3 text-[#847577]">
                              {String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-[#a6a2a2] mt-8 text-center" 
                   style={{ fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
                Select a table to view its data
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 