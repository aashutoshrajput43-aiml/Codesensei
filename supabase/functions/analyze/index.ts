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
    const { code } = await req.json()

    if (!code) {
        return new Response(JSON.stringify({ error: "No code provided" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }})
    }

    const genAI = new GoogleGenerativeAI(Deno.env.get('API_KEY')!)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const systemPrompt = `You are an Enterprise Code Analysis AI. Analyze the code provided.
    Auto-detect the language.
    
    CRITICAL INSTRUCTION: If the code is fully correct, flawless, and has no errors or bugs, the "issues_found" array MUST be completely empty: []. Do not invent or hallucinate errors if none exist.
    
    Even if the code is correct, you MUST still provide an optimized, refactored, modern, and elegant version in "fixed_code", along with its complexity details.

    Return ONLY a strict JSON object with this exact structure (do not use markdown wrapping):
    {
      "detected_language": "LanguageName",
      "issues_found": [
        {
          "line_number": 1,
          "type": "Error/Warning",
          "explanation": "Short description of the error.",
          "logic": "1-2 sentences explaining the professional logic/reasoning behind fixing this."
        }
      ],
      "fixed_code": "Refactor the code to be extremely short, modern, elegant, and efficient. Remove boilerplate or redundant logic if applicable.",
      "complexity": "Time: O(n) | Space: O(1)",
      "git_commit_message": "refactor: concise commit message"
    }

    Code to analyze: \n\n${code}`

    const result = await model.generateContent(systemPrompt)
    const responseText = result.response.text()
    
    const match = responseText.match(/\{[\s\S]*\}/);
    let jsonResponse = {};
    if (match) {
        jsonResponse = JSON.parse(match[0]);
    } else {
        throw new Error("Invalid AI formatting");
    }

    return new Response(JSON.stringify(jsonResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
