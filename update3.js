const fs = require('fs');

let content = fs.readFileSync('src/app/trainer/courses/create/page.tsx', 'utf8');

const regex1 = /<div className="flex items-center gap-2">\r?\n\s*<Label className="text-base font-bold">صورة الدورة \*<\/Label>\r?\n\s*<div title="اختر صورة معبرة عن الدورة بصيغة JPG أو PNG\. المقاس الموصى به: 800×600 بكسل">\r?\n\s*<HelpCircle className="h-4 w-4 text-gray-400 cursor-help hover:text-gray-600 transition-colors" \/>\r?\n\s*<\/div>\r?\n\s*<\/div>/;

const replace1 = `<div className="text-right w-full mb-2">
                                        <Label className="text-base font-bold inline-flex items-center gap-2">
                                            صورة الدورة *
                                            <span title="اختر صورة معبرة عن الدورة بصيغة JPG أو PNG. المقاس الموصى به: 800×600 بكسل" className="inline-block cursor-help">
                                                <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors pointer-events-auto" />
                                            </span>
                                        </Label>
                                    </div>`;

content = content.replace(regex1, replace1);

fs.writeFileSync('src/app/trainer/courses/create/page.tsx', content);
console.log("update3.js executed successfully.");
