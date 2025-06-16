from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import json
import openai
import requests
import os
import PyPDF2
from cover_generator import generate_cover  # Make sure this is implemented properly

# 🔑 API Keys
OPENAI_API_KEY = "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"
OPENAI_PROJECT_ID = "proj_LNsqrumJUAVEUToqyDAargtl"
ELEVENLABS_API_KEY = "sk_a9d5729de46b51e6d67a02965d18d73765f9aa6c54f2a4f6"

app = Flask(__name__)
CORS(app)

client = openai.OpenAI(api_key=OPENAI_API_KEY, project=OPENAI_PROJECT_ID)

VOICE_MAPPING = {
    "Narrator": "qNkzaJoHLLdpvgh5tISm",
    "Spongebob": "518N6sBEhyHnZncVEWyJ",
    "Patrick": "Q6zmZ181L6iFOZA3Pacj",
    "Squidward": "iGA4nKE0e0hImRC1ONeE",
    "Mr. Krabs": "n3bxrlTkuhAxAQCCGlOI",
    "Sandy": "ieN3XvLpoftisNgjAnsq",
    "Student": "21m00Tcm4TlvDq8ikWAM",
    "Expert": "pNInz6obpgDQGcFmaJgB"
}

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "🚀 Flask Backend is Running!"})

@app.route("/generate_script", methods=["POST"])
def generate_script():
    if "file" not in request.files:
        return jsonify({"error": "❌ No file uploaded"}), 400

    file = request.files["file"]
    selected_style = request.form.get("style", "").strip()

    if not selected_style:
        return jsonify({"error": "❌ No style provided"}), 400

    course_text = ""
    if file.filename.endswith(".pdf"):
        try:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                course_text += page.extract_text() or ""
        except Exception as e:
            return jsonify({"error": "❌ Failed to read PDF", "details": str(e)}), 400
    else:
        return jsonify({"error": "❌ Unsupported file type"}), 400

    if not course_text.strip():
        return jsonify({"error": "❌ No readable text in the uploaded file"}), 400

    prompt = f"""
    Convert this educational material into a fun, structured animated show script.
    The script should match the selected style: {selected_style}.
    If the style is "Spongebob", include characters like Spongebob, Patrick, Squidward, Mr. Krabs, Sandy, and a Narrator.
    Format it strictly as JSON:
    {{
        "title": "Exciting, Show-Style Title Based on Topic",
        "script": [
            {{"speaker": "Narrator", "dialogue": "Welcome to today's lesson!"}},
            {{"speaker": "Student", "dialogue": "Wait, what is this about?"}},
            {{"speaker": "Expert", "dialogue": "Great question! It's about..."}}
        ]
    }}

    Course Material:
    {course_text}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}]
        )

        ai_response = response.choices[0].message.content.strip()
        if ai_response.startswith("```json"):
            ai_response = ai_response[7:-3].strip()

        formatted_response = json.loads(ai_response)

        # ✅ Fixed: call generate_cover() with all required args
        cover_url = generate_cover(
            title=formatted_response.get("title", "Untitled"),
            style=selected_style,
            script_lines=formatted_response.get("script", [])
        )

        return jsonify({
            "title": formatted_response.get("title", "Untitled"),
            "script": formatted_response.get("script", []),
            "coverUrl": cover_url
        })

    except Exception as e:
        print("❌ OpenAI API Error:", str(e))
        return jsonify({"error": "An error occurred while generating the script", "details": str(e)}), 500

@app.route("/generate_audio", methods=["POST"])
def generate_audio():
    data = request.json
    script = data.get("script", [])

    if not script:
        return jsonify({"error": "❌ No script provided"}), 400

    def stream_audio():
        for line in script:
            speaker = line["speaker"].strip().title()
            voice_id = VOICE_MAPPING.get(speaker, VOICE_MAPPING["Narrator"])

            response = requests.post(
                f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
                headers={
                    "xi-api-key": ELEVENLABS_API_KEY,
                    "Content-Type": "application/json"
                },
                json={
                    "text": line["dialogue"],
                    "model_id": "eleven_multilingual_v2",
                    "voice_settings": {
                        "stability": 0.5,
                        "similarity_boost": 0.8
                    }
                },
                stream=True
            )

            if response.status_code == 200:
                for chunk in response.iter_content(chunk_size=1024):
                    yield chunk
            else:
                print(f"❌ ElevenLabs Error ({speaker}):", response.json())

    return Response(stream_audio(), content_type="audio/mpeg")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8080)
