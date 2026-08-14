import re

with open('src/components/MumaoProjectPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace MUM or MuM when not followed by ㄠ and not part of identifier like MumaoCatIcon
# Note: In JSX text, comments, and strings:
# "MUM " -> "MUMㄠ "
# "MUM's" -> "MUMㄠ's"
# "MUM." -> "MUMㄠ."
# "MUM," -> "MUMㄠ,"
# "MUM，" -> "MUMㄠ，"
# "MUM。" -> "MUMㄠ。"
# "MUM\n" -> "MUMㄠ\n"
# "MUM<" -> "MUMㄠ<"
# "MUM&" -> "MUMㄠ&"
# "MUM=" -> "MUMㄠ="
# "MUM/" -> "MUMㄠ/"

def replace_mum(match):
    full = match.group(0)
    # If match is followed by ㄠ, keep it
    # But regex won't match if followed by ㄠ
    word = match.group(1)
    return word + 'ㄠ'

# Regex for MUM or MuM not followed by ㄠ, and not followed by alphanumeric/underscore (like Mumao, MUMAO, mumu)
# Notice: \bMUM\b or \bMuM\b or MUM/MuM before punctuation/space/brackets/etc.
pattern = r'\b(MUM|MuM)\b(?!\s*ㄠ)(?!ㄠ)'

new_content = re.sub(pattern, r'\1ㄠ', content)

with open('src/components/MumaoProjectPage.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Replacement complete for MumaoProjectPage.tsx")
