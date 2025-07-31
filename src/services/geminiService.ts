/**
 * Service for making API calls to the Gemini endpoint
 */

/**
 * Call the Gemini API with a prompt
 * @param prompt - The prompt to send to the API
 * @returns Promise<string> - The response from the API
 */
export async function callGemini(prompt: string): Promise<string> {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorData.error || 'Failed to get response from API';
    }

    const data = await response.json();
    return data.result || "No response from Gemini.";
  } catch (error) {
    console.error('API call error:', error);
    return "Failed to connect to API. Please try again.";
  }
}

/**
 * Generate SQL from a question and database schema using LLM
 * @param question - The user's question
 * @param schemas - The database schema
 * @returns Promise<string> - The generated SQL query
 */
export async function askLLMForSQL(question: string, schemas: string): Promise<string> {
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

/**
 * Summarize SQL results using LLM
 * @param question - The original user question
 * @param results - The SQL query results
 * @returns Promise<string> - The summarized response
 */
export async function summarizeResults(question: string, results: any[]): Promise<string> {
  const prompt = `
You are a helpful assistant. Given the user's question and the SQL query results, write a concise, clear answer for the user.

Question: ${question}
Results: ${JSON.stringify(results)}

Answer:
  `.trim();
  
  return await callGemini(prompt);
} 