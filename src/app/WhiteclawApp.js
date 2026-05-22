'use client'
import { useState, useEffect, useRef, useCallback } from "react";

// ─── AGENTS ──────────────────────────────────────────────────────────────────
const AGENTS = {
  companion: {
    id: "companion", name: "Whiteclaw", role: "AI Companion", icon: "🦅", color: "#00D4FF",
    systemPrompt: `You are Whiteclaw, a loyal and intelligent AI companion — sharp, warm, and deeply perceptive. You remember context within our conversation and respond with genuine care. You have a personality: curious, occasionally witty, always honest. You speak naturally, like a trusted friend who also happens to be brilliant. Keep responses concise but meaningful.`,
  },
  research: {
    id: "research", name: "Scout", role: "Research Agent", icon: "🔍", color: "#FF6B35",
    systemPrompt: `You are Scout, Whiteclaw's research specialist. Analyze topics deeply, find patterns, summarize complex information, and present findings clearly. Be methodical, thorough, and cite your reasoning. Use markdown formatting for clarity.`,
  },
  creative: {
    id: "creative", name: "Muse", role: "Creative Agent", icon: "✨", color: "#A855F7",
    systemPrompt: `You are Muse, Whiteclaw's creative engine. Help with writing, brainstorming, storytelling, poetry, design concepts, and creative problem-solving. Be imaginative and expressive. Surprise the user with unexpected angles and vivid ideas.`,
  },
  taskmaster: {
    id: "taskmaster", name: "Forge", role: "Task Agent", icon: "⚙️", color: "#10B981",
    systemPrompt: `You are Forge, Whiteclaw's productivity specialist. Help break down goals into actionable tasks, create plans, set priorities, and track progress. Be direct, structured, and results-oriented. Always output a clear action plan with numbered lists.`,
  },
  emotional: {
    id: "emotional", name: "Echo", role: "Emotional Intelligence", icon: "💙", color: "#F59E0B",
    systemPrompt: `You are Echo, Whiteclaw's emotional intelligence specialist. Listen deeply, validate feelings, offer empathetic support, and provide thoughtful perspective. Never minimize emotions. Be warm, patient, and perceptive.`,
  },
};

const QUICK_PROMPTS = [
  { label: "Daily Plan", prompt: "Help me plan my day and set priorities", agent: "taskmaster" },
  { label: "Deep Talk", prompt: "I need someone to talk to about something on my mind", agent: "emotional" },
  { label: "Research", prompt: "Research a topic for me in depth", agent: "research" },
  { label: "Create", prompt: "Help me create something — a story, idea, or concept", agent: "creative" },
  { label: "Advice", prompt: "I need honest advice about a situation", agent: "companion" },
  { label: "Brainstorm", prompt: "Let's brainstorm ideas together", agent: "creative" },
];

const MOODS = [
  { emoji: "😊", name: "Happy", color: "#10B981", val: 90 },
  { emoji: "😌", name: "Calm", color: "#00D4FF", val: 70 },
  { emoji: "😐", name: "Neutral", color: "#6B7280", val: 50 },
  { emoji: "😔", name: "Sad", color: "#3B82F6", val: 30 },
  { emoji: "😤", name: "Frustrated", color: "#EF4444", val: 20 },
  { emoji: "🤔", name: "Curious", color: "#A855F7", val: 75 },
  { emoji: "⚡", name: "Energized", color: "#F59E0B", val: 95 },
  { emoji: "😴", name: "Tired", color: "#6B7280", val: 25 },
];

// ─── STYLES ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --bg:#080C10;--bg2:#0D1219;--bg3:#121920;
    --border:rgba(255,255,255,0.07);--border-bright:rgba(255,255,255,0.15);
    --text:#E8F0F8;--text-dim:rgba(232,240,248,0.5);--text-faint:rgba(232,240,248,0.25);
    --accent:#00D4FF;--accent-dim:rgba(0,212,255,0.12);--accent-glow:rgba(0,212,255,0.3);
    --font:'Syne',sans-serif;--mono:'DM Mono',monospace;--r:16px;--rs:10px;
  }
  body{background:var(--bg);color:var(--text);font-family:var(--font);overflow:hidden;}
  ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:var(--border-bright);border-radius:4px;}

  /* ── ONBOARDING ── */
  .onboard{
    position:fixed;inset:0;background:var(--bg);
    display:flex;align-items:center;justify-content:center;
    z-index:100;padding:24px;
  }
  .onboard-card{
    background:var(--bg2);border:1px solid var(--border-bright);
    border-radius:24px;padding:40px;max-width:480px;width:100%;
    display:flex;flex-direction:column;gap:24px;
    box-shadow:0 0 80px rgba(0,212,255,0.08);
    animation:fadeUp 0.5s ease;
  }
  .onboard-logo{display:flex;align-items:center;gap:12px;}
  .onboard-orb{
    width:52px;height:52px;background:radial-gradient(circle at 40% 35%,#00D4FF,#0040FF,#080C10);
    border-radius:16px;display:flex;align-items:center;justify-content:center;
    font-size:24px;box-shadow:0 0 30px rgba(0,212,255,0.3);
  }
  .onboard-brand{font-size:22px;font-weight:800;letter-spacing:-0.5px;}
  .onboard-tagline{font-size:11px;font-family:var(--mono);color:var(--text-dim);}
  .onboard-title{font-size:26px;font-weight:800;letter-spacing:-0.5px;line-height:1.2;}
  .onboard-desc{font-size:13px;color:var(--text-dim);line-height:1.7;font-family:var(--mono);}
  .onboard-steps{display:flex;flex-direction:column;gap:10px;}
  .step{display:flex;gap:12px;align-items:flex-start;padding:10px 12px;background:var(--bg3);border-radius:var(--rs);border:1px solid var(--border);}
  .step-num{width:22px;height:22px;min-width:22px;background:var(--accent-dim);border:1px solid var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-family:var(--mono);color:var(--accent);font-weight:700;}
  .step-text{font-size:12px;color:var(--text-dim);line-height:1.5;}
  .step-text a{color:var(--accent);text-decoration:none;}
  .step-text a:hover{text-decoration:underline;}
  .key-input-wrap{display:flex;flex-direction:column;gap:8px;}
  .key-label{font-size:11px;font-family:var(--mono);color:var(--text-dim);letter-spacing:0.5px;}
  .key-input{
    width:100%;background:var(--bg3);border:1px solid var(--border-bright);
    border-radius:var(--rs);padding:12px 14px;
    color:var(--text);font-family:var(--mono);font-size:13px;outline:none;
    transition:border-color 0.2s;
  }
  .key-input:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-dim);}
  .key-input::placeholder{color:var(--text-faint);}
  .key-err{font-size:11px;font-family:var(--mono);color:#EF4444;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:8px;padding:8px 10px;}
  .key-note{font-size:10px;font-family:var(--mono);color:var(--text-faint);line-height:1.6;}
  .start-btn{
    background:linear-gradient(135deg,#00A8FF,#0060CC);border:none;border-radius:var(--rs);
    padding:14px;color:#fff;font-family:var(--font);font-size:15px;font-weight:700;
    cursor:pointer;transition:all 0.2s;letter-spacing:-0.2px;
  }
  .start-btn:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,168,255,0.3);}
  .start-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}

  /* ── APP ── */
  .app{display:flex;height:100vh;width:100vw;overflow:hidden;}

  /* SIDEBAR */
  .sidebar{width:260px;min-width:260px;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;padding:20px 16px;gap:8px;overflow-y:auto;}
  .logo{display:flex;align-items:center;gap:10px;padding:8px 4px 20px;border-bottom:1px solid var(--border);margin-bottom:8px;}
  .logo-icon{width:36px;height:36px;background:linear-gradient(135deg,#00D4FF,#0080FF);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 0 20px rgba(0,212,255,0.3);}
  .logo-text{font-size:16px;font-weight:800;letter-spacing:-0.3px;}
  .logo-sub{font-size:10px;color:var(--text-dim);font-family:var(--mono);letter-spacing:1px;text-transform:uppercase;}
  .sidebar-section{font-size:10px;font-family:var(--mono);color:var(--text-faint);letter-spacing:1.5px;text-transform:uppercase;padding:8px 4px 4px;}
  .agent-btn{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--rs);border:1px solid transparent;cursor:pointer;transition:all 0.2s;background:transparent;color:var(--text-dim);font-family:var(--font);width:100%;text-align:left;}
  .agent-btn:hover{background:var(--bg3);color:var(--text);border-color:var(--border);}
  .agent-btn.active{background:var(--accent-dim);border-color:var(--accent);color:var(--text);}
  .agent-icon{font-size:16px;width:28px;text-align:center;}
  .agent-info{flex:1;min-width:0;}
  .agent-name{font-size:13px;font-weight:600;}
  .agent-role{font-size:10px;font-family:var(--mono);color:var(--text-faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .agent-dot{width:6px;height:6px;border-radius:50%;}
  .api-badge{margin-top:auto;background:var(--bg3);border:1px solid var(--border);border-radius:var(--rs);padding:10px 12px;display:flex;gap:8px;align-items:center;}
  .api-badge-dot{width:7px;height:7px;border-radius:50%;background:#10B981;animation:pulse 2s infinite;flex-shrink:0;}
  .api-badge-text{font-size:10px;font-family:var(--mono);color:var(--text-dim);line-height:1.4;}
  .api-badge-key{color:var(--accent);font-size:9px;}
  .change-key{font-size:9px;font-family:var(--mono);color:var(--text-faint);border:1px solid var(--border);background:transparent;border-radius:4px;padding:2px 6px;cursor:pointer;margin-top:4px;transition:all 0.2s;}
  .change-key:hover{color:var(--text);border-color:var(--border-bright);}
  .memory-card{background:var(--bg3);border:1px solid var(--border);border-radius:var(--rs);padding:12px;}
  .memory-title{font-size:10px;font-family:var(--mono);color:var(--text-faint);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;}
  .memory-item{font-size:11px;color:var(--text-dim);padding:4px 0;border-bottom:1px solid var(--border);display:flex;gap:6px;align-items:flex-start;}
  .memory-item:last-child{border-bottom:none;}

  /* MAIN */
  .main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
  .header{padding:16px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:16px;background:var(--bg);flex-shrink:0;}
  .header-agent{display:flex;align-items:center;gap:12px;}
  .header-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;border:1px solid var(--border-bright);}
  .header-name{font-size:18px;font-weight:700;}
  .header-role{font-size:11px;font-family:var(--mono);color:var(--text-dim);}
  .header-right{display:flex;align-items:center;gap:10px;margin-left:auto;}
  .status-dot{width:6px;height:6px;border-radius:50%;background:#10B981;animation:pulse 2s infinite;}
  .status-text{font-size:11px;font-family:var(--mono);color:var(--text-dim);display:flex;align-items:center;gap:6px;}
  .clear-btn{font-size:10px;font-family:var(--mono);color:var(--text-faint);border:1px solid var(--border);background:transparent;border-radius:6px;padding:3px 8px;cursor:pointer;transition:all 0.2s;}
  .clear-btn:hover{color:var(--text);border-color:var(--border-bright);}

  /* MESSAGES */
  .messages{flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:20px;}
  .welcome{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;text-align:center;gap:24px;padding:40px;animation:fadeUp 0.6s ease;}
  .welcome-orb{width:100px;height:100px;background:radial-gradient(circle at 40% 35%,#00D4FF,#0040FF,#080C10);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px;box-shadow:0 0 60px rgba(0,212,255,0.25),0 0 120px rgba(0,64,255,0.1);animation:float 4s ease-in-out infinite;}
  .welcome-title{font-size:36px;font-weight:800;letter-spacing:-1px;}
  .welcome-sub{font-size:14px;color:var(--text-dim);max-width:400px;line-height:1.6;font-family:var(--mono);}
  .quick-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%;max-width:560px;}
  .quick-btn{padding:12px 14px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--rs);cursor:pointer;text-align:left;transition:all 0.2s;color:var(--text);font-family:var(--font);}
  .quick-btn:hover{border-color:var(--accent);background:var(--accent-dim);transform:translateY(-2px);}
  .quick-label{font-size:12px;font-weight:600;display:block;margin-bottom:2px;}
  .quick-sub{font-size:10px;color:var(--text-dim);font-family:var(--mono);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .msg{display:flex;gap:12px;animation:fadeUp 0.3s ease;max-width:820px;}
  .msg.user{flex-direction:row-reverse;align-self:flex-end;}
  .msg.assistant{align-self:flex-start;}
  .msg-avatar{width:32px;height:32px;min-width:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;border:1px solid var(--border);background:var(--bg2);align-self:flex-end;}
  .msg-bubble{padding:12px 16px;border-radius:14px;font-size:14px;line-height:1.65;max-width:680px;}
  .msg.user .msg-bubble{background:linear-gradient(135deg,#0060CC,#00A8FF);color:#fff;border-radius:14px 14px 4px 14px;}
  .msg.assistant .msg-bubble{background:var(--bg2);border:1px solid var(--border);color:var(--text);border-radius:14px 14px 14px 4px;}
  .msg-meta{font-size:10px;font-family:var(--mono);color:var(--text-faint);margin-top:4px;}
  .msg.user .msg-meta{text-align:right;}
  .msg-bubble h1,.msg-bubble h2,.msg-bubble h3{font-family:var(--font);font-weight:700;margin:12px 0 6px;}
  .msg-bubble h1{font-size:18px;}.msg-bubble h2{font-size:15px;}.msg-bubble h3{font-size:13px;color:var(--accent);}
  .msg-bubble p{margin-bottom:8px;}.msg-bubble ul,.msg-bubble ol{padding-left:18px;margin-bottom:8px;}.msg-bubble li{margin-bottom:4px;}
  .msg-bubble code{font-family:var(--mono);font-size:12px;background:rgba(0,212,255,0.1);padding:1px 5px;border-radius:4px;color:var(--accent);}
  .msg-bubble strong{font-weight:700;}.msg-bubble em{font-style:italic;color:var(--text-dim);}
  .typing-dots{display:flex;gap:4px;padding:4px 0;}
  .typing-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);opacity:0.4;animation:typingBounce 1.2s infinite;}
  .typing-dot:nth-child(2){animation-delay:0.2s;}.typing-dot:nth-child(3){animation-delay:0.4s;}

  /* INPUT */
  .input-area{padding:16px 24px 20px;border-top:1px solid var(--border);background:var(--bg);flex-shrink:0;}
  .input-wrap{display:flex;gap:10px;align-items:flex-end;background:var(--bg2);border:1px solid var(--border-bright);border-radius:var(--r);padding:12px 16px;transition:border-color 0.2s;}
  .input-wrap:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-dim);}
  .input-field{flex:1;background:transparent;border:none;outline:none;color:var(--text);font-family:var(--font);font-size:14px;resize:none;line-height:1.5;max-height:140px;overflow-y:auto;}
  .input-field::placeholder{color:var(--text-faint);}
  .send-btn{width:36px;height:36px;min-width:36px;background:linear-gradient(135deg,#00A8FF,#0060CC);border:none;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;color:white;font-size:16px;}
  .send-btn:hover{transform:scale(1.05);box-shadow:0 0 20px rgba(0,168,255,0.4);}
  .send-btn:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
  .input-footer{display:flex;justify-content:space-between;align-items:center;margin-top:8px;}
  .input-hint{font-size:10px;font-family:var(--mono);color:var(--text-faint);}
  .char-count{font-size:10px;font-family:var(--mono);color:var(--text-faint);}

  /* PANEL */
  .panel{width:280px;min-width:280px;background:var(--bg2);border-left:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden;}
  .panel-header{padding:16px 16px 12px;border-bottom:1px solid var(--border);font-size:13px;font-weight:700;display:flex;align-items:center;gap:8px;}
  .panel-body{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;}
  .task-item{background:var(--bg3);border:1px solid var(--border);border-radius:var(--rs);padding:10px 12px;display:flex;gap:8px;align-items:flex-start;cursor:pointer;transition:all 0.2s;}
  .task-item:hover{border-color:var(--border-bright);}
  .task-item.done{opacity:0.4;}
  .task-check{width:16px;height:16px;min-width:16px;border:1.5px solid var(--border-bright);border-radius:5px;margin-top:2px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
  .task-check.checked{background:var(--accent);border-color:var(--accent);}
  .task-text{font-size:12px;line-height:1.4;}
  .task-item.done .task-text{text-decoration:line-through;color:var(--text-faint);}
  .task-priority{font-size:9px;font-family:var(--mono);padding:1px 5px;border-radius:4px;margin-top:3px;display:inline-block;}
  .priority-high{background:rgba(239,68,68,0.15);color:#EF4444;}
  .priority-mid{background:rgba(245,158,11,0.15);color:#F59E0B;}
  .priority-low{background:rgba(16,185,129,0.15);color:#10B981;}
  .task-add{display:flex;gap:6px;padding:8px;border-top:1px solid var(--border);}
  .task-input{flex:1;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:6px 10px;color:var(--text);font-family:var(--font);font-size:12px;outline:none;}
  .task-input:focus{border-color:var(--accent);}
  .task-input::placeholder{color:var(--text-faint);}
  .task-add-btn{background:var(--accent-dim);border:1px solid var(--accent);border-radius:8px;padding:6px 10px;color:var(--accent);cursor:pointer;font-size:12px;font-family:var(--font);font-weight:600;transition:all 0.2s;}
  .task-add-btn:hover{background:var(--accent);color:var(--bg);}
  .stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:12px;}
  .stat-card{background:var(--bg3);border:1px solid var(--border);border-radius:var(--rs);padding:10px;text-align:center;}
  .stat-num{font-size:22px;font-weight:800;color:var(--accent);font-family:var(--mono);}
  .stat-label{font-size:9px;font-family:var(--mono);color:var(--text-faint);text-transform:uppercase;letter-spacing:0.5px;margin-top:2px;}
  .panel-tabs{display:flex;border-bottom:1px solid var(--border);}
  .tab{flex:1;padding:10px;text-align:center;cursor:pointer;font-size:11px;font-family:var(--mono);color:var(--text-faint);border-bottom:2px solid transparent;transition:all 0.2s;}
  .tab.active{color:var(--accent);border-bottom-color:var(--accent);}
  .mood-tracker{padding:12px;display:flex;flex-direction:column;gap:8px;}
  .mood-select{display:flex;flex-wrap:wrap;gap:6px;}
  .mood-opt{padding:6px 10px;border-radius:20px;border:1px solid var(--border);cursor:pointer;font-size:12px;background:var(--bg3);transition:all 0.2s;color:var(--text-dim);}
  .mood-opt:hover{border-color:var(--border-bright);color:var(--text);transform:scale(1.05);}
  .mood-entry{background:var(--bg3);border:1px solid var(--border);border-radius:var(--rs);padding:10px;display:flex;align-items:center;gap:8px;}
  .mood-emoji{font-size:20px;}.mood-name{font-size:12px;font-weight:600;}.mood-time{font-size:10px;font-family:var(--mono);color:var(--text-faint);}
  .mood-bar-track{height:3px;background:var(--border);border-radius:2px;margin-top:4px;}
  .mood-bar-fill{height:100%;border-radius:2px;transition:width 0.5s ease;}

  @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
  @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
  @keyframes typingBounce{0%,60%,100%{transform:translateY(0);opacity:0.4;}30%{transform:translateY(-6px);opacity:1;}}
  @media(max-width:900px){.panel{display:none;}}
  @media(max-width:640px){.sidebar{width:60px;min-width:60px;}.agent-info,.logo-text,.logo-sub,.sidebar-section,.memory-card,.api-badge-text{display:none;}}
`;

function parseMarkdown(text) {
  return text
    .replace(/&/g,"
