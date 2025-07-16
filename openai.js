const API_KEY = process.env.REACT_APP_API_KEY;
console.log("API KEY LOADED:", API_KEY);

async function sendMsgToOpenAI(message) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct:free", // this use for safety
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message }
      ]
    })
  });

  const resultText = await response.text(); //  raw response debugging ke liye
  console.log("API Response:", resultText); // for debugging

  if (!response.ok) {
    throw new Error(` API Error ${response.status}: ${resultText}`);
  }

  const data = JSON.parse(resultText);

  if (!data.choices || !data.choices[0]?.message?.content) {
    throw new Error(" Unexpected API response format");
  }

  return data.choices[0].message.content;
}

export { sendMsgToOpenAI };



