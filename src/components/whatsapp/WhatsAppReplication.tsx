import React, { useState, useEffect, useRef } from 'react';
import { useEMS } from '../../context/EMSContext';
import { 
  X, 
  Send, 
  RotateCcw, 
  Bot, 
  CheckCheck, 
  Smile, 
  Paperclip
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

type Step = 'INITIAL' | 'WAITING_EMPLOYEES' | 'WAITING_TASK' | 'WAITING_DEADLINE' | 'WAITING_CONFIRMATION' | 'COMPLETED';

export const WhatsAppReplication: React.FC = () => {
  const { isWhatsAppDemoOpen, setIsWhatsAppDemoOpen, createTask, currentUser, employees } = useEMS();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: `Welcome to Client Associates Internal Task Management Bot.\n\nType *start* to begin creating and assigning a task to your team.`,
      timestamp: '10:00 AM',
    },
  ]);

  const [input, setInput] = useState('');
  const [step, setStep] = useState<Step>('INITIAL');
  const [isTyping, setIsTyping] = useState(false);

  // Stored state data for the task being built
  const [taskData, setTaskData] = useState({
    employeesRaw: '',
    parsedEmployees: [] as string[],
    taskName: '',
    deadline: '',
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (isWhatsAppDemoOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isWhatsAppDemoOpen]);

  // Focus input on open
  useEffect(() => {
    if (isWhatsAppDemoOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isWhatsAppDemoOpen]);

  if (!isWhatsAppDemoOpen) return null;

  const getCurrentTime = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: `Chat reset.\n\nType *start* to begin creating and assigning a task to your team.`,
        timestamp: getCurrentTime(),
      },
    ]);
    setStep('INITIAL');
    setInput('');
    setIsTyping(false);
    setTaskData({
      employeesRaw: '',
      parsedEmployees: [],
      taskName: '',
      deadline: '',
    });
  };

  const addBotMessage = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text,
          timestamp: getCurrentTime(),
        },
      ]);
      setIsTyping(false);
    }, 500);
  };

  const handleSend = (textToSend?: string) => {
    const userText = (textToSend || input).trim();
    if (!userText) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: getCurrentTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Check for global restart command
    if (userText.toUpperCase() === 'START') {
      setStep('WAITING_EMPLOYEES');
      addBotMessage(
        `Welcome to Client Associates Internal Task Management Bot!\n\nI can help you create and assign tasks to your team.\n\nLet's get started.\n\nPlease enter the employee name(s) you want to assign this task to.`
      );
      return;
    }

    // Process State Machine
    switch (step) {
      case 'INITIAL': {
        if (userText.toUpperCase() === 'START') {
          setStep('WAITING_EMPLOYEES');
          addBotMessage(
            `Welcome to Client Associates Internal Task Management Bot!\n\nI can help you create and assign tasks to your team.\n\nLet's get started.\n\nPlease enter the employee name(s) you want to assign this task to.`
          );
        } else {
          addBotMessage(`Please type *start* to begin the task assignment workflow.`);
        }
        break;
      }

      case 'WAITING_EMPLOYEES': {
        const names = userText
          .split(/[,;\n]+/)
          .map((n) => n.trim())
          .filter(Boolean);

        const formattedList = names.length > 0 ? names.join('\n') : userText;
        setTaskData((prev) => ({
          ...prev,
          employeesRaw: userText,
          parsedEmployees: names.length > 0 ? names : [userText],
        }));

        setStep('WAITING_TASK');
        addBotMessage(
          `Got it! The following employees have been selected:\n\n${formattedList}\n\nNow, please enter the task you want them to work on.`
        );
        break;
      }

      case 'WAITING_TASK': {
        setTaskData((prev) => ({
          ...prev,
          taskName: userText,
        }));

        setStep('WAITING_DEADLINE');
        addBotMessage(
          `Understood!\n\nTask: ${userText}\n\nPlease enter the deadline for this task.\n\nYou can use DD/MM/YYYY format or type 'No deadline'.`
        );
        break;
      }

      case 'WAITING_DEADLINE': {
        const deadlineVal = userText;
        const assignedBullets =
          taskData.parsedEmployees.length > 0
            ? taskData.parsedEmployees.map((n) => `- ${n}`).join('\n')
            : `- ${taskData.employeesRaw}`;

        setTaskData((prev) => ({
          ...prev,
          deadline: deadlineVal,
        }));

        setStep('WAITING_CONFIRMATION');
        addBotMessage(
          `Please review the task details:\n\nTask: ${taskData.taskName}\n\nAssigned Employees:\n${assignedBullets}\n\nDeadline: ${deadlineVal}\n\nShould I proceed with creating this task?\n\nType YES to confirm or NO to cancel.`
        );
        break;
      }

      case 'WAITING_CONFIRMATION': {
        const upper = userText.toUpperCase();
        if (upper === 'YES') {
          setStep('COMPLETED');

          try {
            const matchedIds = taskData.parsedEmployees
              .map((name) => {
                const found = employees.find(
                  (e) => e.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(e.username.toLowerCase())
                );
                return found?.id;
              })
              .filter(Boolean) as string[];

            createTask({
              title: taskData.taskName || 'WhatsApp Task: General Assignment',
              description: `Created via WhatsApp Replication by ${currentUser?.name || 'Administrator'}. Assigned: ${taskData.parsedEmployees.join(', ')}.`,
              priority: 'High',
              deadline: taskData.deadline.includes('/') ? '2026-11-30' : taskData.deadline,
              assignedEmployeeIds: matchedIds.length > 0 ? matchedIds : [employees[0].id, employees[1].id],
            });
          } catch (e) {
            console.log('Task sync:', e);
          }

          addBotMessage(
            `Task successfully created!\n\nYour task has been added to the EMS system.\n\nTask Details:\n- Task: ${taskData.taskName}\n- Assigned Employees: ${taskData.parsedEmployees.join(', ')}\n- Deadline: ${taskData.deadline}\n- Status: Active\n\nNotification emails have been sent to all assigned employees.\n\nThank you for using Client Associates Internal Bot!`
          );
        } else if (upper === 'NO') {
          setStep('INITIAL');
          addBotMessage(
            `Task creation cancelled.\n\nIf you would like to start over, please type *start*.`
          );
        } else {
          addBotMessage(`Please type *YES* to confirm creating the task, or *NO* to cancel.`);
        }
        break;
      }

      case 'COMPLETED': {
        if (userText.toUpperCase() === 'START') {
          setStep('WAITING_EMPLOYEES');
          addBotMessage(
            `Welcome to Client Associates Internal Task Management Bot!\n\nI can help you create and assign tasks to your team.\n\nLet's get started.\n\nPlease enter the employee name(s) you want to assign this task to.`
          );
        } else {
          addBotMessage(
            `Task creation workflow is complete. Type *start* anytime to create another task, or click "Reset Chat".`
          );
        }
        break;
      }
    }
  };

  const getSuggestions = () => {
    switch (step) {
      case 'INITIAL':
      case 'COMPLETED':
        return ['start'];
      case 'WAITING_EMPLOYEES':
        return ['Rahul, Priya, Karan', 'Aman, Simran', 'Arjun, Rohan'];
      case 'WAITING_TASK':
        return [
          'Prepare quarterly financial analysis report',
          'Audit SEBI compliance documentation',
          'Wealth management client pitch deck',
        ];
      case 'WAITING_DEADLINE':
        return ['30/11/2026', '15/12/2026', 'No deadline'];
      case 'WAITING_CONFIRMATION':
        return ['YES', 'NO'];
      default:
        return [];
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full h-[90vh] max-h-[720px] border border-slate-300 shadow-2xl overflow-hidden flex flex-col font-sans">
        {/* WhatsApp Top Navigation Bar */}
        <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-[#128c7e] text-white flex items-center justify-center font-bold text-sm ring-2 ring-white/30">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#075e54]"></span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Client Associates Internal Bot
              </h3>
              <p className="text-[11px] text-emerald-200/90 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>online</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetChat}
              className="px-2.5 py-1 text-xs font-semibold bg-[#128c7e] hover:bg-[#0e7468] text-white rounded-lg transition-colors flex items-center gap-1"
              title="Reset Chat Session"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Chat</span>
            </button>

            <button
              type="button"
              onClick={() => setIsWhatsAppDemoOpen(false)}
              className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
              title="Close WhatsApp Demo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* WhatsApp Chat Area */}
        <div className="flex-1 whatsapp-chat-bg p-4 sm:p-5 overflow-y-auto space-y-3">
          {/* Simulation Notice */}
          <div className="text-center">
            <span className="inline-block bg-[#ffeecd] text-[#54656f] text-[10px] font-medium px-3 py-1 rounded-lg">
              Simulated WhatsApp Web environment for Client Associates task workflow.
            </span>
          </div>

          {/* Messages */}
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-in fade-in duration-100`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed relative ${
                    isBot
                      ? 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/60 shadow-2xs'
                      : 'bg-[#d9fdd3] text-slate-900 rounded-tr-xs border border-emerald-200/60 shadow-2xs'
                  }`}
                >
                  {isBot && (
                    <p className="text-[10px] font-bold text-[#128c7e] mb-1">
                      Client Associates Internal Bot
                    </p>
                  )}
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 mt-1">
                    <span>{msg.timestamp}</span>
                    {!isBot && <CheckCheck className="w-3.5 h-3.5 text-sky-500" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-slate-500 rounded-2xl rounded-tl-xs px-3.5 py-2 text-xs border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.15s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.3s]"></span>
                <span className="text-[11px] text-slate-400 font-medium ml-1">Bot is typing...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {getSuggestions().length > 0 && (
          <div className="bg-[#f0f2f5] px-4 py-2 border-t border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
              Quick replies:
            </span>
            {getSuggestions().map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSend(s)}
                className="px-2.5 py-1 text-xs font-medium bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-full border border-slate-300 shadow-2xs shrink-0 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* WhatsApp Bottom Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="bg-[#f0f2f5] px-3 sm:px-4 py-2.5 border-t border-slate-200 flex items-center gap-2 shrink-0"
        >
          <div className="flex items-center gap-1 text-slate-500">
            <button
              type="button"
              className="p-1.5 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
              title="Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-1.5 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors hidden sm:block"
              title="Attach File"
            >
              <Paperclip className="w-5 h-5" />
            </button>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message (e.g. start, YES)..."
            className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#128c7e]"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="w-9 h-9 rounded-full bg-[#128c7e] hover:bg-[#075e54] text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:hover:bg-[#128c7e] shrink-0"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
