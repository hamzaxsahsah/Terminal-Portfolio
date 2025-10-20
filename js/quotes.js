async function fetchRandomQuote() {
    try {
        const response = await fetch('https://api.api-ninjas.com/v1/quotes', {
            headers: {
                'X-Api-Key': 'lVC62wTUFvqV//N5UArcAA==Z6rQB75XbpvHuOfA' // Replace with your actual API key
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch quote');
        }

        const data = await response.json();
        if (data && data.length > 0) {
            return `"${data[0].quote}" - ${data[0].author}`;
        } else {
            return 'Error: No quote received';
        }
    } catch (error) {
        console.error('Failed to fetch quote:', error);
        return 'Unable to fetch quote at the moment...';
    }
}

let quoteUpdateInterval;

async function updateQuote() {
    const quoteElement = document.getElementById('quote-text');
    if (quoteElement) {
        const quote = await fetchRandomQuote();
        quoteElement.textContent = quote;
    }
}

function startQuoteUpdates() {
    // Initial quote
    updateQuote();
    
    // Update quote every minute (60000 ms)
    quoteUpdateInterval = setInterval(updateQuote, 60000);
}

function stopQuoteUpdates() {
    if (quoteUpdateInterval) {
        clearInterval(quoteUpdateInterval);
    }
}

// Start quote updates when the document is loaded
document.addEventListener('DOMContentLoaded', startQuoteUpdates);

// Clean up when the page is unloaded
window.addEventListener('unload', stopQuoteUpdates);