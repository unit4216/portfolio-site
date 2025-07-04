import React, { useEffect, useRef, useState } from "react";
import initSqlJs, { Database } from "sql.js";
import { GoogleGenAI } from "@google/genai";
import { initializeDatabase } from "./databaseData";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

const gemini = new GoogleGenAI({apiKey: GEMINI_API_KEY});

async function callGemini(prompt: string): Promise<string> {
    const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

  return response.text || "No response from Gemini.";
}

// LLM: Generate SQL from question and schema
async function askLLMForSQL(question: string, schemas: string): Promise<string> {
  const prompt = `
You are an expert SQL assistant. Given the following database schema:
${schemas}

Write a single SQLite SQL query (no explanation, just the SQL) to answer this question:
"${question}"
  `.trim();
  const sql = await callGemini(prompt);
  // Extract just the SQL (strip markdown, etc)
  return sql.replace(/```sqlite|```sql|```/g, "").trim();
}

// LLM: Summarize SQL results
async function summarizeResults(question: string, results: any[]): Promise<string> {
  const prompt = `
You are a helpful assistant. Given the user's question and the SQL query results, write a concise, clear answer for the user.

Question: ${question}
Results: ${JSON.stringify(results)}

Answer:
  `.trim();
  return await callGemini(prompt);
}

// Helper to get table schemas as a string
function getTableSchemas(db: Database): string {
  const res = db.exec("SELECT name, sql FROM sqlite_master WHERE type='table'");
  if (!res[0]) return "";
  return res[0].values.map((row) => row[0]).join("\n");
}

function DatabaseBrowser({ db, open, onClose }: { db: Database | null, open: boolean, onClose: () => void }) {
  const [tables, setTables] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);

  useEffect(() => {
    if (db && open) {
      const res = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
      setTables(res[0]?.values.map((row) => String(row[0])) || []);
      setSelected(null);
      setRows([]);
      setColumns([]);
    }
  }, [db, open]);

  useEffect(() => {
    if (db && selected) {
      const res = db.exec(`SELECT * FROM ${selected}`);
      if (res[0]) {
        setColumns(res[0].columns);
        setRows(res[0].values);
      } else {
        setColumns([]);
        setRows([]);
      }
    }
  }, [db, selected]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 relative flex flex-col max-h-[80vh]">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-blue-600 text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Database Browser</h2>
        <div className="flex gap-6">
          <div className="w-48">
            <div className="font-semibold mb-2 text-gray-700">Tables</div>
            <ul className="space-y-1">
              {tables.map((t) => (
                <li key={t}>
                  <button
                    className={`w-full text-left px-3 py-1 rounded hover:bg-blue-100 text-gray-800 ${selected === t ? 'bg-blue-200 font-bold' : ''}`}
                    onClick={() => setSelected(t)}
                  >
                    {t}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 overflow-x-auto">
            {selected ? (
              <div>
                <div className="font-semibold mb-2 text-gray-700">{selected} Table</div>
                <div className="overflow-auto border rounded">
                  <table className="min-w-full text-sm text-gray-800">
                    <thead>
                      <tr>
                        {columns.map((col) => (
                          <th key={col} className="px-3 py-2 bg-blue-50 text-blue-700 font-semibold border-b">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => (
                        <tr key={i} className="even:bg-gray-50">
                          {row.map((cell: any, j: number) => (
                            <td key={j} className="px-3 py-2 border-b text-gray-800">{String(cell)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 mt-8">Select a table to view its data.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DataChatPage() {
  const [db, setDb] = useState<Database | null>(null);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [browserOpen, setBrowserOpen] = useState(false);

  // Initialize the database with car dealership data
  useEffect(() => {
    (async () => {
      const SQL = await initSqlJs({  locateFile: file => `https://sql.js.org/dist/${file}`
      });
      const db = new SQL.Database();
      initializeDatabase(db);
      setDb(db);
    })();
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle user submitting a question
  async function handleSend() {
    if (!input.trim() || !db) return;
    setMessages((msgs) => [...msgs, { role: "user", text: input }]);
    setInput(""); // Clear input immediately
    setLoading(true);
    const schemas = getTableSchemas(db);
    // 1. Ask LLM for SQL
    const sql = await askLLMForSQL(input, schemas);
    // 2. Execute SQL
    let results: any[] = [];
    try {
      const res = db.exec(sql);
      if (res[0]) {
        const cols = res[0].columns;
        results = res[0].values.map((row: any[]) => Object.fromEntries(row.map((v: any, i: number) => [cols[i], v])));
      }
    } catch (e) {
      setMessages((msgs) => [...msgs, { role: "bot", text: `SQL Error: ${String(e)}` }]);
      setLoading(false);
      return;
    }
    // 3. Summarize results
    const summary = await summarizeResults(input, results);
    setMessages((msgs) => [...msgs, { role: "bot", text: summary }]);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 flex flex-col items-center py-12 w-screen px-10">
      {/* Database Browser Button */}
      <div className="w-full max-w-2xl flex justify-end mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          onClick={() => setBrowserOpen(true)}
        >
          Browse Database
        </button>
      </div>
      <DatabaseBrowser db={db} open={browserOpen} onClose={() => setBrowserOpen(false)} />
      <div className="bg-white rounded-xl shadow-xl w-full p-8 flex flex-col">
        <h1 className="text-3xl font-bold mb-2 text-blue-700">DataChat</h1>
        <p className="mb-6 text-gray-600">Ask questions about the car dealership database. (e.g. "Who made the most sales?" or "List all cars sold in 2023.")</p>
        <div className="flex-1 overflow-y-auto mb-4 max-h-[400px]">
          <div className="flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "self-end" : "self-start"}>
                <div className={
                  msg.role === "user"
                    ? "bg-blue-100 text-blue-900 px-4 py-2 rounded-lg shadow"
                    : "bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow"
                }>
                  {msg.text}
                </div>
              </div>
            ))}
            {/* Loading chat bubble */}
            {loading && (
              <div className="self-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            disabled={loading}
          />
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
} 