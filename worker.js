export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    };

    // Hantera preflight-anrop (OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Please send a POST request", { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.text();
      
      // Vi skickar anropet till OP_NET
      const response = await fetch("https://signet.opnet.org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
      });

      const responseData = await response.text();
      
      return new Response(responseData, {
        status: response.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};
