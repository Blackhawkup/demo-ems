import React, { useState } from 'react';
import { Task } from '../../types';
import { useEMS } from '../../context/EMSContext';
import { 
  Search, 
  Crosshair, 
  MapPin, 
  ArrowRight, 
  MessageSquare, 
  Phone, 
  ExternalLink,
  ShieldCheck,
  Building2,
  Navigation
} from 'lucide-react';

interface InteractiveHubMapProps {
  activeTask: Task;
  onSelectTask?: (task: Task) => void;
}

// 11 Client Associates Wealth Hubs across India
export interface HubLocation {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  x: number; // SVG viewBox x (0 - 800)
  y: number; // SVG viewBox y (0 - 700)
  isHQ?: boolean;
}

export const CA_HUBS: HubLocation[] = [
  { id: 'gurugram', name: 'Gurugram HQ', city: 'Gurugram', state: 'Haryana', address: 'DLF Cyber City, Building 10, Phase II', x: 370, y: 200, isHQ: true },
  { id: 'dehradun', name: 'Dehradun Hub', city: 'Dehradun', state: 'Uttarakhand', address: 'Rajpur Road, Near Clock Tower', x: 385, y: 155 },
  { id: 'patna', name: 'Patna Hub', city: 'Patna', state: 'Bihar', address: 'Boring Road, Commercial Complex', x: 535, y: 255 },
  { id: 'kolkata', name: 'Kolkata Hub', city: 'Kolkata', state: 'West Bengal', address: 'Park Street, Haute Street Centre', x: 595, y: 320 },
  { id: 'ahmedabad', name: 'Ahmedabad Hub', city: 'Ahmedabad', state: 'Gujarat', address: 'SG Highway, Pinnacle Business Park', x: 270, y: 320 },
  { id: 'mumbai', name: 'Mumbai Hub', city: 'Mumbai', state: 'Maharashtra', address: 'Bandra Kurla Complex (BKC), One BKC', x: 275, y: 430 },
  { id: 'pune', name: 'Pune Hub', city: 'Pune', state: 'Maharashtra', address: 'Koregaon Park, Platinum Towers', x: 300, y: 460 },
  { id: 'hyderabad', name: 'Hyderabad Hub', city: 'Hyderabad', state: 'Telangana', address: 'Road No. 36, Jubilee Hills', x: 400, y: 460 },
  { id: 'bengaluru', name: 'Bengaluru Hub', city: 'Bengaluru', state: 'Karnataka', address: 'Indiranagar 100ft Road, Prestigium', x: 380, y: 565 },
  { id: 'chennai', name: 'Chennai Hub', city: 'Chennai', state: 'Tamil Nadu', address: 'Nungambakkam High Road, Kences Towers', x: 440, y: 555 },
  { id: 'kochi', name: 'Kochi Hub', city: 'Kochi', state: 'Kerala', address: 'Marine Drive, Waterfront Square', x: 350, y: 640 },
];

export const InteractiveHubMap: React.FC<InteractiveHubMapProps> = ({ activeTask }) => {
  const { openReminderModal, setSelectedTask, setIsTaskDetailModalOpen } = useEMS();
  const [hoveredHub, setHoveredHub] = useState<HubLocation | null>(null);
  const [selectedHub, setSelectedHub] = useState<HubLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Identify origin & target hubs from the active mandate
  const originHubObj = CA_HUBS.find(
    (h) => activeTask.originHub?.toLowerCase().includes(h.city.toLowerCase())
  ) || CA_HUBS.find((h) => h.id === 'mumbai')!;

  const targetHubObj = CA_HUBS.find(
    (h) => activeTask.targetHub?.toLowerCase().includes(h.city.toLowerCase())
  ) || CA_HUBS.find((h) => h.id === 'gurugram')!;

  // Dynamic route coordinates
  const ox = originHubObj.x;
  const oy = originHubObj.y;
  const tx = targetHubObj.x;
  const ty = targetHubObj.y;

  // Midpoint with curve offset
  const mx = (ox + tx) / 2 + (tx > ox ? -35 : 35);
  const my = (oy + ty) / 2 + 25;

  // Primary assigned member for contact button
  const primaryMember = activeTask.assignedMembers[0];

  return (
    <div className="relative w-full h-full min-h-[620px] lg:min-h-[760px] bg-[#f8f9fb] rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs select-none">
      
      {/* 1. TOP WATERMARK DESTINATION LABEL (matches Screenshot 2 "• Stockholm") */}
      <div className="absolute top-6 left-8 z-10 pointer-events-none flex items-center gap-2.5">
        <div className="w-3.5 h-3.5 rounded-full bg-slate-900 ring-4 ring-slate-900/10" />
        <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          {targetHubObj.name}
        </h2>
        <span className="text-xs font-mono font-medium text-slate-400 self-end mb-1">
          {targetHubObj.state}
        </span>
      </div>

      {/* 2. TOP RIGHT FLOATING MAP CONTROLS (matches Screenshot 2 circular buttons) */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        {showSearchInput && (
          <input
            type="text"
            placeholder="Search hub or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-44 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-full shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            autoFocus
          />
        )}

        <button
          type="button"
          onClick={() => setShowSearchInput(!showSearchInput)}
          className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          title="Search wealth hubs"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedHub(targetHubObj);
            setHoveredHub(targetHubObj);
          }}
          className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          title="Center target hub"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* 3. VECTOR MAP CANVAS (Interactive Geographic Representation of India & 11 CA Hubs) */}
      <div className="absolute inset-0 w-full h-full">
        <svg
          viewBox="0 0 800 700"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Subtle grid pattern for high-tech SaaS map aesthetic */}
            <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.6" strokeDasharray="2,3" />
            </pattern>

            {/* Gradient for transit paths */}
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748b" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#1e293b" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
            </linearGradient>

            {/* Glow effect for active hub pins */}
            <filter id="hubGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Background grid */}
          <rect width="100%" height="100%" fill="url(#mapGrid)" />

          {/* India Boundary / Regional Contour Silhouette in elegant minimalist grey */}
          <path
            d="M 330 90 
               Q 380 70 410 110 
               Q 450 140 400 170 
               Q 420 190 490 200 
               Q 540 210 610 240 
               Q 670 280 620 340 
               Q 580 370 540 370 
               Q 520 420 490 480 
               Q 460 560 410 650 
               Q 370 690 350 670 
               Q 320 620 300 530 
               Q 260 470 240 400 
               Q 210 350 240 280 
               Q 260 230 310 190 
               Z"
            fill="#f1f5f9"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Tertiary geographic contour landmarks */}
          <path
            d="M 280 230 Q 340 250 430 240 Q 510 260 560 270"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1.2"
          />
          <path
            d="M 270 380 Q 350 400 450 390 Q 520 420 540 450"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1.2"
          />

          {/* 4. DYNAMIC TRANSIT ROUTE (Matches Screenshot 2 dotted + solid line to destination) */}
          {/* Leg 1: Origin to Midpoint (Dotted curve) */}
          <path
            d={`M ${ox} ${oy} Q ${mx} ${my} ${(ox + tx) / 2} ${(oy + ty) / 2}`}
            fill="none"
            stroke="#0f172a"
            strokeWidth="2.5"
            strokeDasharray="4,4"
            className="animate-pulse"
          />

          {/* Leg 2: Midpoint to Target Hub (Solid bold line) */}
          <path
            d={`M ${(ox + tx) / 2} ${(oy + ty) / 2} Q ${mx + 10} ${my - 10} ${tx} ${ty}`}
            fill="none"
            stroke="#0f172a"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Intermediate Waypoint Marker (Matches screenshot "FARSTA" stop) */}
          <g transform={`translate(${(ox + tx) / 2}, ${(oy + ty) / 2})`}>
            <circle r="7" fill="#0f172a" />
            <circle r="3" fill="#ffffff" />
            <text
              x="12"
              y="4"
              className="text-[10px] font-extrabold fill-slate-800 tracking-wider"
              fontFamily="sans-serif"
            >
              EXECUTION CHECKPOINT
            </text>
          </g>

          {/* 5. CLIENT ASSOCIATES HUBS - PINS AND LABELS */}
          {CA_HUBS.map((hub) => {
            const isOrigin = hub.id === originHubObj.id;
            const isTarget = hub.id === targetHubObj.id;
            const isHovered = hoveredHub?.id === hub.id;
            const isSelected = selectedHub?.id === hub.id;

            return (
              <g
                key={hub.id}
                className="cursor-pointer transition-transform duration-200"
                onMouseEnter={() => setHoveredHub(hub)}
                onMouseLeave={() => setHoveredHub(null)}
                onClick={() => setSelectedHub(hub)}
              >
                {/* Active pulse ring for target hub */}
                {isTarget && (
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r="18"
                    fill="#d7ff38"
                    opacity="0.4"
                    className="animate-ping"
                  />
                )}

                {/* Hub Pin Base */}
                <circle
                  cx={hub.x}
                  cy={hub.y}
                  r={isTarget ? 9 : isOrigin ? 8 : 5.5}
                  fill={isTarget ? '#0f172a' : isOrigin ? '#2563eb' : '#64748b'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  filter="url(#hubGlow)"
                />

                {/* Inner dot */}
                <circle
                  cx={hub.x}
                  cy={hub.y}
                  r={isTarget ? 3.5 : 2}
                  fill={isTarget ? '#d7ff38' : '#ffffff'}
                />

                {/* Hub City Name Label */}
                <text
                  x={hub.x + 9}
                  y={hub.y + 4}
                  className={`text-[11px] font-sans transition-all ${
                    isTarget
                      ? 'font-extrabold fill-slate-950 text-xs'
                      : isOrigin
                      ? 'font-bold fill-blue-800'
                      : 'font-medium fill-slate-600'
                  }`}
                >
                  {hub.city}
                  {hub.isHQ && ' (HQ)'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 6. FLOATING HUB DETAIL TOOLTIP (When clicking or hovering a hub) */}
      {(hoveredHub || selectedHub) && (
        <div 
          className="absolute z-20 bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-white/10 text-xs max-w-xs transition-all pointer-events-none"
          style={{
            left: `${Math.min(Math.max((hoveredHub || selectedHub)!.x / 8 - 4, 4), 60)}%`,
            top: `${Math.min(Math.max((hoveredHub || selectedHub)!.y / 7 - 12, 10), 65)}%`,
          }}
        >
          <div className="flex items-center justify-between gap-3 pb-1 border-b border-white/10">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              {(hoveredHub || selectedHub)!.name}
            </span>
            {(hoveredHub || selectedHub)!.isHQ && (
              <span className="text-[9px] bg-blue-600 text-white font-mono px-1.5 py-0.5 rounded font-bold">
                HEADQUARTERS
              </span>
            )}
          </div>
          <p className="text-[11px] text-white/70 pt-1 leading-snug">
            {(hoveredHub || selectedHub)!.address}
          </p>
        </div>
      )}

      {/* 7. FLOATING BOTTOM MANDATE CARD (Exact match to Screenshot 2 bottom card) */}
      <div className="absolute bottom-5 left-5 right-5 z-20 bg-white rounded-2xl lg:rounded-3xl border border-slate-200/90 shadow-lg p-4 sm:p-5 transition-all">
        {/* Top bar: Order ID, status badge, and right action button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-sm font-bold text-slate-900 tracking-tight">
              Order ID {activeTask.mandateId || `#${activeTask.id.replace('task-', 'CA-')}`}
            </span>

            {/* In Transit status pill (black/lime) */}
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#181513] text-[#d7ff38] tracking-wider">
              {activeTask.stageTag || (activeTask.status === 'Completed' ? 'DELIVERED' : 'IN TRANSIT')}
            </span>

            <span className="text-xs text-slate-400 hidden sm:inline">•</span>
            <span className="text-xs font-medium text-slate-600 truncate max-w-xs">
              {activeTask.title}
            </span>
          </div>

          {/* Right Action Button matching "Contact courier" in Screenshot 2 */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setSelectedTask(activeTask);
                setIsTaskDetailModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 transition-colors"
            >
              View Scope
            </button>

            {primaryMember && (
              <button
                type="button"
                onClick={() =>
                  openReminderModal('whatsapp', activeTask, primaryMember.employeeName)
                }
                className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-900 bg-white border border-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-2xs active:scale-[0.98] flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact team</span>
              </button>
            )}
          </div>
        </div>

        {/* 5-Column Metric Grid matching Screenshot 2 */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 text-xs">
          <div>
            <p className="text-[11px] text-slate-400 font-medium">From</p>
            <p className="font-bold text-slate-900 truncate mt-0.5">
              {originHubObj.city}
            </p>
            <p className="text-[10px] text-slate-500 truncate">{originHubObj.state}</p>
          </div>

          <div>
            <p className="text-[11px] text-slate-400 font-medium">To</p>
            <p className="font-bold text-slate-900 truncate mt-0.5">
              {targetHubObj.city}
            </p>
            <p className="text-[10px] text-slate-500 truncate">{targetHubObj.state}</p>
          </div>

          <div>
            <p className="text-[11px] text-slate-400 font-medium">Current Location</p>
            <p className="font-bold text-slate-900 truncate mt-0.5">
              {activeTask.originHub || originHubObj.city}
            </p>
            <p className="text-[10px] text-emerald-600 font-medium truncate">Execution Active</p>
          </div>

          <div>
            <p className="text-[11px] text-slate-400 font-medium">Allocation</p>
            <p className="font-bold text-slate-900 truncate mt-0.5">
              {activeTask.value || '₹125 Cr'}
            </p>
            <p className="text-[10px] text-slate-500 truncate">Multi-Family Office</p>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className="text-[11px] text-slate-400 font-medium">Last Stop</p>
            <p className="font-bold text-slate-900 truncate mt-0.5">
              {activeTask.status === 'Completed' ? 'Delivered to Client' : 'In Transit (SEBI Escrow)'}
            </p>
            <p className="text-[10px] text-slate-500 truncate">Due {activeTask.deadline}</p>
          </div>
        </div>
      </div>
    </div>
  );
};