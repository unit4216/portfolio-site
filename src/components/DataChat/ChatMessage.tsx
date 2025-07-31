import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format as formatSQL } from "sql-formatter";

interface ChatMessageProps {
  role: "user" | "bot";
  text: string;
  sql?: string;
  showSql?: boolean;
  onToggleSql: () => void;
}

/**
 * Individual chat message component
 */
export const ChatMessage = ({ role, text, sql, showSql, onToggleSql }: ChatMessageProps) => {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] rounded-2xl shadow-sm ${
        role === "user"
          ? "bg-[#847577] text-[#fbfbf2]"
          : "bg-[#e5e6e4] text-[#847577] border border-[#cfd2cd]"
      }`}>
        <div className="px-4 py-3">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {text}
            </ReactMarkdown>
          </div>
          {role === "bot" && sql && (
            <div className="mt-2">
              <button
                onClick={onToggleSql}
                className="text-[#a6a2a2] text-sm hover:text-[#c4c0c0] transition-colors flex items-center gap-1"
              >
                {showSql ? "Hide" : "View"} SQL Query
              </button>
              {showSql && (
                <div className="mt-2 p-2 bg-[#fbfbf2] rounded-lg text-sm font-mono text-[#847577] whitespace-pre-wrap">
                  {formatSQL(sql, { language: "sqlite" })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 