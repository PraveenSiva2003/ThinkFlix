import openai

openai.api_key = "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"

def generate_cover(prompt, style=""):
    try:
        # 🎨 Style-specific prompt expansions
        theme_description = {
            "Spongebob": (
                "in a colorful, underwater cartoon style like Bikini Bottom, "
                "with jellyfish, sea creatures, bubbly backgrounds, and comic-style characters."
            ),
            "Naruto": (
                "in the artistic style of Naruto, with ninja scrolls, dojo wood textures, headbands, "
                "chakra symbols, orange hues, and characters performing jutsu in an educational setting."
            ),
            "Simpsons": (
                "in a flat yellow cartoon style like The Simpsons, with exaggerated expressions, "
                "Springfield-style classroom props, and bold black outlines."
            ),
        }.get(style, "in a cinematic dark mode neon style, with glowing accents and bold shapes")

        # 🧠 DALL·E Prompt Assembly
        dalle_prompt = (
            f"{prompt}. Design the cover {theme_description} "
            "Use a dark, atmospheric background to create contrast. "
            "At the top of the image, add the word 'THINKFLIX' in large, bold, all-caps, cinematic sans-serif font. "
            "Make 'THINKFLIX' bright red, centered, and styled like Netflix branding. "
            "Below the logo, include the episode title in a bold, cream or yellow font. "
            "Include playful or thematic characters relevant to the topic, standing or interacting near a chalkboard or classroom if it fits. "
            "Ensure it's visually exciting, educational, and fits the style of a Netflix original educational show cover."
        )

        # 📦 OpenAI image generation
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
