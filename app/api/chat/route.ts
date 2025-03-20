/* Creates an API endpoint for handling chat requests
   1. Recieves POST request containing message history
   2. Uses the streamText function to generate AI response
   3. Returns a streaming response to enable real-time chat
  Creates a streaming connection to Ollama runnsing locally at its default endpoint (http://localhost:11434/api)
*/
import { ollama, streamText } from "modelfusion";
import { asChatMessages } from "@modelfusion/vercel-ai";
import { Message } from "ai";

export const runtime = "edge";
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

type RequestBody = {
  messages: Message[]
};

function iterableToStream(iterable: AsyncIterable<string>) {
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of iterable) {
          controller.enqueue(chunk);
        }
        controller.close();
      } catch(error) {
        controller.error(error);
      }
    }
  });
}

export async function POST(req: Request) {
  /* 1. Extract data from request 
     2. Process with Ollama
     3. Return response 
  */


  
  const { messages } = await req.json() as RequestBody;

  try {
    const result = await streamText({
        model: ollama.ChatTextGenerator({ model: "llama3.2", host: "http://localhost:11434",}).withChatPrompt(),
        prompt: {
          system: "You are an AI chat bot. Follow the user's instructions carefully.",
          messages: asChatMessages(messages), // Map Vercel AI SDK Message to ModelFusion chatMessage
        },
    });

    const stream = iterableToStream(result);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch(error) {
    console.error("Error in chat route:", error);
    return new Response(
      JSON.stringify({ error: "Error processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json"},
      }
    );
  }
}