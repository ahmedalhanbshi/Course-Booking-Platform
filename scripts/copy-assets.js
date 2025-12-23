const fs = require('fs');
const path = require('path');

const mappings = [
  { src: 'C:\\Users\\ahmeb\\.gemini\\antigravity\\brain\\0436144e-6bff-43be-9e0f-2b14c2783220\\uploaded_image_1766267294978.png', dest: 'd:\\course-booking-platform\\public\\images\\logo.png' },
  { src: 'C:\\Users\\ahmeb\\.gemini\\antigravity\\brain\\0436144e-6bff-43be-9e0f-2b14c2783220\\course_business_1766265623966.png', dest: 'd:\\course-booking-platform\\public\\images\\course-business.png' },
  { src: 'C:\\Users\\ahmeb\\.gemini\\antigravity\\brain\\0436144e-6bff-43be-9e0f-2b14c2783220\\course_security_1766265645093.png', dest: 'd:\\course-booking-platform\\public\\images\\course-security.png' },
  { src: 'C:\\Users\\ahmeb\\.gemini\\antigravity\\brain\\0436144e-6bff-43be-9e0f-2b14c2783220\\avatar_4_1766265668714.png', dest: 'd:\\course-booking-platform\\public\\images\\avatar-4.png' },
  { src: 'C:\\Users\\ahmeb\\.gemini\\antigravity\\brain\\0436144e-6bff-43be-9e0f-2b14c2783220\\student_1_1766265684286.png', dest: 'd:\\course-booking-platform\\public\\images\\student-1.png' },
  { src: 'C:\\Users\\ahmeb\\.gemini\\antigravity\\brain\\0436144e-6bff-43be-9e0f-2b14c2783220\\student_2_1766265698957.png', dest: 'd:\\course-booking-platform\\public\\images\\student-2.png' },
  { src: 'C:\\Users\\ahmeb\\.gemini\\antigravity\\brain\\0436144e-6bff-43be-9e0f-2b14c2783220\\hero_pattern_1766265728764.png', dest: 'd:\\course-booking-platform\\public\\images\\hero-pattern.png' },
  { src: 'C:\\Users\\ahmeb\\.gemini\\antigravity\\brain\\0436144e-6bff-43be-9e0f-2b14c2783220\\pattern_dark_1766265750425.png', dest: 'd:\\course-booking-platform\\public\\images\\pattern-dark.png' }
];

mappings.forEach(m => {
  try {
    // Ensure dir exists
    const dir = path.dirname(m.dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.copyFileSync(m.src, m.dest);
    console.log(`SUCCESS: Copied to ${m.dest}`);
  } catch (err) {
    console.error(`ERROR: Failed to copy to ${m.dest}: ${err.message}`);
  }
});
