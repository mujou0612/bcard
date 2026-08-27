from PIL import Image
import segno, sys

TARGETS = [
    ('assets/poster-funtek.png',  'https://mujou0612.github.io/bcard/?card=funtek'),
    ('assets/poster-pinchat.png', 'https://mujou0612.github.io/bcard/?card=pinchat'),
]

ok_all = True
for path, url in TARGETS:
    im = Image.open(path).convert('RGB'); px = im.load(); W, H = im.size
    white = lambda x, y: (lambda p: p[0] > 245 and p[1] > 245 and p[2] > 245)(px[x, y])

    # 幾乎全白的列 = 卡片的上下留白帶(圓角讓首尾列略微內縮,但上下對稱)
    lo, hi = int(W * .12), int(W * .88)
    full = [y for y in range(H) if sum(1 for x in range(lo, hi, 3) if white(x, y)) > (hi - lo) / 3 * .95]
    cy_mid = (full[0] + full[-1]) // 2
    cols = [x for x in range(W) if white(x, cy_mid)]
    left, right = cols[0], cols[-1]
    size = right - left + 1                 # 卡片是正方形
    top = cy_mid - size // 2

    pad = round(W * 0.070)
    x0, y0 = left + pad, top + pad
    side = size - 2 * pad

    expected = [list(r) for r in segno.make(url, error='h').matrix]
    n = len(expected)
    step = side / n
    bad = 0
    for r in range(n):
        for c in range(n):
            cx = int(x0 + (c + .5) * step); cy = int(y0 + (r + .5) * step)
            rr, gg, bb = px[cx, cy]
            dark = 1 if (0.299*rr + 0.587*gg + 0.114*bb) < 160 else 0
            if dark != expected[r][c]: bad += 1
    qz = pad / step
    ok = bad == 0 and qz >= 4
    ok_all &= ok
    print(f'{"PASS" if ok else "FAIL"}  {path}')
    print(f'       卡片 {size}×{size}px, {n}×{n} 模組, 每格 {step:.1f}px, quiet zone {qz:.2f} 模組, 不符 {bad} 格')
sys.exit(0 if ok_all else 1)
