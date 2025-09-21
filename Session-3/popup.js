// Agentic AI Stock Analyzer - Main Logic with Gemini and Exa Search
class AgenticStockAnalyzer {
    constructor() {
        this.geminiApiKey = 'your-api-key';
        this.exaApiKey = 'your-api-key';
        this.conversationHistory = [];
        this.currentStep = 0;
        this.modelName = 'gemini-2.0-flash'; // ✅ choose valid model name
        this.loadApiKeys();
    }
    
        // Load API keys from extension storage
    async loadApiKeys() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['geminiApiKey', 'exaApiKey'], (result) => {
                this.geminiApiKey = result.geminiApiKey || '';
                this.exaApiKey = result.exaApiKey || '';

                console.log('Loaded API keys:', {
                    gemini: this.geminiApiKey ? '✅ Present' : '❌ Missing',
                    exa: this.exaApiKey ? '✅ Present' : '❌ Missing'
                });

                resolve();
            });
        });
    }

    // Fetch stock data (Yahoo Finance)
    async fetchStockPrice(symbol) {
        try {
            console.log('Fetching stock price for:', symbol);
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
            const response = await fetch(url, { method: 'GET' });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            const result = data?.chart?.result?.[0]?.meta;

            if (!result) throw new Error('No stock data found');

            return {
                symbol: result.symbol,
                price: result.regularMarketPrice,
                change: result.regularMarketPrice - result.previousClose,
                changePercent: ((result.regularMarketPrice - result.previousClose) / result.previousClose) * 100,
                volume: result.regularMarketVolume,
                marketCap: result.marketCap,
                timestamp: new Date(result.regularMarketTime * 1000).toLocaleString()
            };
        } catch (err) {
            console.error('Stock fetch error:', err);
            return { error: `Failed to fetch stock price: ${err.message}` };
        }
    }

    // Fetch stock news (Exa API)
    async fetchStockNews(symbol) {
        try {
            if (!this.exaApiKey) {
                return { error: 'Missing Exa API key. Please add it in extension settings.' };
            }

            const response = await fetch('https://api.exa.ai/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.exaApiKey
                },
                body: JSON.stringify({
                    query: `${symbol} stock news`,
                    type: 'neural',
                    numResults: 5,
                    useAutoprompt: true,
                    contents: { text: true },
                    category: 'news'
                })
            });

            if (!response.ok) throw new Error(`Exa API error: ${response.status}`);

            const data = await response.json();
            if (!data.results?.length) throw new Error('No news articles found');

            return {
                articles: data.results.map(r => ({
                    title: r.title,
                    url: r.url,
                    source: new URL(r.url).hostname,
                    publishedAt: r.publishedDate || new Date().toISOString(),
                    description: r.text ? r.text.slice(0, 200) + '...' : 'No summary available'
                }))
            };
        } catch (err) {
            console.error('News fetch error:', err);
            return { error: `Failed to fetch news: ${err.message}` };
        }
    }

    // Call Gemini API
    async callGemini(messages) {
        try {
            if (!this.geminiApiKey) throw new Error('Gemini API key not set');

            const prompt = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': this.geminiApiKey
                    },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
                    })
                }
            );

            if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

            const data = await response.json();
            return data?.candidates?.[0]?.content?.parts?.[0]?.text || '⚠️ No response from Gemini';
        } catch (err) {
            console.error('Gemini error:', err);
            throw err;
        }
    }

    // Main multi-step analysis flow
    async analyzeStock(symbol) {
        console.log('=== ANALYSIS START ===', symbol);
        try {
            this.showLoading(true);
            this.clearResults();
            this.conversationHistory = [];
            this.currentStep = 0;

            // Step 1: Price
            this.showStep('Step 1: Price Data', 'Fetching stock price...');
            const stock = await this.fetchStockPrice(symbol);
            if (stock.error) return this.showStep('Error', stock.error);

            this.showStep('Stock Data', `${stock.symbol}: $${stock.price.toFixed(2)} (${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}, ${stock.changePercent.toFixed(2)}%)`);

            // Step 2: AI on Price
            this.showStep('Step 2: AI Analysis', 'Analyzing price trends...');
            const priceAnalysis = await this.callGemini([
                { role: 'system', content: 'You are a financial analyst AI powered by Gemini.' },
                { role: 'user', content: `Analyze this stock data: ${JSON.stringify(stock, null, 2)}` }
            ]);
            this.showStep('Gemini Price Analysis', priceAnalysis);
            this.conversationHistory.push({ role: 'assistant', content: priceAnalysis });

            // Step 3: News
            this.showStep('Step 3: News', 'Fetching recent stock news...');
            const news = await this.fetchStockNews(symbol);
            if (news.error) {
                this.showStep('News Error', news.error);
            } else {
                this.showStep('Recent News', news.articles.map(a => `<div><b>${a.title}</b> - <a href="${a.url}" target="_blank">${a.source}</a></div>`).join(''));
                this.conversationHistory.push({ role: 'user', content: `News data:\n${news.articles.map(a => `- ${a.title} (${a.source})`).join('\n')}` });
            }

            // Step 4: Comprehensive AI Analysis
            this.showStep('Step 4: Final AI Analysis', 'Running deep analysis...');
            const finalAnalysis = await this.callGemini(this.conversationHistory);
            this.showStep('🎯 Final Analysis', finalAnalysis);

            // Step 5: Recommendation
            this.showStep('Step 5: Trading Recommendation', 'Generating actionable advice...');
            this.conversationHistory.push({ role: 'user', content: `Provide a trading recommendation for ${stock.symbol}.` });
            const recommendation = await this.callGemini(this.conversationHistory);
            this.showStep('💡 Recommendation', recommendation);

        } catch (err) {
            this.showStep('Error', `Analysis failed: ${err.message}`);
        } finally {
            this.showLoading(false);
        }
    }

    // UI Helpers
    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'block' : 'none';
        document.getElementById('analyzeBtn').disabled = show;
    }

    clearResults() {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';
        resultsDiv.style.display = 'none';
    }

    showStep(title, content) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.style.display = 'block';

        const stepDiv = document.createElement('div');
        stepDiv.className = 'step';
        stepDiv.innerHTML = `
            <div class="step-title">${title}</div>
            <div class="step-content">${content}</div>
        `;
        resultsDiv.appendChild(stepDiv);
        resultsDiv.scrollTop = resultsDiv.scrollHeight;
    }
}
    
// === Initialize ===
const analyzer = new AgenticStockAnalyzer();

document.addEventListener('DOMContentLoaded', async () => {
    await analyzer.loadApiKeys();

    const statusEl = document.getElementById('status');
    const analyzeBtn = document.getElementById('analyzeBtn');

    // API Key status
    if (analyzer.geminiApiKey && analyzer.exaApiKey) {
        statusEl.textContent = '✅ Ready to analyze stocks!';
        statusEl.style.color = '#4ecdc4';
        analyzeBtn.disabled = false;
    } else {
        statusEl.textContent = '❌ API keys not configured';
        statusEl.style.color = '#ff6b6b';
        analyzeBtn.disabled = true;
    }

    // Event bindings
    analyzeBtn.addEventListener('click', async () => {
        const symbol = document.getElementById('stockSymbol').value.trim().toUpperCase();
        if (!symbol) return alert('Please enter a stock symbol');
        await analyzer.analyzeStock(symbol);
    });

    document.getElementById('testBtn').addEventListener('click', () => {
        analyzer.showStep('Test', '✅ Buttons and DOM working fine');
    });

    document.getElementById('mockBtn').addEventListener('click', async () => {
        analyzer.showLoading(true);
        analyzer.clearResults();
        analyzer.showStep('Mock 1', 'Running a mock analysis...');
        await new Promise(r => setTimeout(r, 1000));
        analyzer.showStep('Mock 2', 'Simulating...');
        await new Promise(r => setTimeout(r, 1000));
        analyzer.showStep('Mock ✅', 'Complete!');
        analyzer.showLoading(false);
    });

    // Enter key shortcut
    document.getElementById('stockSymbol').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') analyzeBtn.click();
    });
});
