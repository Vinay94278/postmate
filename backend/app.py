# Update the Flask CORS configuration and add error handling
import re  # Add at the top
from typing import Optional  # Add if needed
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS  # Add CORS support for cross-origin requests
from phi.agent import Agent, RunResponse
from phi.model.groq import Groq
from phi.tools.duckduckgo import DuckDuckGo
from phi.tools.newspaper4k import Newspaper4k
from phi.tools.wikipedia import WikipediaTools
from phi.tools.googlesearch import GoogleSearch
from phi.tools.arxiv_toolkit import ArxivToolkit
from phi.utils.pprint import pprint_run_response
from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env


# Add more robust parsing
def parse_posts(content):
    linkedin_post = ""
    x_post = ""
    
    # Try both uppercase and lowercase versions
    lower_content = content.lower()
    if "linkedin post:" in lower_content and "x post:" in lower_content:
        linkedin_start = content.lower().index("linkedin post:") + len("linkedin post:")
        x_start = content.lower().index("x post:")
        linkedin_post = content[linkedin_start:x_start].strip()
        x_post = content[x_start + len("x post:"):].strip()
    else:
        # Fallback: Split by any obvious separators
        parts = re.split(r'\n-+\n|___+|##', content)
        if len(parts) >= 2:
            linkedin_post = parts[0].strip()
            x_post = parts[1].strip()[:280]
        else:
            linkedin_post = content.strip()
            x_post = content.strip()[:280]
    
    return linkedin_post, x_post

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.errorhandler(404)
def not_found(e):
    return jsonify(error=str(e)), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify(error="Internal server error"), 500

# Research Agent
research_agent = Agent(
    model=Groq(id="deepseek-r1-distill-llama-70b"),
    tools=[DuckDuckGo(), Newspaper4k(), WikipediaTools(), ArxivToolkit(), GoogleSearch()],
    description="AI research assistant specializing in AI and technology trends.",
    instructions=[
        "Search for the latest information on the given topic using available tools.",
        "Extract key insights from articles, research papers, and Wikipedia.",
        "Summarize the findings in a concise format for content creation.",
    ],
    markdown=True,
    show_tool_calls=True,
)

# Content Creation Agent
content_agent = Agent(
    model=Groq(id="deepseek-r1-distill-llama-70b"),
    description="Creative AI content writer specializing in LinkedIn and X posts.",
    instructions=[
        "First think through the post structure in <think> tags",
        "Create two separate posts wrapped in MARKDOWN formatting:",
        "For LinkedIn: Use ## LINKEDIN POST: as header",
        "For X: Use ## X POST: as header",
        "Include 3-5 relevant hashtags at the end of each post",
        "Ensure proper spacing between paragraphs",
        "Use emojis that match the content theme",
        "Maintain professional tone for LinkedIn, casual for X",
        "Use **bold** for emphasis and *italic* for subtle points",
        "Separate sections with ---",
        "Format hashtags like: #AI #Tech",
        # "Never include markdown code blocks"
    ],
    markdown=True,
    show_tool_calls=True,
)

@app.route('/')
def home():
    return "API is running. Use the Next.js frontend to interact with this service."

@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.json
        topic = data.get("topic", "latest trends in AI")
        
        if not topic:
            return jsonify({"error": "Topic is required"}), 400

        # Research - with error handling
        try:
            research_summary: RunResponse = research_agent.run(f"Find information about: {topic}")
        except Exception as research_error:
            app.logger.error(f"Research failed: {str(research_error)}")
            return jsonify({"error": "Research phase failed"}), 500
        
        try:
            # Generate posts
            posts_prompt = f"""
            Based on this research: {research_summary.content}
            
            Create two posts:
            1. A LinkedIn post (300-500 characters) that is professional yet engaging
            2. An X post (max 280 characters) that is concise and attention-grabbing
            
            Include relevant hashtags for both platforms.
            Format your response with clear 'LINKEDIN POST:' and 'X POST:' sections.
            """
            
            posts_response: RunResponse = content_agent.run(posts_prompt)
        except Exception as content_error:
            app.logger.error(f"Content generation failed: {str(content_error)}")
            return jsonify({"error": "Content creation failed"}), 500

        # Parse the response to separate LinkedIn and X posts
        content = posts_response.content
        linkedin_post = ""
        x_post = ""
        
        if "LINKEDIN POST:" in content and "X POST:" in content:
            parts = content.split("X POST:")
            linkedin_part = parts[0]
            x_part = parts[1]
            
            linkedin_post = linkedin_part.replace("LINKEDIN POST:", "").strip()
            x_post = x_part.strip()
        else:
            # Fallback if the expected format isn't found
            linkedin_post = content
            # Create a shortened version for X
            x_post = content[:280] if len(content) > 280 else content
        
        print(content)
        # Replace the existing parsing code with:
        linkedin_post, x_post = parse_posts(content)

        return jsonify({
                "research_summary": research_summary.content,
                "linkedin_post": linkedin_post,
                "x_post": x_post
            })
        
    except Exception as e:
        app.logger.error(f"Error in generate endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)