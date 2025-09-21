// Background script for Agentic AI Stock Analyzer Chrome Extension

// Initialize when extension is installed
chrome.runtime.onInstalled.addListener(() => {
    console.log('Agentic AI Stock Analyzer installed');
    
    // Set default storage values if not present
    chrome.storage.local.get(['geminiApiKey', 'exaApiKey'], (result) => {
        if (!result.geminiApiKey) {
            chrome.storage.local.set({ geminiApiKey: 'your-api-key' });
        }
        if (!result.exaApiKey) {
            chrome.storage.local.set({ exaApiKey: 'your-api-key' });
        }
    });
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    // This will open the popup automatically due to manifest configuration
    console.log('Extension clicked');
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background received message:', request);
    
    if (request.action === 'log') {
        console.log('Popup log:', request.message);
    }
    
    sendResponse({ status: 'received' });
});

// Note: CORS is handled by the browser for extension requests
// No need to modify headers as Chrome extensions have different CORS rules

// Keep service worker alive
const keepAlive = () => {
    setInterval(() => {
        chrome.storage.local.get('keepAlive', () => {
            // This keeps the service worker alive
        });
    }, 20000);
};

keepAlive();
