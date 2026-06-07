import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "npm:@google/generative-ai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, code, context } = await req.json()

    if (!message) {
        return new Response(JSON.stringify({ error: "No message provided" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }})
    }

    const genAI = new GoogleGenerativeAI(Deno.env.get('API_KEY')!)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const systemPrompt = `You are CodeSensei AI. The user is asking a question about their code. 
User's Code: \n${code}\n
Recent context: ${context.join(" | ")}
Please provide a short, helpful answer.

User Question: ${message}`

    const result = await model.generateContent(systemPrompt)
    const responseText = result.response.text()

    return new Response(JSON.stringify({ reply: responseText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
