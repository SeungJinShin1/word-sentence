export const generateLearningContent = async (keywords) => {
    // .env 파일에 VITE_GEMINI_API_KEY=your_key_here 로 저장된 키를 불러옵니다.
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 
    
    const systemPrompt = `
    당신은 초등학교 교사를 돕는 따뜻하고 친절한 AI 보조교사입니다.
    입력된 [수업 핵심 키워드]들을 모두 포함하여, 초등학생이 이해하기 쉬운 1개의 "학습 정리 문장"을 만들어주세요.
    반드시 다음 JSON 스키마를 준수하세요.
    응답 형식(JSON):
    {
      "original_sentence": "생성된 문장",
      "keywords": ["문장에 쓰인 키워드"],
      "scrambled_words": ["문장을", "어절 단위로", "쪼개어", "섞은", "배열"]
    }
    `;
    const userPrompt = `수업 핵심 키워드: ${keywords}`;
  
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
          }),
        }
      );
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!resultText) throw new Error("No content generated");
      return JSON.parse(resultText);
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  };