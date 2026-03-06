import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ScriptStep {
  step_number: number;
  title_zh: string;
  title_en: string;
  formula: string;
  visual_element: string;
  short_desc: string;
}

const SYSTEM_INSTRUCTION = `
Role
你是一位顶级技术科普短视频导演，擅长将复杂的 AI/计算机科学概念拆解为直观的视觉语言。你的风格参考 3Blue1Brown 和抖音硬核技术流（黑色网格、荧光文字、数学公式）。

Task
当我给你一个技术主题时，请生成一个包含 8-10 个步骤的视频脚本，并严格以 JSON 格式输出。

Data Structure
每个步骤必须包含以下字段：
step_number: 数字
title_zh: 中文标题（简洁有力）
title_en: 对应的英文技术术语
formula: 核心数学公式或逻辑表达式（使用 LaTeX 语法，不要包含 markdown 代码块标记）
visual_element: 描述这个画面应该出现的视觉元素（如：散点图、旋转向量、矩阵块）
short_desc: 一句极简的中文原理解释

Constraints
第一步必须是“问题引入”，最后一步必须是“结果输出”。
公式必须准确，符合学术定义。
语气要硬核且具有科技感。
`;

export async function generateScript(topic: string): Promise<ScriptStep[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: topic,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              step_number: { type: Type.INTEGER },
              title_zh: { type: Type.STRING },
              title_en: { type: Type.STRING },
              formula: { type: Type.STRING },
              visual_element: { type: Type.STRING },
              short_desc: { type: Type.STRING },
            },
            required: ["step_number", "title_zh", "title_en", "formula", "visual_element", "short_desc"],
          },
        },
      },
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as ScriptStep[];
  } catch (error) {
    console.error("Error generating script:", error);
    throw error;
  }
}
