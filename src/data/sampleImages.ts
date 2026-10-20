import { SampleImage } from '../types';

// Helper to create clean base64 SVG data URLs
const createSvgDataUrl = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
};

const physicsKinematicsSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
  <rect width="600" height="400" fill="#0f172a" rx="12"/>
  <path d="M 60 340 L 540 340" stroke="#475569" stroke-width="2"/>
  <path d="M 80 340 L 80 60" stroke="#475569" stroke-width="2"/>
  <text x="520" y="365" fill="#94a3b8" font-family="monospace" font-size="14">x (m)</text>
  <text x="50" y="70" fill="#94a3b8" font-family="monospace" font-size="14">y (m)</text>
  
  <!-- Trajectory Parabola -->
  <path d="M 80 340 Q 280 40 480 340" stroke="#38bdf8" stroke-width="4" stroke-dasharray="6 6" fill="none"/>
  
  <!-- Launch Vector -->
  <line x1="80" y1="340" x2="180" y2="210" stroke="#f43f5e" stroke-width="3" marker-end="url(#arrow)"/>
  <text x="130" y="240" fill="#fda4af" font-family="sans-serif" font-weight="bold" font-size="16">v₀ = 25 m/s</text>
  <path d="M 130 340 A 50 50 0 0 0 115 300" stroke="#e2e8f0" stroke-width="2" fill="none"/>
  <text x="135" y="325" fill="#e2e8f0" font-family="sans-serif" font-size="14">θ = 53°</text>

  <!-- Peak point -->
  <circle cx="280" cy="190" r="6" fill="#fbbf24"/>
  <text x="260" y="170" fill="#fde68a" font-family="monospace" font-size="14">H_max = ?</text>
  
  <!-- Target Landing point -->
  <circle cx="480" cy="340" r="6" fill="#4ade80"/>
  <text x="440" y="325" fill="#86efac" font-family="monospace" font-size="14">Range R = ?</text>
  
  <text x="180" y="80" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="20">PHYSICS: Projectile Motion Challenge</text>
  <text x="180" y="105" fill="#cbd5e1" font-family="sans-serif" font-size="14">Assume g = 9.8 m/s², negligible air resistance.</text>
  <text x="180" y="125" fill="#38bdf8" font-family="monospace" font-size="13">Find: 1) Time of flight  2) Maximum height H  3) Total Range</text>
</svg>
`);

const wireframeSketchSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" viewBox="0 0 600 420" fill="none">
  <rect width="600" height="420" fill="#f8fafc" rx="12"/>
  <rect x="30" y="30" width="540" height="360" rx="8" fill="#ffffff" stroke="#334155" stroke-width="2" stroke-dasharray="2 2"/>
  
  <!-- Sketch title bar -->
  <line x1="30" y1="80" x2="570" y2="80" stroke="#475569" stroke-width="2"/>
  <rect x="50" y="45" width="30" height="24" rx="4" fill="#3b82f6"/>
  <text x="90" y="62" fill="#1e293b" font-family="sans-serif" font-weight="bold" font-size="16">TaskFlow Pro</text>
  <rect x="420" y="45" width="60" height="25" rx="12" fill="#e2e8f0"/>
  <text x="435" y="61" fill="#475569" font-family="sans-serif" font-size="11">Sign In</text>
  <rect x="490" y="45" width="70" height="25" rx="12" fill="#2563eb"/>
  <text x="502" y="61" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="11">Get Started</text>

  <!-- Hero Section -->
  <text x="60" y="125" fill="#0f172a" font-family="sans-serif" font-weight="800" font-size="22">Collaborate in real-time with your team</text>
  <text x="60" y="150" fill="#64748b" font-family="sans-serif" font-size="13">Organize workflows, track sprint velocity, and ship 3x faster.</text>
  
  <rect x="60" y="170" width="130" height="36" rx="6" fill="#10b981"/>
  <text x="80" y="193" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="13">Start Free Trial ➔</text>
  
  <!-- 3 Feature Cards -->
  <rect x="60" y="235" width="150" height="130" rx="8" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
  <circle cx="90" cy="265" r="14" fill="#dbeafe"/>
  <text x="75" y="300" fill="#1e293b" font-family="sans-serif" font-weight="bold" font-size="14">Fast Kanban</text>
  <text x="75" y="322" fill="#64748b" font-family="sans-serif" font-size="11">Drag and drop cards with instant sync.</text>

  <rect x="225" y="235" width="150" height="130" rx="8" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
  <circle cx="255" cy="265" r="14" fill="#fef3c7"/>
  <text x="240" y="300" fill="#1e293b" font-family="sans-serif" font-weight="bold" font-size="14">Team Metrics</text>
  <text x="240" y="322" fill="#64748b" font-family="sans-serif" font-size="11">Burndown charts and sprint velocity stats.</text>

  <rect x="390" y="235" width="150" height="130" rx="8" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
  <circle cx="420" cy="265" r="14" fill="#ede9fe"/>
  <text x="405" y="300" fill="#1e293b" font-family="sans-serif" font-weight="bold" font-size="14">AI Assistant</text>
  <text x="405" y="322" fill="#64748b" font-family="sans-serif" font-size="11">Auto-summarize comments and action items.</text>
</svg>
`);

const architectureDiagramSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
  <rect width="600" height="400" fill="#090d16" rx="12"/>
  <text x="40" y="45" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="18">CLOUD MICROSERVICES INFRASTRUCTURE</text>
  <text x="40" y="65" fill="#64748b" font-family="sans-serif" font-size="12">Production System Architecture v2.4 (Evaluate for bottleneck & SPOF)</text>
  
  <!-- Clients -->
  <rect x="40" y="110" width="100" height="60" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
  <text x="60" y="135" fill="#93c5fd" font-family="sans-serif" font-weight="bold" font-size="12">Web & Mobile</text>
  <text x="65" y="152" fill="#64748b" font-family="monospace" font-size="10">HTTPS Traffic</text>

  <!-- Arrow -->
  <line x1="140" y1="140" x2="190" y2="140" stroke="#60a5fa" stroke-width="2"/>

  <!-- Load Balancer -->
  <rect x="190" y="100" width="100" height="80" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="2"/>
  <text x="200" y="130" fill="#6ee7b7" font-family="sans-serif" font-weight="bold" font-size="12">API Gateway</text>
  <text x="205" y="150" fill="#64748b" font-family="monospace" font-size="10">Envoy Proxy</text>
  <text x="210" y="165" fill="#fbbf24" font-family="monospace" font-size="9">Rate Limiter</text>

  <!-- Fork arrows -->
  <line x1="290" y1="130" x2="340" y2="110" stroke="#94a3b8" stroke-width="2"/>
  <line x1="290" y1="150" x2="340" y2="170" stroke="#94a3b8" stroke-width="2"/>

  <!-- Auth Service -->
  <rect x="340" y="85" width="100" height="50" rx="6" fill="#1e293b" stroke="#8b5cf6" stroke-width="2"/>
  <text x="350" y="110" fill="#c4b5fd" font-family="sans-serif" font-weight="bold" font-size="11">Auth Service</text>
  <text x="360" y="125" fill="#64748b" font-family="monospace" font-size="9">JWT / OAuth</text>

  <!-- Core Order Service -->
  <rect x="340" y="150" width="100" height="50" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
  <text x="348" y="175" fill="#fde68a" font-family="sans-serif" font-weight="bold" font-size="11">Order Engine</text>
  <text x="355" y="190" fill="#64748b" font-family="monospace" font-size="9">Go / gRPC</text>

  <!-- Caching & Storage Layer -->
  <rect x="475" y="85" width="90" height="50" rx="6" fill="#1e293b" stroke="#ef4444" stroke-width="2"/>
  <text x="485" y="110" fill="#fca5a5" font-family="sans-serif" font-weight="bold" font-size="11">Redis Cache</text>
  <text x="495" y="125" fill="#64748b" font-family="monospace" font-size="9">In-memory</text>

  <rect x="475" y="150" width="90" height="50" rx="6" fill="#1e293b" stroke="#06b6d4" stroke-width="2"/>
  <text x="485" y="175" fill="#67e8f9" font-family="sans-serif" font-weight="bold" font-size="11">Postgres DB</text>
  <text x="490" y="190" fill="#ef4444" font-family="monospace" font-size="9">Single Primary!</text>

  <!-- Warning annotation -->
  <rect x="40" y="270" width="525" height="90" rx="8" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5"/>
  <text x="55" y="300" fill="#a5b4fc" font-family="sans-serif" font-weight="bold" font-size="13">Architectural Review Checklist for GURU:</text>
  <text x="55" y="322" fill="#cbd5e1" font-family="sans-serif" font-size="12">1. Identify single points of failure (notice Postgres single instance with no read replicas).</text>
  <text x="55" y="342" fill="#cbd5e1" font-family="sans-serif" font-size="12">2. Propose asynchronous event queue (Kafka/RabbitMQ) for decoupled order fulfillment.</text>
</svg>
`);

const plantLeafDiagnosisSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
  <rect width="600" height="400" fill="#064e3b" rx="12"/>
  
  <!-- Leaf shape -->
  <path d="M 120 320 C 140 180 260 80 440 60 C 420 180 340 320 120 320 Z" fill="#15803d" stroke="#22c55e" stroke-width="4"/>
  <!-- Central vein -->
  <path d="M 120 320 C 220 220 320 140 440 60" stroke="#86efac" stroke-width="3" fill="none"/>
  <!-- Lateral veins -->
  <path d="M 220 230 C 200 180 180 160 170 150" stroke="#86efac" stroke-width="1.5" fill="none"/>
  <path d="M 260 190 C 290 180 330 200 350 220" stroke="#86efac" stroke-width="1.5" fill="none"/>
  <path d="M 330 135 C 310 100 290 90 280 85" stroke="#86efac" stroke-width="1.5" fill="none"/>

  <!-- Disease spots (Early Blight / Septoria brown spots with yellow halos) -->
  <circle cx="260" cy="150" r="22" fill="#ca8a04" opacity="0.4"/>
  <circle cx="260" cy="150" r="14" fill="#78350f"/>
  <circle cx="260" cy="150" r="6" fill="#451a03"/>
  <line x1="260" y1="150" x2="160" y2="80" stroke="#facc15" stroke-width="1.5"/>
  <text x="90" y="70" fill="#fef08a" font-family="sans-serif" font-weight="bold" font-size="12">Target-like concentric rings</text>

  <circle cx="340" cy="170" r="18" fill="#ca8a04" opacity="0.4"/>
  <circle cx="340" cy="170" r="10" fill="#78350f"/>
  <circle cx="340" cy="170" r="4" fill="#451a03"/>

  <!-- Header Info -->
  <rect x="30" y="20" width="540" height="35" rx="6" fill="#022c22" fill-opacity="0.8"/>
  <text x="45" y="43" fill="#6ee7b7" font-family="sans-serif" font-weight="bold" font-size="14">AGRI-DIAGNOSTIC SPECIMEN: Tomato Leaf (Solanum lycopersicum)</text>
  
  <!-- Analysis Box -->
  <rect x="300" y="270" width="270" height="100" rx="8" fill="#022c22" stroke="#059669" stroke-width="1.5"/>
  <text x="315" y="295" fill="#fef08a" font-family="sans-serif" font-weight="bold" font-size="12">Diagnosis Request:</text>
  <text x="315" y="315" fill="#d1fae5" font-family="sans-serif" font-size="11">• Pathogen identification</text>
  <text x="315" y="333" fill="#d1fae5" font-family="sans-serif" font-size="11">• Organic & chemical remediation</text>
  <text x="315" y="351" fill="#d1fae5" font-family="sans-serif" font-size="11">• Community prevention advice</text>
</svg>
`);

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'challenge-ps',
    title: 'Google DeepMind Challenge Brief',
    category: 'challenge',
    description: 'The official Google DeepMind "Best Use of GURU" hackathon problem statement image.',
    dataUrl: '/assets/aistudio/WhatsApp_Image_2026-10-17_at_11.01.17_AM_3a2b6995.jpeg',
    defaultPrompt: 'Analyze this DeepMind challenge announcement for "Best Use of GURU". Break down the 3 core criteria (Multimodal Experience, Focused AI Tools, Rapid Prototyping) and evaluate how our application satisfies every dimension with maximum impact.',
    suggestedMode: 'overview',
    tags: ['Official Brief', 'DeepMind', 'GURU', 'Hackathon Track'],
  },
  {
    id: 'learning-physics',
    title: 'Physics Projectile Motion Problem',
    category: 'learning',
    description: 'Kinematics trajectory diagram with initial velocity vector, launch angle theta, and peak height challenge.',
    dataUrl: physicsKinematicsSvg,
    defaultPrompt: 'Solve this projectile motion problem step-by-step. Show all kinematic equations for time of flight, maximum height H_max, and horizontal range R. Provide the conceptual explanation and a quick self-test quiz for a high school or undergrad physics student.',
    suggestedMode: 'learning',
    tags: ['STEM', 'Physics', 'Kinematics', 'Step-by-Step'],
  },
  {
    id: 'creativity-wireframe',
    title: 'SaaS App Landing Wireframe Sketch',
    category: 'creativity',
    description: 'Hand-drawn UI sketch featuring navbar, hero headline, CTA button, and 3 feature cards.',
    dataUrl: wireframeSketchSvg,
    defaultPrompt: 'Transform this hand-drawn wireframe sketch into a production-ready, beautiful React component styled with Tailwind CSS. Maintain clean layout structure, vibrant modern accents, accessible buttons, and responsive grid layout.',
    suggestedMode: 'creativity',
    tags: ['Sketch-to-Code', 'React', 'Tailwind', 'Wireframe'],
  },
  {
    id: 'productivity-architecture',
    title: 'Cloud Microservices Architecture',
    category: 'productivity',
    description: 'Production system diagram showing API Gateway, Auth, Order Engine, Redis, and single Postgres instance.',
    dataUrl: architectureDiagramSvg,
    defaultPrompt: 'Perform a comprehensive architectural audit of this microservices infrastructure diagram. Identify single points of failure (SPOF), evaluate scaling bottlenecks, and provide a concrete migration plan with an asynchronous event broker and database replication.',
    suggestedMode: 'productivity',
    tags: ['Architecture', 'Audit', 'DevOps', 'Reliability'],
  },
  {
    id: 'community-leaf',
    title: 'Agricultural Plant Pathology Specimen',
    category: 'community',
    description: 'Tomato plant leaf displaying diagnostic concentric lesions and chlorotic halos.',
    dataUrl: plantLeafDiagnosisSvg,
    defaultPrompt: 'Examine this plant leaf specimen for disease symptoms. Identify the suspected pathogen (e.g., Early Blight / Alternaria solani), explain the infection mechanism, and recommend immediate organic treatments and preventive crop care instructions for local smallholder farmers.',
    suggestedMode: 'community',
    tags: ['Agriculture', 'EcoField', 'Diagnostics', 'Community'],
  },
];
