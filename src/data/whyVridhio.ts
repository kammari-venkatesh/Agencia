export interface CapabilityNode {
  id: string;
  number: string;
  name: string;
  shortDesc: string;
  role: string;
  // Relative position in percent for desktop layout (-50 to +50 from center)
  x: number;
  y: number;
  mobileOrder: number;
}

export interface EditorialStatement {
  number: string;
  title: string;
  highlightLine1: string;
  highlightLine2: string;
  copy: string;
  microLabel: string;
}

export interface ComparisonStep {
  usual: string;
  usualSub: string;
  vridhio: string;
  vridhioSub: string;
}

export const whyVridhioEyebrow = 'WHY US / WHY VRIDHIO';
export const whyVridhioMainHeading = 'Not another agency.';
export const whyVridhioMainHeadingAccent = 'Your growth system.';
export const whyVridhioSubheading =
  'More than an agency — we combine strategy, technology, automation and growth to build digital systems that actually move your business forward.';

export const capabilityNodes: CapabilityNode[] = [
  {
    id: 'strategy',
    number: '01',
    name: 'STRATEGY',
    shortDesc: 'System Blueprint & Positioning',
    role: 'Core Foundation',
    x: 0,
    y: -180,
    mobileOrder: 1,
  },
  {
    id: 'technology',
    number: '02',
    name: 'TECHNOLOGY',
    shortDesc: 'Sub-Second Infrastructure',
    role: 'Engine Room',
    x: -240,
    y: -80,
    mobileOrder: 2,
  },
  {
    id: 'automation',
    number: '03',
    name: 'AUTOMATION',
    shortDesc: 'Self-Driving Workflows',
    role: 'Efficiency Matrix',
    x: 240,
    y: -80,
    mobileOrder: 3,
  },
  {
    id: 'marketing',
    number: '04',
    name: 'MARKETING',
    shortDesc: 'Demand Generation Engine',
    role: 'Attraction Field',
    x: -180,
    y: 130,
    mobileOrder: 4,
  },
  {
    id: 'growth',
    number: '05',
    name: 'GROWTH',
    shortDesc: 'Predictable Revenue Scale',
    role: 'Output Multiplier',
    x: 180,
    y: 130,
    mobileOrder: 5,
  },
];

export const editorialStatements: EditorialStatement[] = [
  {
    number: '01',
    title: 'RESULTS OVER DECORATION',
    highlightLine1: "We don't build things just to look good.",
    highlightLine2: 'We build them to move numbers.',
    copy: 'Pretty sites without conversion logic are just art projects. Every layout, animation, and flow we engineer has a clear business ROI objective.',
    microLabel: 'METRIC DRIVEN / ROI FOCUS',
  },
  {
    number: '02',
    title: 'ONE SYSTEM',
    highlightLine1: 'Design, technology and marketing',
    highlightLine2: "don't live in separate rooms.",
    copy: 'Siloed teams cause friction, delay, and broken customer journeys. We integrate strategy, code, and growth into a single unified engine.',
    microLabel: 'UNIFIED ARCHITECTURE',
  },
  {
    number: '03',
    title: 'MOVE FAST',
    highlightLine1: 'Less waiting.',
    highlightLine2: 'More shipping.',
    copy: 'Speed is a competitive advantage. We eliminate months of enterprise bureaucracy with rapid iteration loops and sub-second production deployments.',
    microLabel: 'HIGH VELOCITY EXECUTION',
  },
  {
    number: '04',
    title: 'BUILT TO SCALE',
    highlightLine1: 'Start lean.',
    highlightLine2: 'Build for what comes next.',
    copy: 'Systems engineered for immediate performance without tech debt. Designed to seamlessly handle 10x traffic and lead volumes as you scale.',
    microLabel: 'FUTURE-PROOF INFRASTRUCTURE',
  },
  {
    number: '05',
    title: 'ALWAYS HUMAN',
    highlightLine1: 'Real support. Real people.',
    highlightLine2: 'No disappearing after launch.',
    copy: 'We don’t drop source code and vanish. You get a dedicated growth engineering partner monitoring system health and optimizing conversion daily.',
    microLabel: 'DEDICATED PARTNERSHIP',
  },
];

export const comparisonSteps: ComparisonStep[] = [
  {
    usual: 'Design',
    usualSub: 'Siloed UI mockups handed over without tech specs',
    vridhio: 'Strategy',
    vridhioSub: 'Data-backed market positioning & system blueprint',
  },
  {
    usual: 'Hand-off',
    usualSub: 'Friction between designers and dev teams',
    vridhio: 'Design',
    vridhioSub: 'Conversion UX & interactive identity language',
  },
  {
    usual: 'Wait',
    usualSub: 'Months of slow enterprise back-and-forth',
    vridhio: 'Technology',
    vridhioSub: 'Sub-second modern stack built for scale',
  },
  {
    usual: 'Separate marketing',
    usualSub: 'External ad team guessing what dev built',
    vridhio: 'Automation',
    vridhioSub: 'Instant lead qualification & CRM sync',
  },
  {
    usual: 'Separate developer',
    usualSub: 'Freelancer fixing bugs on hourly rate',
    vridhio: 'Marketing',
    vridhioSub: 'High-intent demand acquisition campaigns',
  },
  {
    usual: 'More meetings',
    usualSub: 'Endless status calls with zero revenue progress',
    vridhio: 'Growth',
    vridhioSub: 'Predictable, compounding revenue engine',
  },
];
