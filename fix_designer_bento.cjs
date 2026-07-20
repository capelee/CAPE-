const fs = require('fs');
const filePath = 'src/components/DesignerBento.tsx';
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('import { motion } from "motion/react"')) {
    content = content.replace('import React, { useState } from "react";', 'import React, { useState } from "react";\nimport { motion } from "motion/react";');
}

// Convert experience list map <div> to <motion.div>
content = content.replace(
    /key=\{i\} style=\{getGravityStyle\(6 \+ i\)\} className="flex gap-2\.5 pl-0\.5 relative group"/g,
    'key={i} style={getGravityStyle(6 + i)} className={`flex gap-2.5 p-1.5 -mx-1.5 rounded-lg relative group transition-all duration-300 ${theme === "sepia" ? "hover:bg-[#E3D3BE]/40" : theme === "light" ? "hover:bg-zinc-100" : "hover:bg-white/[0.03]"}`}\n                      whileHover={{ x: 4 }}'
);

content = content.replace(
    /\{profile\.experienceList\.map\(\(exp, i\) => \(\n                    <div/g,
    '{profile.experienceList.map((exp, i) => (\n                    <motion.div'
);

content = content.replace(
    /<\/p>\n                      <\/div>\n                    <\/div>\n                  \)\)\}/g,
    '</p>\n                      </div>\n                    </motion.div>\n                  ))}'
);


// Same for Education
content = content.replace(
    /key=\{i\} style=\{getGravityStyle\(10 \+ i\)\} className=\{`flex gap-2\.5 p-1\.5 -mx-1\.5 rounded-lg relative group transition-all duration-300 \$\{/g,
    'key={i} style={getGravityStyle(10 + i)} className={`flex gap-2.5 p-1.5 -mx-1.5 rounded-lg relative group transition-all duration-300 ${'
);
// Replace <div key={i} with <motion.div key={i} inside education
content = content.replace(
    /\{profile\.education\.map\(\(edu, i\) => \(\n                    <div/g,
    '{profile.education.map((edu, i) => (\n                    <motion.div whileHover={{ x: 4 }}'
);
// replace closing div
content = content.replace(
    /<\/p>\n                      <\/div>\n                    <\/div>\n                  \)\)\}\n                <\/div>/g,
    '</p>\n                      </div>\n                    </motion.div>\n                  ))}\n                </div>'
);

// We need to also add scaling to the dot in experience list.
// Find the h-[18px] div in experience
content = content.replace(
    /className=\{`h-\[18px\] w-\[18px\] rounded-full flex items-center justify-center transition-colors duration-300 z-10 shrink-0 mt-0\.5 \$\{/g,
    'className={`h-[18px] w-[18px] rounded-full flex items-center justify-center transition-all duration-300 z-10 shrink-0 mt-0.5 group-hover:scale-110 ${'
);


fs.writeFileSync(filePath, content, 'utf8');
console.log('Done optimizing interactivity for resume');
