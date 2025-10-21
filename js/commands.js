var linkedin = "https://www.linkedin.com/in/hamza-sahsah/";
var github = "https://github.com/hamzaxsahsah";
var email = "mailto:sahsah.hamza.dev@gmail.com";

let banner = [
  `<div id="banner-section" class="banner">
 Welcome to my portfolio! — Type <span class="command">help</span> for a list of supported commands.
  </div>`,
];

let aboutme = [
  "<br>",
  `<div id="aboutme-section">`,
  `<span class='underline'>Hey, I'm Hamza SAHSAH! 👋</span>`,
  "<br>",
  `<li>🎓 Software Engineering from AIAC and PHD candidate in blockchain and AI</li>`,
  `<li>💻 Full Stack Developer with expertise in odoo, python, and Angular</li>`,
  `<li>� Experienced in DevOps practices and container orchestration with Docker</li>`,
  `<li>🛠️ Skills include Python , Javascript and various web technologies</li>`,
  `<li>📂 Use the <span class="command">projects</span> command to check out my work!</li>`,
  `<li>📫 Contact: <a href="mailto:sahsah.hamza.dev@gmail.com">sahsah.hamza.dev@gmail.com</a></li>`,
  "</div>",
  "<br>",
];

let social = [
  "<br>",
  'linkedin       <a href="' +
    linkedin +
    '" target="_blank">linkedin/hamza-sahsah</a>',
  'github         <a href="' +
    github +
    '" target="_blank">github/hamzaxsahsah</a>',
  "<br>",
];

let help = [
  `<br><div id="help-section"><pre class="whitespace-pre-wrap">
<span class="command">aboutme</span>
↳ Displays who I am?
<span class="command">social</span>
↳ Lists social networks.
<span class="command">projects</span>
↳ View coding projects.
<span class="command">blog</span>
↳ View blog posts.
<span class="command">email</span>
↳ To send me an email.
<span class="command">history</span>
↳ View command history.
<span class="command">help</span>
↳ Displays this help message.
<span class="command">sudo</span>
↳ Try it out for yourself.
<span class="command">snake</span>
↳ Run Snake Game.
<span class="command">clear</span>
↳ Clear the terminal.
</pre></div><br>`,
];

function generateBlogList() {
  const blogList = [
    "<br>",
    "<div class='blog-list'>",
    "<span class='underline'>Available Blog Posts:</span>",
    "<br><br>"
  ];

  let index = 1;
  for (const [id, post] of Object.entries(blogPosts)) {
    blogList.push(`${index}. <a href='#' onclick='showBlog("${id}"); return false;'>${post.title}</a>`);
    blogList.push("<br>");
    index++;
  }

  blogList.push("</div>");
  blogList.push("<br>");
  return blogList;
}

let blog = generateBlogList();
let projects = [
  
];
function processMarkdownWithMermaid(markdown) {
    // Parse markdown
    let html = marked.parse(markdown);
    
    // Find mermaid code blocks and wrap them properly
    html = html.replace(/<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g, 
        '<div class="mermaid">$1</div>');
    
    // Insert into DOM
    const outputDiv = document.createElement('div');
    outputDiv.innerHTML = html;
    document.getElementById('typer').appendChild(outputDiv);
    
    // Render all mermaid diagrams
    renderMermaidDiagrams();
}