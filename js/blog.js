let currentBlogPost = null;

const blogPosts = {
    'blockchain-systems': {
        title: 'Understanding Blockchain: Centralized vs Decentralized vs Hybrid Systems',
        date: '2025-10-20',
        file: 'blog/blockchain-systems.md'
    },
    'trash-to-cash': {
        title: 'From Trash to Cash: Revolutionizing Plastic Waste Management with AI and Blockchain',
        date: '2025-10-21',
        file: 'blog/trash-to-cash.md'
    },'Havok Physics Engine': {
        title: 'Havok Physics Engine: Revolutionizing Game Development with Realistic Simulations',
        date: '2025-11-07',
        file: 'blog/havoc.md'
    }

};

let scrollStep = 50;
let currentScrollPosition = 0;
let maxScroll = 0;

// Add Mermaid rendering helper
async function renderMermaidDiagrams() {
    const mermaidElements = document.querySelectorAll('.mermaid:not([data-processed])');
    
    for (const element of mermaidElements) {
        try {
            const graphDefinition = element.textContent.trim();
            const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const { svg } = await mermaid.render(id, graphDefinition);
            element.innerHTML = svg;
            element.setAttribute('data-processed', 'true');
        } catch (error) {
            console.error('Mermaid rendering error:', error);
            element.innerHTML = `<pre style="color: #ff6b6b;">Error rendering diagram: ${error.message}</pre>`;
        }
    }
}

function recalcMaxScroll() {
    const wrapper = document.querySelector('.blog-content-wrapper');
    const container = document.querySelector('.blog-scroll-container');
    if (!wrapper || !container) return 0;
    const full = wrapper.scrollHeight;
    const visible = container.clientHeight;
    maxScroll = Math.max(0, full - visible);
    return maxScroll;
}

function updateScrollIndicators(wrapper) {
    const upIndicator = document.querySelector('.scroll-up');
    const downIndicator = document.querySelector('.scroll-down');
    if (upIndicator) {
        if (currentScrollPosition > 0) upIndicator.style.display = 'block';
        else upIndicator.style.display = 'none';
    }
    if (downIndicator) {
        if (currentScrollPosition < maxScroll) downIndicator.style.display = 'block';
        else downIndicator.style.display = 'none';
    }
}

function handleBlogKeyPress(e) {
    const wrapper = document.querySelector('.blog-content-wrapper');
    const container = document.querySelector('.blog-scroll-container');
    if (!wrapper || !container) return;

    const page = container.clientHeight - 60;

    if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        container.scrollTop = Math.min(container.scrollTop + scrollStep, maxScroll);
    } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        container.scrollTop = Math.max(container.scrollTop - scrollStep, 0);
    } else if (e.key === 'PageDown') {
        e.preventDefault();
        container.scrollTop = Math.min(container.scrollTop + page, maxScroll);
    } else if (e.key === 'PageUp') {
        e.preventDefault();
        container.scrollTop = Math.max(container.scrollTop - page, 0);
    } else if (e.key === 'Escape') {
        closeBlog();
    } else if (e.key === 'End') {
        e.preventDefault();
        container.scrollTop = maxScroll;
    } else if (e.key === 'Home') {
        e.preventDefault();
        container.scrollTop = 0;
    }

    currentScrollPosition = container.scrollTop;
    updateScrollIndicators(wrapper);
}

async function loadBlogPost(postId) {
    try {
        const post = blogPosts[postId];
        if (!post) {
            return 'Blog post not found.';
        }

        const response = await fetch(post.file);
        const markdown = await response.text();
        
        // Parse markdown to HTML
        let html = marked.parse(markdown);
        
        // Convert Mermaid code blocks to proper div elements
        // This handles the format: <pre><code class="language-mermaid">...</code></pre>
        html = html.replace(
            /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
            '<div class="mermaid">$1</div>'
        );
        
        const generateLink = (id) => {
            const url = `${location.origin}${location.pathname}?open=${encodeURIComponent(id)}`;
            return `<span class="blog-direct-link-wrap"><a href="${url}" class="blog-direct-link">Open this article directly</a> <button class="copy-link-btn" data-link="${url}" aria-label="Copy link">Copy</button></span>`;
        };

        return `
            <div class="scroll-indicator scroll-up">▲</div>
            <div class="scroll-indicator scroll-down">▼</div>
            <div class="key-guide">Use ↑↓ or (j/k) keys to scroll | Home/End/PageUp/PageDown</div>
            <div class="blog-scroll-container">
                <div class="blog-content-wrapper">
                    <div class="blog-post">
                        <h1>${post.title}</h1>
                        <div class="blog-date">${post.date}</div>
                        <div class="blog-content">${html}</div>
                        <div style="margin-top: 20px; padding-bottom: 20px;">
                            <button onclick="window.closeBlog()" class="blog-close-btn">Back to Terminal (ESC)</button>
                            &nbsp; ${generateLink(postId)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading blog post:', error);
        return 'Error loading blog post.';
    }
}

function showBlog(postId) {
    const terminal = document.getElementById('terminal');
    const blogContainer = document.getElementById('blog-container');
    
    loadBlogPost(postId).then(content => {
        blogContainer.innerHTML = content;
        terminal.style.display = 'none';
        blogContainer.style.display = 'block';
        currentBlogPost = postId;

        currentScrollPosition = 0;
        
        requestAnimationFrame(async () => {
            // Render Mermaid diagrams FIRST
            await renderMermaidDiagrams();
            
            // Then calculate scroll and set up UI
            recalcMaxScroll();
            const wrapper = document.querySelector('.blog-content-wrapper');
            updateScrollIndicators(wrapper);

            const upIndicator = document.querySelector('.scroll-up');
            const downIndicator = document.querySelector('.scroll-down');
            const container = document.querySelector('.blog-scroll-container');
            
            if (upIndicator) {
                upIndicator.style.pointerEvents = 'auto';
                upIndicator.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    const page = container.clientHeight - 60;
                    container.scrollTop = Math.max(container.scrollTop - page, 0);
                    currentScrollPosition = container.scrollTop;
                    updateScrollIndicators(wrapper);
                });
            }
            
            if (downIndicator) {
                downIndicator.style.pointerEvents = 'auto';
                downIndicator.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    const page = container.clientHeight - 60;
                    container.scrollTop = Math.min(container.scrollTop + page, maxScroll);
                    currentScrollPosition = container.scrollTop;
                    updateScrollIndicators(wrapper);
                });
            }

            const copyButtons = document.querySelectorAll('.copy-link-btn');
            copyButtons.forEach((btn) => {
                if (btn.dataset.bound === '1') return;
                btn.dataset.bound = '1';
                btn.addEventListener('click', async (ev) => {
                    ev.preventDefault();
                    const url = btn.getAttribute('data-link');
                    try {
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                            await navigator.clipboard.writeText(url);
                        } else {
                            const tmp = document.createElement('textarea');
                            tmp.value = url;
                            document.body.appendChild(tmp);
                            tmp.select();
                            document.execCommand('copy');
                            tmp.remove();
                        }
                        const original = btn.textContent;
                        btn.textContent = 'Copied!';
                        setTimeout(() => (btn.textContent = original), 1500);
                    } catch (e) {
                        console.error('Copy failed', e);
                        btn.textContent = 'Error';
                        setTimeout(() => (btn.textContent = 'Copy'), 1500);
                    }
                });
            });

            document.addEventListener('keydown', handleBlogKeyPress);
        });
    });
}

function closeBlog() {
    const terminal = document.getElementById('terminal');
    const blogContainer = document.getElementById('blog-container');
    
    if (terminal && blogContainer) {
        terminal.style.display = 'block';
        blogContainer.style.display = 'none';
        currentBlogPost = null;
        
        document.removeEventListener('keydown', handleBlogKeyPress);
        
        currentScrollPosition = 0;
        const container = document.querySelector('.blog-scroll-container');
        if (container) container.scrollTop = 0;
    }
}

window.closeBlog = closeBlog;

// Initialize Mermaid when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            securityLevel: 'loose',
            flowchart: {
                htmlLabels: true,
                curve: 'basis'
            },
            themeVariables: {
                primaryColor: '#4d8ce7',
                primaryTextColor: '#4d8ce7',
                primaryBorderColor: '#4d8ce7',
                lineColor: '#4d8ce7',
                secondaryColor: '#2a4d80',
                tertiaryColor: '#000000',
                noteTextColor: '#00ff00',
                noteBkgColor: '#000000',
                notesBorderColor: '#00ff00',
                edgeLabelBackground: '#000000'
            }
        });
    }
});