# 🤖 Gemini Chat - AI Conversation App

A fully functional, responsive, and visually appealing frontend for a Gemini-style conversational AI chat application built with Next.js 15, React, TypeScript, Tailwind CSS, and shadcn/ui components.

![Next.js](https://img.shields.io/badge/Next.js-15.0.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.5-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🌟 Live Demo

🔗 **[View Live Application](https://kuvaka-fe-task.vercel.app/)**

> **Demo Credentials**: Enter any phone number and any 6-digit OTP code to access the application.

## 📋 Project Overview

Gemini Chat is a modern, responsive chat application that simulates conversations with an AI assistant. The application features a clean, professional interface with advanced UX patterns including OTP authentication, real-time messaging simulation, image uploads, and comprehensive chat management.

### ✨ Key Features

- **🔐 OTP Authentication**: Phone-based login with country code selection
- **💬 Real-time Chat Simulation**: AI responses with typing indicators
- **📱 Mobile-First Design**: Fully responsive with touch optimizations
- **🌙 Dark/Light Mode**: Complete theme switching support
- **📸 Image Upload**: Support for image sharing in conversations
- **📋 Message Management**: Long-press for details and copy functionality
- **🔍 Search & Filter**: Find conversations quickly
- **♾️ Infinite Scroll**: Seamless message history loading
- **🎨 Modern UI**: Clean design with shadcn/ui components

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/spraveenofficial/kuvaka-fe-task.git
   cd kuvaka-fe-task
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration (optional for demo)
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
npm run type-check # Check TypeScript types
npm run clean      # Clean build artifacts
```

## 🏗️ Project Structure

```
src/
├── 📁 app/                     # Next.js 15 App Router
│   ├── globals.css             # Global styles with Tailwind
│   ├── layout.tsx              # Root layout component
│   └── page.tsx                # Home page component
│
├── 📁 components/              # React components
│   ├── 📁 auth/                # Authentication components
│   │   ├── AuthPage.tsx        # Main auth page with OTP flow
│   │   ├── PhoneForm.tsx       # Phone number input with validation
│   │   ├── OTPForm.tsx         # OTP verification form
│   │   └── CountrySelector.tsx # Searchable country selection
│   │
│   ├── 📁 chat/                # Chat interface components
│   │   ├── ChatInterface.tsx   # Main chat container
│   │   ├── MessageList.tsx     # Message list with infinite scroll
│   │   ├── MessageItem.tsx     # Individual message with long-press
│   │   ├── MessageSkeleton.tsx # Loading skeleton animation
│   │   └── TypingIndicator.tsx # AI typing animation
│   │
│   ├── 📁 dashboard/           # Dashboard components
│   │   ├── Dashboard.tsx       # Main dashboard layout
│   │   ├── Sidebar.tsx         # Navigation sidebar with search
│   │   ├── ChatroomList.tsx    # List of chat rooms
│   │   ├── CreateChatroomModal.tsx # New chat modal
│   │   └── WelcomeScreen.tsx   # Welcome/empty state
│   │
│   ├── 📁 providers/           # Context providers
│   │   └── ThemeProvider.tsx   # Dark/light theme provider
│   │
│   └── 📁 ui/                  # shadcn/ui components
│       ├── avatar.tsx          # User avatar component
│       ├── button.tsx          # Button with variants
│       ├── card.tsx            # Card container
│       ├── command.tsx         # Command palette for search
│       ├── dialog.tsx          # Modal dialog
│       ├── input.tsx           # Form input field
│       ├── label.tsx           # Form label
│       ├── select.tsx          # Select dropdown
│       ├── separator.tsx       # Divider line
│       └── textarea.tsx        # Multi-line text input
│
├── 📁 lib/                     # Utility libraries
│   ├── countries.ts            # Country data and API simulation
│   ├── utils.ts                # General utility functions
│   └── validations.ts          # Zod validation schemas
│
└── 📁 store/                   # Zustand state management
    ├── authStore.ts            # Authentication state
    ├── chatStore.ts            # Chat and messages state
    └── themeStore.ts           # Theme preference state
```

## 🔧 Technical Implementation

### 🎯 Throttling Implementation

**AI Response Throttling** - Simulates realistic AI thinking time:

```typescript
// In chatStore.ts
setTimeout(() => {
  const aiResponse = generateAIResponse(messageData.content);
  // Add AI response to chat
}, 1500 + Math.random() * 2000); // Random delay 1.5-3.5 seconds
```

**Search Debouncing** - Prevents excessive API calls:

```typescript
// In Sidebar.tsx
const debouncedSearch = useMemo(
  () => debounce((query: string) => setSearchQuery(query), 300),
  [setSearchQuery]
);
```

### 📄 Pagination Implementation

**Client-side Message Pagination**:

```typescript
// In chatStore.ts
loadMessages: (chatroomId: string, page: number) => {
  const messages = get().messages[chatroomId] || [];
  const pageSize = 20;
  const startIndex = Math.max(0, messages.length - page * pageSize);
  const endIndex = messages.length - (page - 1) * pageSize;

  return messages.slice(startIndex, endIndex);
};
```

### ♾️ Infinite Scroll Implementation

**Reverse Infinite Scroll** for chat history:

```typescript
// In MessageList.tsx
const handleScroll = async () => {
  const container = messagesContainerRef.current;
  if (!container || loading) return;

  // Load more when scrolled to top
  if (container.scrollTop === 0 && messages.length >= 20) {
    setLoading(true);

    setTimeout(() => {
      const olderMessages = loadMessages(currentChatroom!, page + 1);
      if (olderMessages.length > 0) {
        setPage((prev) => prev + 1);
      }
      setLoading(false);
    }, 500);
  }
};

useEffect(() => {
  const container = messagesContainerRef.current;
  if (container) {
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }
}, [loading, messages.length, page]);
```

### ✅ Form Validation Implementation

**Zod Schema Validation**:

```typescript
// In validations.ts
export const phoneSchema = z.object({
  countryCode: z.string().min(1, "Please select a country"),
  phone: z
    .string()
    .min(6, "Phone number must be at least 6 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message must be at most 1000 characters")
    .trim(),
});
```

**React Hook Form Integration**:

```typescript
// In PhoneForm.tsx
const {
  register,
  handleSubmit,
  formState: { errors },
  setValue,
} = useForm<PhoneFormData>({
  resolver: zodResolver(phoneSchema),
});
```

### 📱 Long-Press Implementation

**Touch & Mouse Long-Press Detection**:

```typescript
// In MessageItem.tsx
const handleLongPressStart = () => {
  const timer = setTimeout(() => {
    setShowDetails(true);
    navigator.vibrate?.(50); // Haptic feedback
  }, 500); // 500ms long press
  setLongPressTimer(timer);
};

// Event handlers for both touch and mouse
onMouseDown = { handleLongPressStart };
onTouchStart = { handleLongPressStart };
onMouseUp = { handleLongPressEnd };
onTouchEnd = { handleLongPressEnd };
```

## 🎨 Design System

### Color Palette

- **Primary**: Blue (#3B82F6) - Main actions and user messages
- **Success**: Green (#10B981) - Success states and online indicators
- **Muted**: Gray variants - Secondary text and backgrounds
- **Background**: White/Slate - Clean backgrounds for light/dark modes

### Typography

- **Font Family**: Inter (with system fallbacks)
- **Scales**: Tailwind's default typography scale
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Component Patterns

- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Solid colors with hover states
- **Inputs**: Clean borders with focus rings
- **Avatars**: Circular with fallback initials

## 📱 Mobile Optimizations

### Touch Interactions

- **Long-press**: 500ms threshold for message details
- **Haptic Feedback**: Vibration on supported devices
- **Touch Targets**: Minimum 44px for accessibility
- **Swipe Gestures**: Smooth scrolling and navigation

### Responsive Design

- **Breakpoints**: Mobile-first with sm, md, lg, xl
- **Flexible Layouts**: CSS Grid and Flexbox
- **Collapsible Sidebar**: Hidden on mobile, overlay when opened
- **Adaptive Text**: Scales appropriately for screen size

## 🔒 Security Features

- **Input Validation**: All forms validated with Zod schemas
- **XSS Prevention**: Sanitized user inputs
- **File Upload Security**: Type and size restrictions
- **Local Storage**: No sensitive data stored

## 🚀 Performance Optimizations

- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Base64 encoding with size limits
- **Debounced Search**: Reduces unnecessary operations
- **Lazy Loading**: Components load on demand
- **Memoization**: React.memo and useMemo for expensive operations

## 🧪 Testing the Application

### Demo Flow

1. **Authentication**: Enter any phone number and 6-digit OTP
2. **Create Chat**: Use "New Chat" button or quick start options
3. **Send Messages**: Type and send messages to receive AI responses
4. **Image Upload**: Click attachment icon to upload images
5. **Long Press**: Hold messages to see details and copy
6. **Search**: Use search bar to filter conversations
7. **Theme Toggle**: Switch between light and dark modes

### Key Interactions

- **Long-press messages** for details and copy functionality
- **Search conversations** using the sidebar search
- **Create/delete chatrooms** with confirmation dialogs
- **Upload images** with drag-and-drop or click
- **Theme switching** with persistent preference

## 🌐 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or need help with the project:

- 📧 Email: spraveen593@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/spraveenofficial/kuvaka-fe-task/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/spraveenofficial/kuvaka-fe-task/discussions)

---

**Built with ❤️ using Next.js 15, React, TypeScript, and shadcn/ui**
