#!/usr/bin/env python3
"""Generate the MDM app icon set (squircle, gradient, download glyph)."""
import math
import os
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.dirname(os.path.abspath(__file__))
S = 1024  # master size


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def squircle_mask(size, radius_ratio=0.225, supersample=4):
    """Apple-ish rounded square mask."""
    w = size * supersample
    m = Image.new("L", (w, w), 0)
    d = ImageDraw.Draw(m)
    r = int(w * radius_ratio)
    d.rounded_rectangle([0, 0, w - 1, w - 1], radius=r, fill=255)
    return m.resize((size, size), Image.LANCZOS)


def gradient(size, stops):
    """stops: list of (position 0..1, rgb). Piecewise-linear, no seam."""
    img = Image.new("RGB", (1, size))
    for y in range(size):
        t = y / max(1, size - 1)
        for i in range(len(stops) - 1):
            p0, c0 = stops[i]
            p1, c1 = stops[i + 1]
            if p0 <= t <= p1:
                local = 0.0 if p1 == p0 else (t - p0) / (p1 - p0)
                # smoothstep for a softer blend
                local = local * local * (3 - 2 * local)
                img.putpixel((0, y), lerp(c0, c1, local))
                break
    return img.resize((size, size), Image.BICUBIC)


def build():
    # Vertical gradient: bright teal at top -> deep navy at bottom.
    top = (0x3F, 0xD9, 0xC6)
    mid = (0x1F, 0x9A, 0xB8)
    bottom = (0x10, 0x3B, 0x63)

    img = gradient(S, [(0.0, top), (0.55, mid), (1.0, bottom)]).resize((S, S))

    layer = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)

    # Soft top-left highlight for depth.
    glow = Image.new("L", (S, S), 0)
    ImageDraw.Draw(glow).ellipse(
        [-S * 0.45, -S * 0.62, S * 1.02, S * 0.42], fill=90
    )
    glow = glow.filter(ImageFilter.GaussianBlur(S * 0.09))
    white = Image.new("RGBA", (S, S), (255, 255, 255, 255))
    layer = Image.composite(white, layer, glow.point(lambda v: int(v * 0.55)))

    d = ImageDraw.Draw(layer)

    cx = S / 2
    white = (255, 255, 255, 255)
    stroke = int(S * 0.096)

    # Arrow drawn as three round-capped strokes: shaft + two chevrons.
    tip = (cx, S * 0.600)
    shaft_top = (cx, S * 0.215)
    left = (cx - S * 0.190, S * 0.408)
    right = (cx + S * 0.190, S * 0.408)

    for a, b in ((shaft_top, tip), (left, tip), (right, tip)):
        d.line([a, b], fill=white, width=stroke)
    for point in (shaft_top, left, right, tip):
        r = stroke / 2
        d.ellipse([point[0] - r, point[1] - r, point[0] + r, point[1] + r], fill=white)

    # Tray / baseline.
    bar_w = S * 0.285
    bar_h = S * 0.058
    bar_y = S * 0.795
    d.rounded_rectangle(
        [cx - bar_w, bar_y - bar_h / 2, cx + bar_w, bar_y + bar_h / 2],
        radius=bar_h / 2,
        fill=(255, 255, 255, 245),
    )

    img = Image.alpha_composite(img.convert("RGBA"), layer)

    mask = squircle_mask(S)
    out = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    return out


def save(img, path, size):
    img.resize((size, size), Image.LANCZOS).save(path)
    print("wrote", path)


if __name__ == "__main__":
    master = build()
    master.save(os.path.join(OUT, "app-icon.png"))
    print("wrote", os.path.join(OUT, "app-icon.png"))

    iconset = os.path.join(OUT, "..", "build", "icon.iconset")
    os.makedirs(iconset, exist_ok=True)
    for size in (16, 32, 128, 256, 512):
        save(master, os.path.join(iconset, f"icon_{size}x{size}.png"), size)
        save(master, os.path.join(iconset, f"icon_{size}x{size}@2x.png"), size * 2)

    ext = os.path.join(OUT, "..", "extension", "icons")
    os.makedirs(ext, exist_ok=True)
    for size in (16, 32, 48, 128):
        save(master, os.path.join(ext, f"icon{size}.png"), size)
