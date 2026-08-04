// chat-attachments.js
// Handles reading and formatting file/image attachments for the chat group

/**
 * Converts a selected file into Base64 so it can be stored in Firestore.
 * Restricts files over 500 KB to keep Firestore lightweight.
 * @param {HTMLInputElement} fileInput 
 * @returns {Promise<{name: string, type: string, data: string}|null>}
 */
async function processChatAttachment(fileInput) {
    const file = fileInput.files[0];
    if (!file) return null;

    // Check size limit (500 KB limit for inline chat Base64)
    const MAX_SIZE_BYTES = 500 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
        alert("Attachment is too large! Please choose a file smaller than 500 KB.");
        fileInput.value = ""; // Clear input
        return null;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve({
                name: file.name,
                type: file.type.startsWith('image/') ? 'image' : 'file',
                data: e.target.result // Base64 string
            });
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
}

/**
 * Generates the HTML snippet to display an image or file attachment inside a message bubble.
 * @param {Object} attachment - { name, type, data }
 * @returns {string} HTML string
 */
function renderAttachmentHTML(attachment) {
    if (!attachment || !attachment.data) return '';

    if (attachment.type === 'image') {
        return `
            <div class="chat-attachment-image" style="margin-top: 6px;">
                <a href="${attachment.data}" target="_blank" title="Click to view full image">
                    <img src="${attachment.data}" alt="${escapeHTML(attachment.name)}" 
                         style="max-width: 200px; max-height: 150px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(0,0,0,0.1);" />
                </a>
            </div>
        `;
    } else {
        return `
            <div class="chat-attachment-file" style="margin-top: 6px; padding: 6px 10px; background: rgba(0,0,0,0.05); border-radius: 6px; display: inline-block;">
                <a href="${attachment.data}" download="${escapeHTML(attachment.name)}" style="text-decoration: none; font-size: 0.85rem;">
                    📎 <strong>${escapeHTML(attachment.name)}</strong>
                </a>
            </div>
        `;
    }
}
