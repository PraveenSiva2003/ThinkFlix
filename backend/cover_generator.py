import openai

openai.api_key = "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"

def generate_cover(title, style, script_lines):
    try:
        # ✂️ Trim summary of script for context
        summary = " ".join([f"{line['speaker']}: {line['dialogue']}" for line in script_lines])
        context = summary[:300] if summary else "An educational discussion between Narrator, Student, and Expert."

        # 🎨 Style-specific visual instructions
        theme_description = {
            "Spongebob": (
                "in a colorful, underwater cartoon style like Bikini Bottom, "
                "with jellyfish, sea creatures, bubbly backgrounds, and comic-style characters."
            ),
            "Naruto": (
                "in the artistic style of Naruto, with ninja scrolls, headbands, chakra symbols, "
                "and characters performing jutsu in an educational setting."
            ),
            "Simpsons": (
                "in a flat yellow cartoon style like The Simpsons, with exaggerated expressions, "
                "Springfield-style classroom props, and bold black outlines."
            ),
        }.get(style, "in a cinematic dark mode neon style, with glowing accents and bold shapes")

        # 🧠 Full prompt
        dalle_prompt = (
            f"Create a vertical 1024x1792 AI-generated show poster for THINKFLIX.\n"
            f"Title: '{title}'.\n"
            f"Style: {style} — {theme_description}\n"
            f"Include the word THINKFLIX in bold red Netflix-style at the top.\n"
            f"Show the title beneath in a bold cream or yellow font.\n"
            f"Include glowing animated characters for Narrator, Student, and Expert.\n"
            f"Add neon educational icons (books, graphs, circuits).\n"
            f"Dark background, cinematic lighting.\n"
            f"Do NOT reference other brands directly.\n"
            f"Context:\n{context}"
        )

        # 🖼️ Generate the image
        response = openai.images.generate(
            model="dall-e-3",
            prompt=dalle_prompt,
            n=1,
            size="1024x1792",
            style="vivid",
            response_format="url"
        )

        image_url = response.data[0].url
        print("✅ Generated cover URL:", image_url)
        return image_url

    except Exception as e:
        print("❌ Cover Generation Error:", str(e))
        return None
