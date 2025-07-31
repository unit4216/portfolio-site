import { useEffect, useRef, useState } from "react";
import initSqlJs, { Database } from "sql.js";
import { initializeDatabase, DATABASE_SCHEMA } from "./databaseData";
import { askLLMForSQL, summarizeResults } from "../../services/geminiService";
import { DatabaseBrowser } from "../../components/DataChat/DatabaseBrowser";
import { ChatMessage } from "../../components/DataChat/ChatMessage";
import { LoadingIndicator } from "../../components/DataChat/LoadingIndicator";
import { CustomSpeedDial } from "../../components/DataChat/SpeedDial";

interface ChatMessage {
  role: "user" | "bot";
  text: string;
  sql?: string;
  showSql?: boolean;
}

/**
 * Main DataChat page component for interacting with database data
 */
export default function DataChatPage() {
  const [database, setDatabase] = useState<Database | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize the database with car dealership data
  useEffect(() => {
    const initializeDB = async () => {
      const SQL = await initSqlJs({ 
        locateFile: file => `https://sql.js.org/dist/${file}`
      });
      const db = new SQL.Database();
      initializeDatabase(db);
      setDatabase(db);
    };
    
    initializeDB();
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Handle user submitting a question
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !database) return;
    
    setMessages((prevMessages) => [...prevMessages, { role: "user", text: inputValue }]);
    setInputValue(""); // Clear input immediately
    setIsLoading(true);
    
    // Retry SQL generation up to 3 times
    let sql = "";
    let results: any[] = [];
    let lastError = "";
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        // 1. Ask LLM for SQL
        sql = await askLLMForSQL(inputValue, DATABASE_SCHEMA);
        
        // 2. Execute SQL
        const result = database.exec(sql);
        if (result[0]) {
          const columns = result[0].columns;
          results = result[0].values.map((row: any[]) => 
            Object.fromEntries(row.map((value: any, index: number) => [columns[index], value]))
          );
        }
        
        // If we get here, SQL executed successfully
        break;
        
      } catch (error) {
        lastError = String(error);
        
        // If this is the last attempt, show the error
        if (attempt === 3) {
          setMessages((prevMessages) => [...prevMessages, { 
            role: "bot", 
            text: `Failed to generate valid SQL after 3 attempts. Last error: ${lastError}`,
            sql: sql,
            showSql: false
          }]);
          setIsLoading(false);
          return;
        }
        
        // For debugging, log the failed SQL
        console.log(`SQL attempt ${attempt} failed:`, sql);
      }
    }
    
    // 3. Summarize results
    const summary = await summarizeResults(inputValue, results);
    setMessages((prevMessages) => [...prevMessages, { 
      role: "bot", 
      text: summary,
      sql: sql,
      showSql: false
    }]);
    setIsLoading(false);
  };

  /**
   * Toggle SQL visibility for a message
   */
  const toggleSqlVisibility = (messageIndex: number) => {
    setMessages(prevMessages => prevMessages.map((message, index) => 
      index === messageIndex ? { ...message, showSql: !message.showSql } : message
    ));
  };

  /**
   * Clear all chat messages
   */
  const handleClearChat = () => setMessages([]);

  /**
   * Handle Enter key press in input field
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#f5ebe0] flex flex-col items-center py-12 w-screen px-4 sm:px-6 lg:px-8" 
         style={{ fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
      
      {/* Speed Dial for quick actions */}
      <CustomSpeedDial 
        onNewChat={handleClearChat}
        onViewDatabases={() => setIsBrowserOpen(true)}
      />
      
      {/* Database Browser Modal */}
      <DatabaseBrowser 
        db={database} 
        open={isBrowserOpen} 
        onClose={() => setIsBrowserOpen(false)} 
      />
      
      {/* Main Chat Interface */}
      <div className="bg-[#fdf6ee] rounded-2xl shadow-sm w-full max-w-3xl p-6 flex flex-col border border-[#e5e6e4]">
        <h1 className="text-3xl font-medium mb-2 text-[#847577]" 
            style={{ fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
          DataChat
        </h1>
        <p className="mb-8 text-[#a6a2a2]" 
           style={{ fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
          Ask questions about the car dealership database. (e.g. "Who made the most sales?" or "List all cars sold in 2023.")
        </p>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-6 max-h-[500px] space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              text={message.text}
              sql={message.sql}
              showSql={message.showSql}
              onToggleSql={() => toggleSqlVisibility(index)}
            />
          ))}
          
          {isLoading && <LoadingIndicator />}
          <div ref={chatEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="flex gap-3">
          <input
            className="flex-1 bg-[#e5e6e4] border border-[#cfd2cd] rounded-lg px-4 py-2.5 text-[#847577] placeholder-[#a6a2a2] focus:outline-none focus:ring-2 focus:ring-[#cfd2cd] transition-shadow"
            placeholder="Type your question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            style={{ fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}
          />
          <button
            className="bg-[#847577] text-[#fbfbf2] px-6 py-2.5 rounded-lg font-medium shadow-sm hover:bg-[#a6a2a2] transition-colors disabled:opacity-50 disabled:hover:bg-[#847577]"
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            style={{ fontFamily: "'Neue Haas Grotesk', Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
} 