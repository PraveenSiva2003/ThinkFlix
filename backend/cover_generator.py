import openai

openai.api_key = "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"

def generate_cover(prompt, style=""):
    try:
        # 🎨 Style-specific theme descriptions
        theme_description = {
            "Spongebob": "in a colorful, underwater cartoon style like Bikini Bottom, with sea creatures, bubbles, and coral.",
            "Anime": "in a dramatic anime style, glowing sakura petals, sharpnp lines, and dynamic action poses.",
            "Simpsons": "in a bright, flat cartoon style like Springfield with yellow-toned characters and minimal shading.",
        }.get(style, "in a cinematic dark mode neon style, with glowing accents and bold shapes")

        # 📸 DALL·E Prompt
        dalle_prompt = (
            f"{prompt}. Design the cover {theme_description} "
            "Use a dark, atmospheric background to create contrast. "
            "At the top of the image, add the word 'THINKFLIX' in large, bold, all-caps, cinematic sans-serif font. "
            "Make 'THINKFLIX' bright red, centered, and styled like Netflix branding. "
            "Below the logo, include the episode title in a bold, cream or yellow font. "
            "Include playful or thematic characters relevant to the topic, standing or interacting near a chalkboard or classroom element if applicable. "
            "Ensure it's visually exciting, educational, and fits the style of a Netflix original educational show cover. "
        )

        # 📦 Generate image from OpenAI DALL·E
        response = openai.images.generate(
            model="dall-e-3",
            prompt=dalle_prompt,
            n=1,
            size="1024x1792",  # portrait Netflix-style
            style="vivid",
            response_format="url"
        )

        image_url = response.data[0].url
        print("✅ Generated theme-based cover:", image_url)
        return image_url

    except Exception as e:
        print("❌ Cover Generation Error:", str(e))
        return None
