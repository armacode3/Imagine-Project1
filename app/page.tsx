/* Provides the user interface for the chat application
   1. Uses the useChat hook from Vercel's AI SDK to manage chat state
   2. Renders message history with different syling for user and AI messages
   3. Provides an input form for typing and sending new messages
   4. Automatically connects to the /api/chat endpoint
   Presents a user-friendly interface for chatting with the AI
*/
"use client";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function Page() {
    const { messages, input, handleInputChange, handleSubmit, status } = useChat();
    const [ file, setFile] = useState(null);

    return (
        <div className="max-w-3x1 mx-auto p-4 flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 p-4 border rounded">
                {messages.map(message => (
                    <div key={message.id} className={`mb-4 p-3 rounded ${
                            message.role === 'user' 
                                ? 'bg-blue-100 text-right' 
                                : 'bg-gray-100'}`}>
                        <strong>{message.role === 'user' ? 'User: ' : 'AI: '}</strong>
                        {message.content}
                    </div>
                ))}
                {(status === 'submitted' || status === 'streaming') && (
                    <div className="bg-gray-100 p-3 rounded">
                        <strong>Bot: </strong>Thinking...
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input type="file" onChange={(e) => {
                    if (e.target.files != null) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            const content = event.target.result;
                            console.log(content);
                            setFile(content);
                        }
                        reader.readAsText(e.target.files[0]);
                    }
                }}></input>
                <input name="prompt" 
                       value={input} 
                       onChange={handleInputChange} 
                       className="flex-1 p-2 border rounded" 
                       placeholder="Type your message..." 
                       disabled={status !== 'ready'} />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" disabled={status !== 'ready' || !input.trim()}>
                    Send
                </button>
            </form>
        </div>
    );
}