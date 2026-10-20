import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI SDK as per guidelines
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to reliably parse image input (file path, data URI, or raw base64)
function parseImageInput(input: string, fallbackMime: string = 'image/jpeg') {
  if (!input) return null;

  // 1. If it's a relative/absolute local file path
  if (input.startsWith('/') || input.startsWith('assets/')) {
    const cleanPath = input.startsWith('/public') ? input.slice(7) : input;
    const possiblePaths = [
      path.resolve(process.cwd(), 'public', cleanPath.replace(/^\//, '')),
      path.resolve(process.cwd(), cleanPath.replace(/^\//, '')),
      input,
    ];
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        const fileBuffer = fs.readFileSync(p);
        const ext = path.extname(p).toLowerCase();
        const mime =
          ext === '.png'
            ? 'image/png'
            : ext === '.webp'
            ? 'image/webp'
            : ext === '.svg'
            ? 'image/svg+xml'
            : 'image/jpeg';
        return { data: fileBuffer.toString('base64'), mimeType: mime };
      }
    }
  }

  // 2. If it's a base64 data URL (e.g. data:image/png;base64,...)
  if (input.startsWith('data:')) {
    const base64Match = input.match(/^data:([^;]+);base64,(.+)$/);
    if (base64Match) {
      return { mimeType: base64Match[1], data: base64Match[2] };
    }

    // If it's a non-base64 SVG data URI
    const svgMatch = input.match(/^data:image\/svg\+xml(?:;utf8)?,(.+)$/);
    if (svgMatch) {
      const decodedSvg = decodeURIComponent(svgMatch[1]);
      return {
        mimeType: 'image/svg+xml',
        data: Buffer.from(decodedSvg).toString('base64'),
        svgText: decodedSvg,
      };
    }
  }

  // 3. Raw base64 string
  return { mimeType: fallbackMime, data: input };
}

// Health & Status endpoint
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    model: 'GURU Multimodal via Gemini API',
    backendEngine: 'gemini-3.8-flash',
    hasApiKey: Boolean(apiKey && apiKey.length > 5),
    features: [
      'Visual Learning & Step-by-Step Problem Solving',
      'Sketch-to-Code & Design Prototyping',
      'Document Intelligence & Visual Data Extraction',
      'EcoField & Accessibility Lens with Audio Narration',
      'Interactive Multimodal Prototyping Playground',
    ],
  });
});

// General Multimodal Analysis Endpoint
app.post('/api/multimodal/generate', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const {
      prompt,
      imageBase64,
      mimeType = 'image/jpeg',
      systemInstruction,
      temperature = 0.4,
    } = req.body;

    if (!prompt && !imageBase64) {
      return res.status(400).json({ error: 'Prompt or image is required.' });
    }

    const parts: any[] = [];
    const parsedImg = parseImageInput(imageBase64, mimeType);

    if (parsedImg) {
      // If SVG, also add the vector description so the model has complete text context
      if (parsedImg.svgText) {
        parts.push({
          text: `[Visual Vector Blueprint Description]:\n${parsedImg.svgText}`,
        });
      }

      // Add inline image part
      parts.push({
        inlineData: {
          mimeType: parsedImg.mimeType === 'image/svg+xml' ? 'image/png' : parsedImg.mimeType,
          data: parsedImg.data,
        },
      });
    }

    if (prompt) {
      parts.push({
        text: prompt,
      });
    }

    const config: any = {
      temperature: Number(temperature) || 0.4,
    };

    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config,
    });

    const outputText = response.text || '';
    const latencyMs = Date.now() - startTime;

    return res.json({
      text: outputText,
      latencyMs,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating multimodal response:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze multimodal request',
    });
  }
});

// Specialized Sketch-to-Code endpoint
app.post('/api/multimodal/sketch-to-code', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const { imageBase64, mimeType = 'image/png' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Wireframe or sketch image is required.' });
    }

    const parsedImg = parseImageInput(imageBase64, mimeType);
    if (!parsedImg) {
      return res.status(400).json({ error: 'Invalid wireframe image data.' });
    }

    const systemInstruction = `You are an elite Staff Frontend Engineer and UI/UX Designer specializing in turning hand-drawn sketches, wireframes, and design diagrams into pixel-perfect modern web code.
Analyze the provided sketch carefully:
1. Identify all layouts, headers, hero sections, cards, forms, buttons, navbars, charts, and interactions depicted.
2. Formulate a clean, modern, accessible React + Tailwind CSS component.
3. Your output MUST contain:
   - A brief "Design Breakdown & UX Rationale" explaining the detected elements and layout structure.
   - The complete, runnable React component enclosed in a standard codeblock: \`\`\`tsx ... \`\`\`
   - Modern Tailwind styling with nice borders, gradients, hover states, and responsive design.
   - Realistic mock data and icons.
Keep the code self-contained, clean, and functional.`;

    const prompt = `Analyze this hand-drawn sketch or wireframe. Convert it into a production-quality, responsive React component styled with Tailwind CSS. Follow modern design standards with polished typography, padding, color schemes, and realistic copy.`;

    const parts: any[] = [];
    if (parsedImg.svgText) {
      parts.push({
        text: `[Wireframe Layout Blueprint]:\n${parsedImg.svgText}`,
      });
    }
    parts.push({
      inlineData: {
        mimeType: parsedImg.mimeType === 'image/svg+xml' ? 'image/png' : parsedImg.mimeType,
        data: parsedImg.data,
      },
    });
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    const outputText = response.text || '';
    const latencyMs = Date.now() - startTime;

    // Extract codeblock if present
    let extractedCode = '';
    const codeMatch = outputText.match(/```(?:tsx|jsx|typescript|javascript|html)?([\s\S]*?)```/);
    if (codeMatch && codeMatch[1]) {
      extractedCode = codeMatch[1].trim();
    }

    return res.json({
      text: outputText,
      extractedCode,
      latencyMs,
    });
  } catch (error: any) {
    console.error('Error generating sketch-to-code:', error);
    return res.status(500).json({
      error: error.message || 'Failed to transform sketch into code',
    });
  }
});

// Specialized Document & Visual Data Extraction (JSON Schema)
app.post('/api/multimodal/extract-data', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Document or chart image is required.' });
    }

    const parsedImg = parseImageInput(imageBase64, mimeType);
    if (!parsedImg) {
      return res.status(400).json({ error: 'Invalid document image data.' });
    }

    const prompt = `Extract all data, key-value pairs, line items, structural insights, and summaries from this image.
Identify whether this is an invoice/receipt, a dashboard chart, a system architecture diagram, or a data table.
Provide:
1. Executive Summary
2. Key Entities & Values
3. Structured Table / Data Points
4. Actionable Insights or Anomalies`;

    const parts: any[] = [];
    if (parsedImg.svgText) {
      parts.push({
        text: `[Document Blueprint]:\n${parsedImg.svgText}`,
      });
    }
    parts.push({
      inlineData: {
        mimeType: parsedImg.mimeType === 'image/svg+xml' ? 'image/png' : parsedImg.mimeType,
        data: parsedImg.data,
      },
    });
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        temperature: 0.1,
      },
    });

    const outputText = response.text || '';
    const latencyMs = Date.now() - startTime;

    return res.json({
      text: outputText,
      latencyMs,
    });
  } catch (error: any) {
    console.error('Error extracting data:', error);
    return res.status(500).json({
      error: error.message || 'Failed to extract visual data',
    });
  }
});

// Audio Narration TTS endpoint using gemini-3.8-flash-lite-tts
app.post('/api/multimodal/tts', async (req: Request, res: Response) => {
  try {
    const { text, voice = 'Kore' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS.' });
    }

    const trimmedText = text.slice(0, 400);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: trimmedText,
              speechMetadata: {
                style: 'Clear, helpful, and natural audio narrator',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio returned from TTS model.' });
    }

    return res.json({
      audioUrl: `data:audio/wav;base64,${base64Audio}`,
      voice,
    });
  } catch (error: any) {
    console.error('TTS generation failed:', error);
    return res.status(500).json({
      error: error.message || 'TTS generation unavailable',
      fallbackToBrowser: true,
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
