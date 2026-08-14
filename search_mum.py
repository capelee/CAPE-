import glob
import re

files = glob.glob('src/**/*.{ts,tsx}', recursive=True) + glob.glob('src/**/*.ts', recursive=True)
files += ['src/data.ts', 'src/App.tsx']
files = list(set(files))

for f in sorted(files):
    with open(f, 'r', encoding='utf-8') as file:
        lines = file.readlines()
    for i, line in enumerate(lines):
        # find MUM or MuM
        # match MUM or MuM not followed by ㄠ
        for match in re.finditer(r'(MUM|MuM)', line):
            start, end = match.span()
            # check if followed by ㄠ
            if not line[end:].startswith('ㄠ'):
                print(f"{f}:{i+1}:{start} -> {line.strip()}")
