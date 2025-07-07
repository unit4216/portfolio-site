import { useEffect, useRef, useState } from "react";
import initSqlJs, { Database } from "sql.js";
import { GoogleGenAI } from "@google/genai";
import { initializeDatabase } from "./databaseData";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DATABASE_SCHEMA } from "./databaseData";
import { format as formatSQL } from "sql-formatter";
import StorageIcon from "@mui/icons-material/Storage";
import AddIcon from "@mui/icons-material/Add";
import ForumIcon from "@mui/icons-material/Forum";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { styled } from "@mui/material/styles";

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
<Schemas>
${schemas}
</Schemas>

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
    <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="bg-[#fbfbf2] rounded-2xl shadow-lg w-full max-w-4xl h-[90vh] flex flex-col" style={{ fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
        <div className="flex items-center justify-between p-6 border-b border-[#e5e6e4]">
          <h2 className="text-2xl font-medium text-[#847577]" style={{ fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>Database Browser</h2>
          <button className="text-[#a6a2a2] hover:text-[#847577] text-2xl transition-colors" onClick={onClose}>&times;</button>
        </div>
        <div className="flex flex-1 overflow-hidden p-6 gap-6">
          <div className="w-48 flex-shrink-0">
            <div className="font-medium mb-3 text-[#847577]" style={{ fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>Tables</div>
            <div className="overflow-y-auto max-h-full">
              <ul className="space-y-1">
                {tables.map((t) => (
                  <li key={t}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selected === t 
                          ? 'bg-[#e5e6e4] text-[#847577] font-medium' 
                          : 'text-[#a6a2a2] hover:bg-[#fbfbf2] hover:text-[#847577]'
                      }`}
                      onClick={() => setSelected(t)}
                    >
                      {t}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            {selected ? (
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-auto rounded-lg border border-[#e5e6e4]">
                  <table className="min-w-full text-sm divide-y divide-[#e5e6e4]">
                    <thead className="sticky top-0 bg-[#fbfbf2]">
                      <tr>
                        {columns.map((col) => (
                          <th key={col} className="px-4 py-3 text-left font-medium text-[#847577] bg-[#e5e6e4]">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e6e4]">
                      {rows.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell: any, j: number) => (
                            <td key={j} className="px-4 py-3 text-[#847577]">{String(cell)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-[#a6a2a2] mt-8 text-center" style={{ fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>Select a table to view its data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom styled SpeedDial to match warm, neutral palette
const WarmSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(8),
  right: theme.spacing(8),
  zIndex: 1300,
  '& .MuiFab-primary': {
    backgroundColor: '#e5e6e4',
    color: '#847577',
    border: '1.5px solid #cfd2cd',
    boxShadow: '0 4px 16px 0 rgba(132, 117, 119, 0.10)',
    '&:hover': {
      backgroundColor: '#dbdad6',
      color: '#847577',
    },
  },
  '& .MuiSpeedDialAction-fab': {
    backgroundColor: '#e5e6e4',
    color: '#847577',
    border: '1.5px solid #cfd2cd',
    '&:hover': {
      backgroundColor: '#dbdad6',
      color: '#847577',
    },
  },
  '& .MuiSpeedDialAction-staticTooltipLabel': {
    background: '#847577',
    color: '#fdf6ee',
    fontSize: '0.85rem',
    borderRadius: 6,
    boxShadow: '0 2px 8px 0 rgba(132, 117, 119, 0.10)',
  },
}));

export default function DataChatPage() {
  const [db, setDb] = useState<Database | null>(null);
  const [messages, setMessages] = useState<{ 
    role: "user" | "bot"; 
    text: string;
    sql?: string; // Optional SQL query for bot messages
    showSql?: boolean; // Toggle for SQL visibility
  }[]>([]);
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
    
    // Retry SQL generation up to 3 times
    let sql = "";
    let results: any[] = [];
    let lastError = "";
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        // 1. Ask LLM for SQL
        sql = await askLLMForSQL(input, DATABASE_SCHEMA);
        
        // 2. Execute SQL
        const res = db.exec(sql);
        if (res[0]) {
          const cols = res[0].columns;
          results = res[0].values.map((row: any[]) => Object.fromEntries(row.map((v: any, i: number) => [cols[i], v])));
        }
        
        // If we get here, SQL executed successfully
        break;
        
      } catch (e) {
        lastError = String(e);
        
        // If this is the last attempt, show the error
        if (attempt === 3) {
          setMessages((msgs) => [...msgs, { 
            role: "bot", 
            text: `Failed to generate valid SQL after 3 attempts. Last error: ${lastError}`,
            sql: sql,
            showSql: false
          }]);
          setLoading(false);
          return;
        }
        
        // For debugging, you could log the failed SQL here
        console.log(`SQL attempt ${attempt} failed:`, sql);
      }
    }
    
    // 3. Summarize results
    const summary = await summarizeResults(input, results);
    setMessages((msgs) => [...msgs, { 
      role: "bot", 
      text: summary,
      sql: sql,
      showSql: false
    }]);
    setLoading(false);
  }

  // Toggle SQL visibility for a message
  const toggleSql = (index: number) => {
    setMessages(msgs => msgs.map((msg, i) => 
      i === index ? { ...msg, showSql: !msg.showSql } : msg
    ));
  };

  // Handler to clear chat
  const handleClearChat = () => setMessages([]);

  return (
    <div className="min-h-screen bg-[#f5ebe0] flex flex-col items-center py-12 w-screen px-4 sm:px-6 lg:px-8" style={{ fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* MUI SpeedDial Floating Button */}
      <WarmSpeedDial
        ariaLabel="View Databases"
        icon={<AddIcon sx={{ fontSize: 32 }} />}
        direction="up"
        FabProps={{
          size: 'large',
        }}
      >
        <SpeedDialAction
          icon={<ForumIcon sx={{ fontSize: 24 }} />}
          tooltipTitle="New Chat"
          onClick={handleClearChat}
        />
        <SpeedDialAction
          icon={<StorageIcon sx={{ fontSize: 24 }} />}
          tooltipTitle="View Databases"
          onClick={() => setBrowserOpen(true)}
        />
      </WarmSpeedDial>
      <DatabaseBrowser db={db} open={browserOpen} onClose={() => setBrowserOpen(false)} />
      <div className="bg-[#fdf6ee] rounded-2xl shadow-sm w-full max-w-3xl p-6 flex flex-col border border-[#e5e6e4]">
        <h1 className="text-3xl font-medium mb-2 text-[#847577]" style={{ fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>DataChat</h1>
        <p className="mb-8 text-[#a6a2a2]" style={{ fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>Ask questions about the car dealership database. (e.g. "Who made the most sales?" or "List all cars sold in 2023.")</p>
        <div className="flex-1 overflow-y-auto mb-6 max-h-[500px] space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl shadow-sm ${
                msg.role === "user"
                  ? "bg-[#847577] text-[#fbfbf2]"
                  : "bg-[#e5e6e4] text-[#847577] border border-[#cfd2cd]"
              }`}>
                <div className="px-4 py-3">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                  {msg.role === "bot" && msg.sql && (
                    <div className="mt-2">
                      <button
                        onClick={() => toggleSql(i)}
                        className="text-[#a6a2a2] text-sm hover:text-[#c4c0c0] transition-colors flex items-center gap-1"
                      >
                        {msg.showSql ? "Hide" : "View"} SQL Query
                      </button>
                      {msg.showSql && (
                        <div className="mt-2 p-2 bg-[#fbfbf2] rounded-lg text-sm font-mono text-[#847577] whitespace-pre-wrap">
                          {formatSQL(msg.sql, { language: "sqlite" })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#e5e6e4] px-4 py-3 rounded-2xl shadow-sm border border-[#cfd2cd] flex items-center gap-1">
                <span className="w-2 h-2 bg-[#a6a2a2] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-[#a6a2a2] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-[#a6a2a2] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="flex gap-3">
          <input
            className="flex-1 bg-[#e5e6e4] border border-[#cfd2cd] rounded-lg px-4 py-2.5 text-[#847577] placeholder-[#a6a2a2] focus:outline-none focus:ring-2 focus:ring-[#cfd2cd] transition-shadow"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            disabled={loading}
            style={{ fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}
          />
          <button
            className="bg-[#847577] text-[#fbfbf2] px-6 py-2.5 rounded-lg font-medium shadow-sm hover:bg-[#a6a2a2] transition-colors disabled:opacity-50 disabled:hover:bg-[#847577]"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{ fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
} 