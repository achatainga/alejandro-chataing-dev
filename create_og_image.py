import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

def create_og_image():
    W, H = 1200, 630
    
    # Base background #0b0f17
    img = Image.new("RGBA", (W, H), (11, 15, 23, 255))
    draw = ImageDraw.Draw(img)

    # 1. Subtle Cyber Gradient Glows
    # Top-Left Cyan Glow
    glow_tl = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_tl = ImageDraw.Draw(glow_tl)
    draw_tl.ellipse((-100, -100, 500, 400), fill=(0, 229, 255, 30))
    glow_tl = glow_tl.filter(ImageFilter.GaussianBlur(100))
    img = Image.alpha_composite(img, glow_tl)

    # Bottom-Right Emerald Glow
    glow_br = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_br = ImageDraw.Draw(glow_br)
    draw_br.ellipse((700, 200, 1300, 700), fill=(16, 185, 129, 25))
    glow_br = glow_br.filter(ImageFilter.GaussianBlur(120))
    img = Image.alpha_composite(img, glow_br)

    draw = ImageDraw.Draw(img)

    # 2. Modern Subtle Grid Accents
    for x in range(60, W - 60, 80):
        for y in range(60, H - 60, 80):
            draw.rectangle((x, y, x + 1, y + 1), fill=(30, 41, 59, 120))

    # Outer border & subtle corner glow
    draw.rounded_rectangle((24, 24, W - 24, H - 24), radius=20, outline=(30, 41, 59, 255), width=2)
    # Cyan highlight on top border
    draw.line((60, 24, 240, 24), fill=(0, 229, 255, 255), width=3)
    draw.line((24, 60, 24, 180), fill=(0, 229, 255, 255), width=3)

    # Fonts
    font_badge = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 16)
    font_badge_bold = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 16)
    font_name = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 64)
    font_sub = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 24)
    font_tag = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 17)
    font_footer = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 18)

    # 3. Left Content
    # Top Category Pill
    pill_x, pill_y = 65, 75
    draw.rounded_rectangle((pill_x, pill_y, pill_x + 395, pill_y + 36), radius=18, fill=(15, 23, 42, 220), outline=(0, 229, 255, 160), width=1)
    draw.text((pill_x + 18, pill_y + 8), "✦  SENIOR FULL-STACK & AI ARCHITECT", font=font_badge_bold, fill=(0, 229, 255, 255))

    # Name
    draw.text((65, 135), "Alejandro Chataing", font=font_name, fill=(255, 255, 255, 255))

    # Subhead / Value Prop
    draw.text((65, 220), "Author of mcp-code-context • 10+ Yrs Production Experience", font=font_sub, fill=(148, 163, 184, 255))
    draw.text((65, 256), "Cloudflare Edge • Multi-Agent Systems • Pure PHP 8.3 & React 19", font=font_sub, fill=(203, 213, 225, 255))

    # Tech Stack Tags
    tags = ["React 19", "Cloudflare D1 & Workers", "mcp-code-context AST", "Turnkey AI SaaS"]
    tag_x = 65
    tag_y = 345
    for tag in tags:
        # Measure text width
        bbox = draw.textbbox((0, 0), tag, font=font_tag)
        tw = bbox[2] - bbox[0]
        pw = tw + 28
        draw.rounded_rectangle((tag_x, tag_y, tag_x + pw, tag_y + 36), radius=12, fill=(30, 41, 59, 180), outline=(51, 65, 85, 255), width=1)
        draw.text((tag_x + 14, tag_y + 8), tag, font=font_tag, fill=(226, 232, 240, 255))
        tag_x += pw + 12

    # Bottom Footer Meta
    footer_y = 525
    draw.rounded_rectangle((65, footer_y - 12, 65 + 370, footer_y + 32), radius=10, fill=(15, 23, 42, 200), outline=(30, 41, 59, 200), width=1)
    # Green pulse dot
    draw.ellipse((82, footer_y + 4, 94, footer_y + 16), fill=(16, 185, 129, 255))
    draw.text((106, footer_y), "https://alejandro-chataing.pages.dev", font=font_footer, fill=(0, 229, 255, 255))

    draw.text((460, footer_y + 1), "•  Available for Contract & Staff Roles", font=font_badge, fill=(148, 163, 184, 255))

    # 4. Right Side: Circular Avatar of Alejandro with Neon Aura
    avatar_path = "C:/code/alejandro-chataing-dev/public/AlejandroChataing.png"
    if os.path.exists(avatar_path):
        raw_avatar = Image.open(avatar_path).convert("RGBA")
        
        # Center crop into square
        min_dim = min(raw_avatar.size)
        left = (raw_avatar.width - min_dim) // 2
        top = 0  # Favor top where face is
        cropped = raw_avatar.crop((left, top, left + min_dim, top + min_dim))
        
        size = 380
        avatar_resized = cropped.resize((size, size), Image.Resampling.LANCZOS)
        
        # Create circular mask
        mask = Image.new("L", (size, size), 0)
        draw_mask = ImageDraw.Draw(mask)
        draw_mask.ellipse((0, 0, size, size), fill=255)
        
        avatar_circle = ImageOps.fit(avatar_resized, mask.size, centering=(0.5, 0.5))
        avatar_circle.putalpha(mask)

        # Avatar Position
        av_x = 750
        av_y = 120

        # Avatar Outer Glow
        av_glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        draw_avglow = ImageDraw.Draw(av_glow)
        draw_avglow.ellipse((av_x - 15, av_y - 15, av_x + size + 15, av_y + size + 15), fill=(0, 229, 255, 60))
        av_glow = av_glow.filter(ImageFilter.GaussianBlur(25))
        img = Image.alpha_composite(img, av_glow)

        # Paste Circular Avatar
        img.paste(avatar_circle, (av_x, av_y), avatar_circle)

        draw = ImageDraw.Draw(img)
        # Circular borders
        draw.ellipse((av_x, av_y, av_x + size, av_y + size), outline=(0, 229, 255, 255), width=4)
        draw.ellipse((av_x + 4, av_y + 4, av_x + size - 4, av_y + size - 4), outline=(15, 23, 42, 180), width=2)

        # "Active Now" floating badge on avatar
        badge_w, badge_h = 210, 36
        bx, by = av_x + (size - badge_w) // 2, av_y + size - 20
        draw.rounded_rectangle((bx, by, bx + badge_w, by + badge_h), radius=18, fill=(15, 23, 42, 240), outline=(16, 185, 129, 255), width=2)
        draw.ellipse((bx + 16, by + 12, bx + 28, by + 24), fill=(16, 185, 129, 255))
        draw.text((bx + 38, by + 8), "AVAILABLE FOR WORK", font=font_badge_bold, fill=(255, 255, 255, 255))

    # Save outputs
    out_public = "C:/code/alejandro-chataing-dev/public/og-image.png"
    out_dist = "C:/code/alejandro-chataing-dev/dist/og-image.png"
    
    img_rgb = img.convert("RGB")
    img_rgb.save(out_public, "PNG", quality=95)
    img_rgb.save(out_dist, "PNG", quality=95)
    print("OG Image generated successfully at:", out_public)

if __name__ == "__main__":
    create_og_image()
