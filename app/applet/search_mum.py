import os

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            fpath = os.path.join(root, file)
            with open(fpath, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            for i, line in enumerate(lines):
                if 'MUM' in line:
                    # check if MUM is followed by ㄠ
                    # let's find all indexes of MUM
                    idx = 0
                    while True:
                        pos = line.find('MUM', idx)
                        if pos == -1:
                            break
                        # check if character after MUM is ㄠ
                        after = line[pos+3:pos+4]
                        if after != 'ㄠ':
                            print(f"{fpath}:{i+1}:{pos} [after='{after}']: {line.strip()}")
                        idx = pos + 3
