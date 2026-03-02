
export async function generateAgentResponse(prompt: string, history: { role: string, parts: { text: string }[] }[]) {
  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, history }),
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.warn("Non-JSON response received:", text.substring(0, 100));
      throw new Error(`Server returned HTML instead of JSON. This usually means the API route was not found or the server redirected the request. URL: ${response.url}, Status: ${response.status}`);
    }

    const data = await response.json();
    if (!response.ok) {
      const msg = data.error || 'Failed to generate response';
      const details = data.details || '';
      console.warn("AI Server Error:", msg, details);
      // Throw a more descriptive error that includes the status code if available
      const error = new Error(msg);
      (error as any).details = details;
      (error as any).code = data.code;
      throw error;
    }
    return data.text;
  } catch (error: any) {
    console.warn("AI Generation Error:", error);
    return `Error connecting to the cosmic intelligence: ${error.message || 'Please check your connection.'}`;
  }
}
