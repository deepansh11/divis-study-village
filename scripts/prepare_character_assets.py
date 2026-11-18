"""Extract the supplied character sheets locally. Requires Pillow and numpy.

No images are sent to any service. Runtime uses only the finished WebP assets;
the full private sheets do not need to be deployed.
"""
from __future__ import annotations

import argparse
from collections import deque
import json
import hashlib
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

SHEETS = {
    "Mini Avatar Design.png": {
        "mini-wave": (26, 35, 356, 580),
        "mini-reading": (360, 43, 612, 441),
        "mini-heart": (628, 38, 914, 536),
        "mini-peek": (333, 500, 637, 731),
        "mini-thumbs-up": (25, 606, 356, 1125),
        "mini-shrug": (362, 749, 590, 1040),
        "mini-tea": (630, 607, 914, 1140),
    },
    "Mini Avatar Design from Gemini.jpeg": {
        "mini-celebrate": (8, 29, 339, 584),
        "mini-laptop": (352, 39, 636, 435),
        "mini-sleepy": (634, 38, 917, 571),
        "mini-flex": (24, 610, 350, 1150),
        "mini-watering": (335, 451, 634, 1118),
        "mini-kiss": (627, 612, 917, 1144),
    },
    "Mini Avatar Design from Google Gemini.png": {
        "ghibli-totoro": (30, 30, 323, 389),
        "ghibli-blue-totoro": (342, 43, 540, 338),
        "ghibli-white-totoro": (550, 98, 650, 229),
        "ghibli-soot-sprites": (691, 54, 877, 216),
        "ghibli-catbus": (645, 213, 911, 360),
        "ghibli-kiki": (228, 331, 427, 611),
        "ghibli-jiji": (426, 402, 564, 587),
        "ghibli-san": (573, 334, 730, 609),
        "ghibli-kodama": (757, 403, 872, 591),
        "ghibli-howl": (65, 580, 335, 864),
        "ghibli-calcifer": (371, 618, 572, 835),
        "ghibli-no-face": (634, 590, 874, 844),
        "ghibli-haku": (51, 863, 327, 1150),
        "ghibli-ponyo": (389, 866, 584, 1121),
        "ghibli-turnip-head": (641, 853, 870, 1146),
    },
}

# Each frame has its own bounds and registration anchor. Generated sheets are
# not uniform grids: preserving the common ground line avoids hopping feet,
# and excludes the labels printed between rows.
SPRITE_SHEETS = {
    "Mini Avatar Design from Google Gemini (2).png": {
        "mini-tea-atlas": ((190, 300), 282, 316, [
            ((37, 48, 189, 327), 111), ((215, 48, 368, 327), 291),
            ((389, 48, 542, 327), 464), ((560, 48, 709, 327), 634),
            ((724, 48, 875, 327), 797),
        ]),
        "mini-reading-atlas": ((190, 300), 282, 695, [
            ((32, 428, 195, 708), 111), ((210, 428, 382, 708), 291),
            ((392, 428, 558, 708), 465), ((560, 428, 721, 708), 635),
            ((715, 428, 885, 708), 797),
        ]),
        "mini-kiss-atlas": ((190, 300), 282, 1095, [
            ((33, 825, 190, 1110), 110), ((226, 825, 381, 1110), 295),
            ((391, 825, 559, 1110), 469), ((556, 825, 725, 1110), 643),
            ((725, 825, 876, 1110), 798),
        ]),
    },
    "Mini Avatar Design (1).png": {
        "mini-celebrate-atlas": ((190, 300), 282, 307, [
            ((35, 48, 160, 320), 100), ((164, 48, 301, 320), 232),
            ((303, 48, 433, 320), 373), ((432, 48, 574, 320), 501),
            ((550, 48, 735, 320), 646), ((736, 48, 865, 320), 799),
        ]),
        "mini-laptop-atlas": ((190, 300), 282, 692, [
            ((35, 428, 194, 705), 112), ((207, 428, 385, 705), 291),
            ((391, 428, 552, 705), 470), ((550, 428, 719, 705), 632),
            ((716, 428, 884, 705), 796),
        ]),
        "mini-watering-atlas": ((240, 300), 282, 1097, [
            ((24, 827, 224, 1108), 118), ((224, 827, 425, 1108), 315),
            ((390, 827, 556, 1108), 486), ((578, 827, 709, 1108), 645),
            ((726, 827, 860, 1108), 796),
        ]),
    },
    "Mini Avatar Design (2).png": {
        "mylo-idle-atlas": ((210, 240), 220, 262, [
            ((52, 94, 189, 273), 123), ((188, 94, 313, 273), 250),
            ((310, 94, 438, 273), 375), ((435, 94, 563, 273), 500),
            ((560, 94, 709, 273), 629), ((690, 90, 895, 273), 768),
        ]),
        "mylo-playful-atlas": ((240, 250), 220, 660, [
            ((59, 467, 216, 669), 141), ((223, 467, 429, 669), 330),
            ((436, 467, 646, 669), 535), ((650, 467, 846, 669), 752),
        ]),
        "mylo-rest-atlas": ((240, 250), 220, 1025, [
            ((50, 837, 260, 1039), 156), ((268, 837, 445, 1039), 356),
            ((452, 837, 626, 1039), 536), ((628, 837, 850, 1039), 729),
        ]),
    },
    "Mini Avatar Design from Google Gemini (1).png": {
        "mylo-scratch-atlas": ((240, 250), 225, 1115, [
            ((8, 900, 214, 1133), 120), ((174, 900, 374, 1133), 286),
            ((351, 900, 548, 1133), 456), ((529, 900, 721, 1133), 626),
            ((702, 900, 891, 1133), 797),
        ]),
    },
}


def transparent_crop(image: Image.Image, box: tuple[int, int, int, int], trim: bool = True) -> Image.Image:
    rgb = np.array(image.convert("RGB").crop(box))
    h, w, _ = rgb.shape
    # Only remove near-white regions connected to the outside. Enclosed white
    # shorts, eyes and light character bodies remain intact.
    white = (rgb.min(axis=2) >= 235) & (rgb.max(axis=2).astype(int) - rgb.min(axis=2) <= 23)
    background = np.zeros((h, w), dtype=bool)
    queue = deque([(0, x) for x in range(w)] + [(h - 1, x) for x in range(w)] + [(y, 0) for y in range(h)] + [(y, w - 1) for y in range(h)])
    while queue:
        y, x = queue.popleft()
        if y < 0 or y >= h or x < 0 or x >= w or background[y, x] or not white[y, x]:
            continue
        background[y, x] = True
        queue.extend(((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)))
    alpha = np.where(background, 0, 255).astype(np.uint8)
    # A few rectangles necessarily cross a neighboring figure's edge. Its
    # disconnected fragment touches the crop border; the intended figure does
    # not. Remove those clipped fragments without removing floating hearts/Zs.
    visited = np.zeros((h, w), dtype=bool)
    for y, x in [(0, x) for x in range(w)] + [(h - 1, x) for x in range(w)] + [(y, 0) for y in range(h)] + [(y, w - 1) for y in range(h)]:
        if alpha[y, x] == 0 or visited[y, x]:
            continue
        queue = deque([(y, x)])
        while queue:
            yy, xx = queue.popleft()
            if yy < 0 or yy >= h or xx < 0 or xx >= w or visited[yy, xx] or alpha[yy, xx] == 0:
                continue
            visited[yy, xx] = True
            alpha[yy, xx] = 0
            queue.extend(((yy - 1, xx), (yy + 1, xx), (yy, xx - 1), (yy, xx + 1)))
    # Soften only the very light edge pixels, not white interior artwork.
    outside = alpha == 0
    adjacent = np.zeros((h, w), dtype=bool)
    adjacent[1:] |= outside[:-1]
    adjacent[:-1] |= outside[1:]
    adjacent[:, 1:] |= outside[:, :-1]
    adjacent[:, :-1] |= outside[:, 1:]
    fringe = adjacent & (alpha > 0) & (rgb.min(axis=2) > 195)
    coverage = np.clip((255 - rgb.min(axis=2).astype(float)) / 60, .12, 1)
    alpha[fringe] = (coverage[fringe] * 255).astype(np.uint8)
    for channel in range(3):
        unmatte = np.clip((rgb[:, :, channel].astype(float) - 255 * (1 - coverage)) / coverage, 0, 255)
        rgb[:, :, channel][fringe] = unmatte[fringe].astype(np.uint8)
    result = Image.fromarray(np.dstack((rgb, alpha)), "RGBA")
    if not trim:
        return result
    bounds = result.getbbox()
    if not bounds:
        raise ValueError(f"Empty character crop: {box}")
    result = result.crop(bounds)
    padded = Image.new("RGBA", (result.width + 16, result.height + 16))
    padded.alpha_composite(result, (8, 8))
    return padded


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", type=Path, default=Path.home() / "Downloads")
    parser.add_argument("--output-dir", type=Path, default=Path(__file__).resolve().parents[1] / "public" / "characters")
    parser.add_argument("--contact-sheet", type=Path)
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    manifest = {}
    crops = []
    for filename, characters in SHEETS.items():
        with Image.open(args.source_dir / filename) as image:
            if image.size != (928, 1152):
                raise ValueError(f"Unexpected source dimensions for {filename}: {image.size}")
            for name, box in characters.items():
                crop = transparent_crop(image, box)
                if crop.width < 30 or crop.height < 30:
                    raise ValueError(f"Character was clipped or empty: {name}")
                output = args.output_dir / f"{name}.webp"
                crop.save(output, "WEBP", lossless=True, method=6)
                manifest[name] = {"width": crop.width, "height": crop.height, "bytes": output.stat().st_size, "sha256": hashlib.sha256(output.read_bytes()).hexdigest()}
                crops.append((name, crop))
                print(f"{name}: {crop.width}x{crop.height}, {output.stat().st_size // 1024} KiB")
    for filename, animations in SPRITE_SHEETS.items():
        with Image.open(args.source_dir / filename) as image:
            if image.size != (896, 1200):
                raise ValueError(f"Unexpected sprite dimensions: {filename}: {image.size}")
            for name, (size, baseline, source_ground, definitions) in animations.items():
                width, height = size
                atlas = Image.new("RGBA", (width * len(definitions), height))
                for index, (box, anchor) in enumerate(definitions):
                    frame = transparent_crop(image, box, trim=False)
                    bounds = frame.getbbox()
                    if not bounds or bounds[2] - bounds[0] < 30 or np.count_nonzero(np.array(frame.getchannel("A")) > 32) < 1000:
                        raise ValueError(f"Clipped animation frame: {name} #{index}")
                    registered = Image.new("RGBA", size)
                    registered.alpha_composite(frame, (width // 2 - (anchor - box[0]), baseline - (source_ground - box[1])))
                    atlas.alpha_composite(registered, (index * width, 0))
                    crops.append((f"{name}:{index}", registered))
                output = args.output_dir / f"{name}.webp"
                atlas.save(output, "WEBP", lossless=True, method=6)
                manifest[name] = {"width": atlas.width, "height": atlas.height, "frames": len(definitions), "frameWidth": width, "frameHeight": height, "bytes": output.stat().st_size, "sha256": hashlib.sha256(output.read_bytes()).hexdigest()}
                print(f"{name}: {len(definitions)} registered frames, {output.stat().st_size // 1024} KiB")
    (args.output_dir / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    if args.contact_sheet:
        sheet = Image.new("RGB", (7 * 170, ((len(crops) + 6) // 7) * 225), "#e6ecdc")
        draw = ImageDraw.Draw(sheet)
        for index, (name, image) in enumerate(crops):
            image = image.copy()
            image.thumbnail((154, 193))
            x, y = index % 7 * 170, index // 7 * 225
            sheet.paste(image, (x + (170 - image.width) // 2, y + 7), image)
            draw.text((x + 5, y + 207), name, fill="#34472e")
        args.contact_sheet.parent.mkdir(parents=True, exist_ok=True)
        sheet.save(args.contact_sheet)
    print(f"Total: {sum(x['bytes'] for x in manifest.values()) // 1024} KiB across {len(manifest)} assets")


if __name__ == "__main__":
    main()
