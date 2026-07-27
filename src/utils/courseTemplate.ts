import { Course } from '../store/useCourseStore';

export function getCourseHtmlTemplate(course: Course): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>${course.title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #020617;
          color: #f8fafc;
          margin: 0;
          padding: 16px;
          line-height: 1.5;
        }
        .header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #1e293b;
        }
        .category {
          display: inline-block;
          background-color: #1e3a8a;
          color: #60a5fa;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 9999px;
          margin-bottom: 8px;
        }
        h1 {
          font-size: 22px;
          font-weight: 800;
          margin: 4px 0;
          color: #ffffff;
        }
        .instructor {
          font-size: 13px;
          color: #94a3b8;
          margin-top: 4px;
        }
        .section-title {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #3b82f6;
          margin: 20px 0 10px 0;
        }
        .lesson-card {
          background-color: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .lesson-card:active {
          background-color: #1e293b;
        }
        .lesson-info {
          flex: 1;
        }
        .lesson-title {
          font-size: 14px;
          font-weight: 600;
          color: #f1f5f9;
        }
        .lesson-duration {
          font-size: 11px;
          color: #64748b;
          margin-top: 2px;
        }
        .checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid #3b82f6;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .checkbox.checked {
          background-color: #3b82f6;
        }
        .checkbox.checked::after {
          content: "✔";
          color: white;
          font-size: 12px;
        }
        .btn {
          display: block;
          width: 100%;
          background-color: #10b981;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          text-align: center;
          margin-top: 30px;
          box-sizing: border-box;
          text-decoration: none;
        }
        .btn:active {
          background-color: #059669;
        }
        /* Custom Alert Banner from Native App */
        #native-alert {
          display: none;
          background-color: #1e1b4b;
          border: 1px solid #4338ca;
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 20px;
        }
        #native-alert-title {
          font-weight: 700;
          color: #818cf8;
          font-size: 13px;
        }
        #native-msg {
          font-size: 13px;
          color: #c7d2fe;
          margin-top: 4px;
        }
      </style>
    </head>
    <body>
      <!-- Message banner injected from Native app -->
      <div id="native-alert">
        <div id="native-alert-title">📢 Native Message:</div>
        <div id="native-msg"></div>
      </div>

      <div class="header">
        <span class="category">${course.category}</span>
        <h1>${course.title}</h1>
        <div class="instructor">Instructor: <b>${course.instructor.name}</b></div>
      </div>

      <div class="section-title">Course Syllabus</div>
      
      <div class="lesson-card" onclick="toggleLesson(this, 'lesson1')">
        <div class="lesson-info">
          <div class="lesson-title">1. Introduction to the Course</div>
          <div class="lesson-duration">Duration: 12 mins</div>
        </div>
        <div class="checkbox" id="checkbox-lesson1"></div>
      </div>

      <div class="lesson-card" onclick="toggleLesson(this, 'lesson2')">
        <div class="lesson-info">
          <div class="lesson-title">2. Fundamentals & Setup Details</div>
          <div class="lesson-duration">Duration: 25 mins</div>
        </div>
        <div class="checkbox" id="checkbox-lesson2"></div>
      </div>

      <div class="lesson-card" onclick="toggleLesson(this, 'lesson3')">
        <div class="lesson-info">
          <div class="lesson-title">3. Deep Dive Workshop</div>
          <div class="lesson-duration">Duration: 45 mins</div>
        </div>
        <div class="checkbox" id="checkbox-lesson3"></div>
      </div>

      <div class="lesson-card" onclick="toggleLesson(this, 'lesson4')">
        <div class="lesson-info">
          <div class="lesson-title">4. Real-world Project Application</div>
          <div class="lesson-duration">Duration: 30 mins</div>
        </div>
        <div class="checkbox" id="checkbox-lesson4"></div>
      </div>

      <button class="btn" onclick="claimCertificate()">🎓 Claim Certificate</button>

      <script>
        // Store completed state locally in WebView session
        const completed = {};

        function toggleLesson(element, id) {
          const checkbox = document.getElementById('checkbox-' + id);
          completed[id] = !completed[id];
          
          if (completed[id]) {
            checkbox.classList.add('checked');
          } else {
            checkbox.classList.remove('checked');
          }

          // Send lesson update back to native app
          const totalLessons = 4;
          const completedCount = Object.values(completed).filter(Boolean).length;
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'lesson_update',
            completed: completedCount,
            total: totalLessons
          }));
        }

        function claimCertificate() {
          const completedCount = Object.values(completed).filter(Boolean).length;
          if (completedCount < 4) {
            alert('Please complete all 4 lessons before claiming your course certificate!');
            return;
          }
          // Send completion back to native
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'course_completed'
          }));
        }

        // Bridge function to receive messages from React Native app
        function onNativeMessage(message) {
          document.getElementById('native-alert').style.display = 'block';
          document.getElementById('native-msg').innerText = message;
          // Scroll page to top to see native banner
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      </script>
    </body>
    </html>
  `;
}
