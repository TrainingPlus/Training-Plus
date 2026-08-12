// ==========================================
// 1. FIREBASE CONFIGURATION
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyCzTs_zw28wkHij4Jj9-EEW3XOpQ5si2yc",
    authDomain: "training-plus-212a2.firebaseapp.com",
    projectId: "training-plus-212a2",
    storageBucket: "training-plus-212a2.firebasestorage.app",
    messagingSenderId: "330136803727",
    appId: "1:330136803727:web:3013a358a547a112ff93fa",
    measurementId: "G-FX3XRSLD8W"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

let currentUserData = null;
let studentList = [];
let currentLang = 'en';

// Track initial page load time to prevent old unread badge alerts
const pageLoadedAt = new Date();

// ==========================================
// 2. LANGUAGE TRANSLATIONS (ENGLISH / ARABIC)
// ==========================================
const translations = {
    en: {
        search_placeholder: "Search by name or CPR...",
        download_all: "Download All (Excel)",
        account: "Account",
        logout: "Logout",
        welcome_title: "Welcome",
        welcome_subtitle: "Sign in to access the Training Plus Student Directory",
        btn_google: "Sign in with Google",
        student_directory: "Student Directory",
        add_new_cpr: "+ Add New CPR",
        register_cpr: "Register New CPR",
        register_cpr_subtitle: "Enter a 9-digit CPR number to add a student.",
        cpr_label: "CPR Number (9 Digits):",
        btn_submit: "Submit Record",
        btn_back: "Done / Back",
        cpr_success_title: "CPR Added Successfully!",
        cpr_success_subtitle: "Would you like to add another student CPR record?",
        btn_add_another: "+ Add Another CPR",
        btn_go_directory: "Go to Directory",
        modal_account_title: "User Account",
        lbl_user_id: "User ID:",
        lbl_username: "Username:",
        lbl_email: "Email:",
        chat_header: "Team Group Chat",
        chat_placeholder: "Type a message...",
        btn_send: "Send",
        btn_download_excel: "Download Excel",
        btn_delete_student: "Delete Student",
        lbl_full_name: "Full Name:",
        lbl_cpr: "CPR:",
        lbl_gender: "Gender:",
        opt_male: "Male",
        opt_female: "Female",
        lbl_cv_doc: "Student CV Document",
        btn_upload_cv: "Upload CV",
        btn_view_cv: "📄 View / Download CV",
        btn_delete_cv: "Delete CV",
        lbl_no_cv: "No CV uploaded",
        lbl_enrolled_courses: "Enrolled Courses",
        ph_course: "Enter course name (e.g. Web Development)",
        btn_add_course: "+ Add Course",
        btn_delete_course: "Delete Course",
        lbl_no_courses: "No courses added yet.",
        lbl_no_students: "No student records found.",
        lbl_student_number: "Student Number:",
        lbl_major: "Major:"
    },
    ar: {
        search_placeholder: "البحث بالاسم أو الرقم الشخصي...",
        download_all: "تحميل الكل (إكسل)",
        account: "الحساب",
        logout: "تسجيل الخروج",
        welcome_title: "مرحباً بك",
        welcome_subtitle: "سجل الدخول للوصول إلى دليل طلاب ترينينج بلس",
        btn_google: "تسجيل الدخول باستخدام جوجل",
        student_directory: "دليل الطلاب",
        add_new_cpr: "+ إضافة رقم شخصي جديد",
        register_cpr: "تسجيل رقم شخصي جديد",
        register_cpr_subtitle: "أدخل الرقم الشخصي المكون من 9 أرقام لإضافة طالب.",
        cpr_label: "الرقم الشخصي (9 أرقام):",
        btn_submit: "إرسال السجل",
        btn_back: "تم / العودة",
        cpr_success_title: "تمت إضافة الرقم الشخصي بنجاح!",
        cpr_success_subtitle: "هل ترغب في إضافة سجل طالب آخر؟",
        btn_add_another: "+ إضافة رقم شخصي آخر",
        btn_go_directory: "الانتقال إلى الدليل",
        modal_account_title: "حساب المستخدم",
        lbl_user_id: "معرف المستخدم:",
        lbl_username: "اسم المستخدم:",
        lbl_email: "البريد الإلكتروني:",
        chat_header: "محادثة الفريق الجماعية",
        chat_placeholder: "اكتب رسالة...",
        btn_send: "إرسال",
        btn_download_excel: "تحميل إكسل",
        btn_delete_student: "حذف الطالب",
        lbl_full_name: "الاسم الكامل:",
        lbl_cpr: "الرقم الشخصي:",
        lbl_gender: "الجنس:",
        opt_male: "ذكر",
        opt_female: "أنثى",
        lbl_cv_doc: "مستند السيرة الذاتية للطالب",
        btn_upload_cv: "رفع السيرة الذاتية",
        btn_view_cv: "📄 عرض / تحميل السيرة الذاتية",
        btn_delete_cv: "حذف السيرة الذاتية",
        lbl_no_cv: "لم يتم رفع سيرة ذاتية",
        lbl_enrolled_courses: "الدورات المسجلة",
        ph_course: "أدخل اسم الدورة (مثال: تطوير الويب)",
        btn_add_course: "+ إضافة دورة",
        btn_delete_course: "حذف الدورة",
        lbl_no_courses: "لم يتم إضافة دورات بعد.",
        lbl_no_students: "لم يتم العثور على سجلات للطلاب.",
        lbl_student_number: "الرقم الجامعي:",
        lbl_major: "التخصص:"
    }
};

function toggleLanguage() {
    currentLang = (currentLang === 'en') ? 'ar' : 'en';
    document.documentElement.dir = (currentLang === 'ar') ? 'rtl' : 'ltr';
    applyLanguageTranslations();
    renderStudentDirectory(studentList);
}

function applyLanguageTranslations() {
    const langObj = translations[currentLang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (langObj[key]) el.innerText = langObj[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (langObj[key]) el.placeholder = langObj[key];
    });
}

// Monitor Auth State
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUserData = user;
        updateUserUI(true);
        listenToStudentDirectory();
        listenToGroupChat();
    } else {
        currentUserData = null;
        updateUserUI(false);
    }
});

// ==========================================
// 3. USER UI & AUTH UPDATES
// ==========================================
async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await auth.signInWithPopup(provider);
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        alert("Sign-In Failed: " + error.message);
    }
}

function updateUserUI(isLoggedIn) {
    document.getElementById('search-box')?.classList.toggle('hidden', !isLoggedIn);
    document.getElementById('download-all-btn')?.classList.toggle('hidden', !isLoggedIn);
    document.getElementById('account-btn')?.classList.toggle('hidden', !isLoggedIn);
    document.getElementById('logout-btn')?.classList.toggle('hidden', !isLoggedIn);

    if (isLoggedIn && currentUserData) {
        const idEl = document.getElementById('modal-userid');
        const nameEl = document.getElementById('modal-username');
        const emailEl = document.getElementById('modal-email');

        const simpleUserId = currentUserData.uid 
            ? `#USR-${currentUserData.uid.substring(0, 6).toUpperCase()}`
            : '#10001';

        if (idEl) idEl.innerText = simpleUserId;
        if (nameEl) nameEl.innerText = currentUserData.displayName || currentUserData.email?.split('@')[0] || "User";
        if (emailEl) emailEl.innerText = currentUserData.email || '';

        showView('view-home');
    } else {
        showView('view-auth');
    }
}

function logoutUser() {
    auth.signOut();
}

// ==========================================
// 4. CPR RECORD MANAGEMENT
// ==========================================
async function addStudentCPR() {
    const cprInput = document.getElementById('cpr-input');
    if (!cprInput) return;

    const cpr = cprInput.value.trim();

    // Validate 9-digit CPR format
    if (!/^\d{9}$/.test(cpr)) {
        const errorMsg = (typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang].alert_cpr_length) 
            ? translations[currentLang].alert_cpr_length 
            : "CPR must be exactly 9 digits.";
        alert(errorMsg);
        return;
    }

    try {
        const currentUser = firebase.auth().currentUser;
        if (!currentUser) {
            alert("You must be logged in to add a CPR.");
            return;
        }

        const currentUid = currentUser.uid;
        const currentEmail = currentUser.email;
        const currentName = currentUser.displayName || currentUser.email;

        const docRef = db.collection("students").doc(cpr);
        const docSnap = await docRef.get();

        // Check if CPR already exists
        if (docSnap.exists) {
            const existingData = docSnap.data();
            
            const creatorUid = existingData.createdByUid || existingData.added_by;
            const creatorEmail = existingData.createdByEmail || existingData.added_by;

            // Check if added by current user
            const isMyRecord = (creatorUid && creatorUid === currentUid) || 
                               (creatorEmail && creatorEmail === currentEmail);

            if (isMyRecord) {
                alert(`This CPR (${cpr}) is already registered in your directory.`);
            } else {
                const addedBy = existingData.createdByName || existingData.createdByEmail || existingData.added_by || "another user";
                alert(`This CPR (${cpr}) is already registered in the directory (Added by: ${addedBy}).`);
            }
            return; // Stop submission
        }

        // Save new record with consistent ownership fields
        await docRef.set({
            cpr: cpr,
            studentNumber: cpr,
            major: "N/A",
            phone: "N/A",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdByUid: currentUid,
            createdByEmail: currentEmail,
            createdByName: currentName,
            added_by: currentEmail // Ensures compatibility with directory listener
        });

        // Clear input field
        cprInput.value = '';

        // Navigate to success view
        showView('view-cpr-success');

    } catch (error) {
        console.error("Error processing CPR addition:", error);
        alert("Failed to process request: " + error.message);
    }
}

// ==========================================
// 5. STUDENT DIRECTORY & EXCEL EXPORTS
// ==========================================
function listenToStudentDirectory() {
    if (!currentUserData) return;

    db.collection('students').onSnapshot((snapshot) => {
        studentList = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            // Load all documents into the list without filtering by user
            studentList.push({ id: doc.id, ...data });
        });

        renderStudentDirectory(studentList);
    }, (error) => {
        console.error("Error fetching students:", error);
    });
}

// ==========================================
// 6. COURSE MANAGEMENT
// ==========================================
async function addCourseToStudent(studentId) {
    const inputEl = document.getElementById(`course-input-${studentId}`);
    if (!inputEl) return;

    const courseName = inputEl.value.trim();
    if (!courseName) {
        alert("Please enter a course name.");
        return;
    }

    const now = new Date();
    const formattedDateTime = now.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    }) + ", " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newCourseObj = {
        name: courseName,
        addedAt: formattedDateTime
    };

    try {
        const studentRef = db.collection('students').doc(studentId);
        const docSnap = await studentRef.get();
        if (!docSnap.exists) return;

        const data = docSnap.data();
        let currentCourses = Array.isArray(data.courses) ? data.courses : [];
        currentCourses.push(newCourseObj);

        await studentRef.update({ courses: currentCourses });
        inputEl.value = "";
    } catch (err) {
        console.error("Error adding course:", err);
        alert("Error adding course: " + err.message);
    }
}

async function removeCourse(studentId, courseIndex) {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
        const studentRef = db.collection('students').doc(studentId);
        const docSnap = await studentRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            let existingCourses = Array.isArray(data.courses) ? data.courses : [];
            existingCourses.splice(courseIndex, 1);
            await studentRef.update({ courses: existingCourses });
        }
    } catch (err) {
        console.error("Error removing course:", err);
        alert("Failed to delete course: " + err.message);
    }
}

// ==========================================
// 7. CV UPLOAD & DELETE
// ==========================================
async function uploadStudentCV(studentId) {
    const fileInput = document.getElementById(`cv-input-${studentId}`);
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        alert("Please select a file first!");
        return;
    }

    const file = fileInput.files[0];
    if (file.size > 700 * 1024) {
        alert("File size is too large! Please select a file under 700KB.");
        return;
    }

    const reader = new FileReader();
    reader.onload = async function (e) {
        try {
            await db.collection('students').doc(studentId).update({
                cvUrl: e.target.result,
                cvName: file.name
            });
            alert("CV uploaded and saved successfully!");
        } catch (err) {
            console.error("Firestore CV update error:", err);
            alert("Failed to save CV: " + err.message);
        }
    };
    reader.readAsDataURL(file);
}

async function deleteStudentCV(studentId) {
    if (!confirm("Are you sure you want to delete this CV?")) return;

    try {
        await db.collection('students').doc(studentId).update({
            cvUrl: firebase.firestore.FieldValue.delete(),
            cvName: firebase.firestore.FieldValue.delete()
        });
        alert("CV deleted successfully!");
    } catch (err) {
        console.error("Error deleting CV:", err);
        alert("Failed to delete CV: " + err.message);
    }
}

// ==========================================
// 8. REAL-TIME GROUP CHAT & EMOJI PICKER
// ==========================================
function listenToGroupChat() {
    db.collection('chat_messages')
      .orderBy('timestamp', 'asc')
      .limitToLast(50)
      .onSnapshot((snapshot) => {
          const box = document.getElementById('chat-messages');
          if (!box) return;

          box.innerHTML = "";

          const currentUserId = currentUserData ? currentUserData.uid : null;
          const currentName = currentUserData ? (currentUserData.displayName || currentUserData.email?.split('@')[0]) : null;

          let unreadCount = 0;
          const isChatHidden = document.getElementById('chat-window')?.classList.contains('hidden');

          // Read last opened timestamp from localStorage, default to page load time
          const savedLastRead = localStorage.getItem('lastReadChatTime');
          const lastReadTime = savedLastRead ? new Date(savedLastRead) : pageLoadedAt;

          snapshot.forEach(doc => {
              const m = doc.data();
              const div = document.createElement('div');
              
              const senderName = m.username || "Anonymous";
              const textContent = m.message || "";
              
              // Check if message belongs to active user
              const isMe = (m.uid && m.uid === currentUserId) || (senderName === currentName);

              // Convert Firestore timestamp to JS Date safely
              const msgDate = m.timestamp && typeof m.timestamp.toDate === 'function' 
                  ? m.timestamp.toDate() 
                  : new Date();

              // ONLY count as unread if chat window is closed, not sent by me, and newer than last read time
              if (isChatHidden && !isMe && msgDate > lastReadTime) {
                  unreadCount++;
              }
              
              div.className = `chat-msg ${isMe ? 'my-msg' : 'other-msg'}`;
              
              // Smart Date & Time Formatting
              let timeStr = "";
              if (m.timestamp && typeof m.timestamp.toDate === 'function') {
                  const now = new Date();
                  const yesterday = new Date(now);
                  yesterday.setDate(now.getDate() - 1);
                  
                  const isToday = msgDate.toDateString() === now.toDateString();
                  const isYesterday = msgDate.toDateString() === yesterday.toDateString();
                  
                  const timeOnly = msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  if (isToday) {
                      timeStr = timeOnly;
                  } else if (isYesterday) {
                      timeStr = `Yesterday ${timeOnly}`;
                  } else {
                      const dateOnly = msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
                      timeStr = `${dateOnly}, ${timeOnly}`;
                  }
              } else {
                  timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              }

              div.innerHTML = `
                  <div class="msg-header">
                      <strong class="msg-sender">${escapeHTML(senderName)}</strong>
                      <span class="msg-time">${timeStr}</span>
                  </div>
                  <div class="msg-body">${escapeHTML(textContent)}</div>
              `;
              box.appendChild(div);
          });

          // Update the unread badge element
          const badgeEl = document.getElementById('chat-unread-badge');
          if (badgeEl) {
              if (unreadCount > 0) {
                  badgeEl.innerText = unreadCount > 99 ? '99+' : unreadCount;
                  badgeEl.classList.remove('hidden');
              } else {
                  badgeEl.classList.add('hidden');
              }
          }

          box.scrollTop = box.scrollHeight;
      }, (error) => {
          console.error("Chat permission error:", error);
      });
}

// Send Message Function
async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    if (!input) return;

    const message = input.value.trim();
    if (!message) return;

    const user = currentUserData || auth.currentUser;
    if (!user) {
        alert("Please sign in to send messages.");
        return;
    }

    try {
        const displayName = user.displayName 
            || (user.email ? user.email.split('@')[0] : "User");

        input.value = "";
        
        // Hide emoji picker if open
        document.getElementById('emoji-picker')?.classList.add('hidden');

        await db.collection('chat_messages').add({
            uid: user.uid,
            username: displayName,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (err) {
        console.error("Failed to send message:", err);
        alert("Failed to send message: " + err.message);
    }
}

// Toggle Emoji Picker Popup
function toggleEmojiPicker() {
    const picker = document.getElementById('emoji-picker');
    if (picker) {
        picker.classList.toggle('hidden');
    }
}

// Escape HTML for XSS prevention
function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Initialize Emoji Click Listeners on DOM Load
window.addEventListener('DOMContentLoaded', () => {
    const emojiPicker = document.getElementById('emoji-picker');
    const chatInput = document.getElementById('chat-input');

    if (emojiPicker && chatInput) {
        emojiPicker.querySelectorAll('span').forEach(emoji => {
            emoji.addEventListener('click', () => {
                chatInput.value += emoji.innerText;
                chatInput.focus();
                emojiPicker.classList.add('hidden');
            });
        });
    }
});

// ==========================================
// 9. NAVIGATION, MODALS & LIVE CLOCK
// ==========================================
function showView(id) {
    document.querySelectorAll('.card-view').forEach(v => v.classList.add('hidden'));
    document.getElementById(id)?.classList.remove('hidden');
}

function openAccountModal() { document.getElementById('account-modal').classList.remove('hidden'); }
function closeAccountModal() { document.getElementById('account-modal').classList.add('hidden'); }

function toggleChatWindow() { 
    const chatWin = document.getElementById('chat-window');
    if (!chatWin) return;

    chatWin.classList.toggle('hidden');

    // Clear unread badge & update last read time when opening chat window
    if (!chatWin.classList.contains('hidden')) {
        localStorage.setItem('lastReadChatTime', new Date().toISOString());

        const badgeEl = document.getElementById('chat-unread-badge');
        if (badgeEl) {
            badgeEl.innerText = '0';
            badgeEl.classList.add('hidden');
        }
    }
}

function runLiveFooterClock() {
    const el = document.getElementById('live-footer-datetime');
    if (el) {
        setInterval(() => {
            const now = new Date();
            el.innerText = now.toLocaleDateString(currentLang === 'ar' ? 'ar-BH' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + " | " + now.toLocaleTimeString();
        }, 1000);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    runLiveFooterClock();
    applyLanguageTranslations();
});
