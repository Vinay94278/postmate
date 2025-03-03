# Update the Flask CORS configuration and add error handling
import re  # Add at the top
from typing import Optional  # Add if needed
from flask import Flask, request, jsonify
from flask_cors import CORS  # Add CORS support for cross-origin requests
from phi.agent import Agent, RunResponse
from phi.model.groq import Groq
from phi.tools.duckduckgo import DuckDuckGo
from phi.tools.newspaper4k import Newspaper4k
from phi.tools.wikipedia import WikipediaTools
from phi.tools.googlesearch import GoogleSearch
from phi.tools.arxiv_toolkit import ArxivToolkit

# from dotenv import load_dotenv
import firebase_admin
from firebase_admin import auth, credentials
import requests
from flask_sqlalchemy import SQLAlchemy

# Initialize Flask App
app = Flask(__name__)
CORS(app, supports_credentials=True)  # Allow all origins for simplicity


# Load Firebase Credentials
cred = credentials.Certificate(
    "backend/firebase_admin.json"
)  # Place this file in backend/
firebase_admin.initialize_app(cred)

# Configure SQLite for storing user API keys (optional)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"
db = SQLAlchemy(app)


class UserAPIKeys(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(255), unique=True, nullable=False)
    groq_api_key = db.Column(db.String(255), nullable=True)
    phi_agno_api_key = db.Column(db.String(255), nullable=True)


with app.app_context():
    db.create_all()


# ------------------------------------------
# 🔹 SIGNUP (Firebase Authentication)
# ------------------------------------------
@app.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.json
        email = data["email"]
        password = data["password"]

        user = auth.create_user(email=email, password=password)
        return jsonify({"message": "User created", "uid": user.uid}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ------------------------------------------
# 🔹 LOGIN (Firebase Authentication)
# ------------------------------------------
@app.route("/login", methods=["POST"])
def login():
    return jsonify({"message": "Use Firebase frontend SDK for login"}), 200


# ------------------------------------------
# 🔹 STORE USER API KEYS (User Enters API Keys)
# ------------------------------------------
@app.route("/save-api-keys", methods=["POST", "OPTIONS"])  # ✅ Allow OPTIONS requests
def save_api_keys():
    if request.method == "OPTIONS":
        response = jsonify({"message": "Preflight request successful"})  
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")  
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")  
        return response, 200  # ✅ Ensure the OPTIONS request gets a valid response

    try:
        data = request.json
        user_id = data.get("user_id")
        groq_api_key = data.get("groq_api_key")
        phi_agno_api_key = data.get("phi_agno_api_key")

        if not user_id or not groq_api_key or not phi_agno_api_key:
            return jsonify({"error": "Missing required fields"}), 400

        user = UserAPIKeys.query.filter_by(user_id=user_id).first()

        if user:
            user.groq_api_key = groq_api_key
            user.phi_agno_api_key = phi_agno_api_key
        else:
            user = UserAPIKeys(
                user_id=user_id,
                groq_api_key=groq_api_key,
                phi_agno_api_key=phi_agno_api_key,
            )
            db.session.add(user)

        db.session.commit()
        return jsonify({"message": "API Keys saved successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------------------------------
# 🔹 GET USER PROFILE (Using User's API Keys)
# ------------------------------------------
@app.route("/profile", methods=["GET"])
def get_profile():
    try:
        user_id = request.args.get("user_id")

        if not user_id:
            return jsonify({"error": "Missing user_id parameter"}), 400  # 🚨 Ensure user_id is provided

        user = UserAPIKeys.query.filter_by(user_id=user_id).first()

        if not user:
            return jsonify({"groq_api_key": "", "phi_agno_api_key": ""}), 200  # ✅ Return empty keys instead of 400

        return jsonify({
            "groq_api_key": user.groq_api_key,
            "phi_agno_api_key": user.phi_agno_api_key
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
        x_post = content[x_start + len("x post:") :].strip()
    else:
        # Fallback: Split by any obvious separators
        parts = re.split(r"\n-+\n|___+|##", content)
        if len(parts) >= 2:
            linkedin_post = parts[0].strip()
            x_post = parts[1].strip()[:280]
        else:
            linkedin_post = content.strip()
            x_post = content.strip()[:280]

    return linkedin_post, x_post

@app.errorhandler(404)
def not_found(e):
    return jsonify(error=str(e)), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify(error="Internal server error"), 500


# Research Agent
research_agent = Agent(
    model=Groq(id="deepseek-r1-distill-llama-70b"),
    tools=[
        DuckDuckGo(),
        Newspaper4k(),
        WikipediaTools(),
        ArxivToolkit(),
        GoogleSearch(),
    ],
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


@app.route("/")
def home():
    return "API is running. Use the Next.js frontend to interact with this service."


@app.route("/generate", methods=["POST"])
def generate():
    try:
        data = request.json
        topic = data.get("topic", "latest trends in AI")

        if not topic:
            return jsonify({"error": "Topic is required"}), 400

        # Research - with error handling
        try:
            research_summary: RunResponse = research_agent.run(
                f"Find information about: {topic}"
            )
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

        return jsonify(
            {
                "research_summary": research_summary.content,
                "linkedin_post": linkedin_post,
                "x_post": x_post,
            }
        )

    except Exception as e:
        app.logger.error(f"Error in generate endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)