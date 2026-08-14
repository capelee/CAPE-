import os
import re

files_to_check = []
for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.ts', '.tsx')):
            files_to_check.append(os.path.join(root, f))

for fpath in sorted(files_to_check):
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find MUM or MuM when not immediately followed by ㄠ
    # matches: MUM or MuM
    lines = content.split('\n')
    for i, line in enumerate(lines):
        # find MUM or MuM
        # We want to catch instances in strings or JSX text, e.g. "MUM", "MuM", "MUM ", "MUM's"
        matches = list(re.finditer(r'(MUM|MuM)(?!ㄠ)', line))
        if matches:
            print(f"{fpath}:{i+1}: {line}")
