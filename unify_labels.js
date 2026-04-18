const fs = require('fs');
let content = fs.readFileSync('src/app/trainer/courses/create/page.tsx', 'utf8');

// 1. Unify the "صورة الدورة" label to use the new standard we'll apply everywhere
const imgLabelRegex = /<Label className="text-base font-bold inline-block" style={{ textAlign: 'right' }}>\r?\n\s*صورة الدورة <span className="text-red-500 mr-1 inline-block">\*<\/span>/;
content = content.replace(imgLabelRegex, '<Label className="text-base font-bold inline-flex items-center gap-1" style={{ textAlign: \'right\' }} dir="rtl">\n                                            صورة الدورة <span className="text-red-500 mt-1">*</span>');

// 2. Unify all other required labels
const otherLabelsRegex = /<Label>([^<]+) <span className="text-red-500 mr-1 inline-block">\*<\/span><\/Label>/g;
content = content.replace(otherLabelsRegex, '<Label className="text-base font-bold inline-flex items-center gap-1" style={{ textAlign: \'right\' }} dir="rtl">$1 <span className="text-red-500 mt-1">*</span></Label>');

fs.writeFileSync('src/app/trainer/courses/create/page.tsx', content);
console.log('Successfully unified all Label styles!');
