# Session 3 - 🤖 Agentic AI Stock Analyzer  Chrome Extension

A sophisticated Chrome extension that uses **Agentic AI** powered by **Gemini** and **Exa Search** to analyze stocks through multiple tool calls and LLM interactions. This plugin demonstrates the agentic pattern by making multiple Gemini calls with accumulated context to provide comprehensive stock analysis.

## 🌟 Features

### Agentic AI Pattern
The extension follows the agentic pattern you requested:
```
Query → LLM Response → Tool Call: Tool Result → Query → LLM Response → Tool Call: Tool Result → Query → LLM Response → Result
```

### Core Tools
1. **Stock Price Fetcher**: Dynamically fetches real-time stock prices using Yahoo Finance API
2. **News Analyzer**: Retrieves top news stories related to the stock symbol using Exa Search
3. **Multi-step AI Analysis**: Performs comprehensive analysis through multiple Gemini LLM interactions

### Analysis Workflow
1. **Step 1**: Fetch current stock price and market data
2. **Step 2**: Gemini AI analyzes price data and requests additional information
3. **Step 3**: Fetch recent news articles about the stock using Exa Search
4. **Step 4**: Gemini AI performs comprehensive analysis combining price and news data
5. **Step 5**: Generate final trading recommendation using Gemini

## 🚀 Setup Instructions

### 1. API Keys Required
You'll need these API keys:

#### Gemini API Key (Free)
- Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
- Create a Google account and generate an API key
- Copy the key

#### Exa Search API Key (Free tier available)
- Go to [Exa.ai](https://exa.ai/)
- Register for an account
- Get your API key from the dashboard

### 2. Install the Extension

#### Method 1: Developer Mode (Recommended)
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the folder containing these extension files
5. The extension should now appear in your toolbar

#### Method 2: Pack and Install
1. In Chrome extensions page, click "Pack extension"
2. Select the extension folder
3. Install the generated `.crx` file

### 3. Configure API Keys
1. Click the extension icon in your toolbar
2. Enter your Gemini API key in the first field
3. Enter your Exa Search API key in the second field
4. Click "Save API Keys"

## 📋 Usage

1. **Enter Stock Symbol**: Type any stock symbol (e.g., AAPL, TSLA, GOOGL)
2. **Click Analyze**: Press the "Analyze Stock" button
3. **Watch the Agent Work**: The AI will go through multiple steps:
   - Fetch real-time stock price
   - Analyze price data
   - Fetch recent news
   - Perform comprehensive analysis
   - Generate trading recommendations

## 🔧 Technical Implementation

### Agentic Architecture
The extension implements true agentic behavior by:
- **Maintaining conversation history** across all LLM calls
- **Making sequential tool calls** based on AI decisions
- **Accumulating context** from each step to inform the next
- **Self-directing analysis** where the AI requests additional data

### Tools Implementation

#### Stock Price Tool (`fetchStockPrice`)
```javascript
// Uses Yahoo Finance API for real-time data
const stockData = await fetchStockPrice(symbol);
// Returns: price, change, volume, market cap, etc.
```

#### News Tool (`fetchStockNews`)
```javascript
// Uses Exa Search for recent articles
const newsData = await fetchStockNews(symbol);
// Returns: articles with titles, URLs, sources, dates
```

#### LLM Integration (`callGemini`)
```javascript
// Maintains conversation history for agentic behavior
this.conversationHistory.push(newMessage);
const response = await callGemini(this.conversationHistory);
```

### Security Features
- API keys stored locally using Chrome Storage API
- CORS headers handled by background script
- Content Security Policy implemented
- No sensitive data transmitted to external servers

## 🎯 Agentic Examples

### Example 1: Tesla Analysis
```
User Input: TSLA
↓
Step 1: Fetch TSLA price → $245.67 (-2.3%)
↓
Step 2: Gemini AI analyzes price → "Stock is down, need news context"
↓
Step 3: Fetch TSLA news via Exa → Latest articles about production, earnings
↓
Step 4: Gemini AI combines data → "Price drop correlates with production concerns"
↓
Step 5: Final recommendation → "HOLD - Monitor Q4 production numbers"
```

### Example 2: Apple Analysis
```
User Input: AAPL
↓
Tool Call 1: Get AAPL price and volume data
↓
Gemini Call 1: Analyze price action and trends
↓
Tool Call 2: Fetch recent Apple news via Exa Search
↓
Gemini Call 2: Correlate news with price movements
↓
Gemini Call 3: Generate comprehensive trading recommendation
```

## 🛠️ File Structure

```
agentic-stock-analyzer/
├── manifest.json          # Chrome extension configuration
├── popup.html             # User interface
├── popup.js               # Main agentic logic and tools
├── background.js          # Chrome extension background script
└── README.md              # This file
```

## 🔍 Troubleshooting

### Common Issues

**"API key not configured"**
- Make sure you've entered and saved your Gemini and Exa API keys in the extension popup

**"Failed to fetch stock price"**
- Check your internet connection
- Verify the stock symbol is valid (e.g., AAPL, not Apple)

**"Failed to fetch news"**
- Ensure your Exa Search API key is valid and active
- Check if you've exceeded your API quota (free tier has limits)

**Extension not loading**
- Make sure all files are in the same folder
- Check Chrome's developer console for error messages
- Ensure Developer Mode is enabled in Chrome extensions

### API Limits
- **Gemini**: Free tier available with generous quotas
- **Exa Search**: Free tier with 1000 searches per month
- **Yahoo Finance**: No official limits (free)

## 🚀 Advanced Usage

### Custom Analysis
The agentic nature means you can modify the prompts in `popup.js` to focus on:
- Technical analysis patterns
- Fundamental analysis metrics
- Sector-specific insights
- Risk assessment frameworks

### Adding More Tools
You can extend the extension by adding more tools:
- Social sentiment analysis
- Competitor comparison
- Financial ratios calculation
- Options data analysis

## 📝 License

This project is for educational purposes. Please respect API terms of service and rate limits.

## 🤝 Contributing

Feel free to fork and improve this agentic AI implementation. The architecture makes it easy to add new tools and analysis steps.

---

**Built with ❤️ for the Agentic AI future!**
