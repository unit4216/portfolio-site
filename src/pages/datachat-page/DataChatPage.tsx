import React, { useEffect, useRef, useState } from "react";
// @ts-ignore
import initSqlJs, { Database } from "sql.js";
import { GoogleGenAI } from "@google/genai";

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
  return res[0].values.map(([name, sql]: [string, string]) => sql).join("\n");
}

export default function DataChatPage() {
  const [db, setDb] = useState<Database | null>(null);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize the database with car dealership data
  useEffect(() => {
    (async () => {
      const SQL = await initSqlJs({  locateFile: file => `https://sql.js.org/dist/${file}`
      });
      const db = new SQL.Database();
      // Create tables
      db.run(`
        CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, role TEXT);
        CREATE TABLE cars (id INTEGER PRIMARY KEY, make TEXT, model TEXT, year INTEGER, price INTEGER);
        CREATE TABLE sales (id INTEGER PRIMARY KEY, car_id INTEGER, employee_id INTEGER, customer_name TEXT, sale_date TEXT, price INTEGER);
      `);
      // Insert sample employees
      db.run(`
        INSERT INTO employees (name, role) VALUES
          ('Alice Johnson', 'Sales'),
          ('Bob Smith', 'Manager'),
          ('Carol Lee', 'Sales');
      `);
      // Insert sample cars
      db.run(`
        INSERT INTO cars (make, model, year, price) VALUES
          ('Toyota', 'Camry', 2020, 22000),
          ('Honda', 'Civic', 2019, 18000),
          ('Ford', 'F-150', 2021, 35000),
          ('Tesla', 'Model 3', 2022, 42000);
      `);
      // Insert sample sales
      db.run(`
        INSERT INTO sales (car_id, employee_id, customer_name, sale_date, price) VALUES
          (1, 1, 'John Doe', '2023-01-15', 21000),
          (2, 3, 'Jane Roe', '2023-02-10', 17500),
          (3, 1, 'Mike Brown', '2023-03-05', 34000),
          (4, 2, 'Sara White', '2023-03-20', 41000);
      `);
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
      setInput("");
      return;
    }
    // 3. Summarize results
    const summary = await summarizeResults(input, results);
    setMessages((msgs) => [...msgs, { role: "bot", text: summary }]);
    setLoading(false);
    setInput("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 flex flex-col items-center py-12 w-screen px-10">
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