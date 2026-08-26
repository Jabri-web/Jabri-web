// /publish/api/publish.js - Vercel Serverless Function
// يحفظ المنشورات في مستودع GitHub تحت مجلد /publish/posts/

export default async function handler(req, res) {
  // 1. السماح فقط بـ POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'الطريقة غير مسموحة' });
  }

  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'العنوان والمحتوى مطلوبان' });
  }

  // 2. إنشاء اسم ملف فريد
  const now = new Date();
  const date = now.toISOString().split('T')[0]; // 2025-11-09
  const time = now.toTimeString().slice(0, 8).replace(/:/g, '-'); // 14-30-45
  const safeTitle = title.replace(/[^a-zA-Z0-9\u0600-\u06FF ]/g, '').replace(/ /g, '-');
  const filename = `${date}_${time}_${safeTitle || 'منشور'}.txt`;

  // 3. محتوى الملف
  const fileContent = `العنوان: ${title}
التاريخ: ${date} - ${now.toLocaleTimeString('ar-EG')}
#عبدالله_الجبري (صنعاء-اليمن)
#فلسطين_عربية

${content}

---
نُشر عبر واحة الجبري | https://jabri-com.vercel.app
`;

  // 4. إعداد GitHub API
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = 'jabri-ai'; // ⚠️ غيّر إلى اسم مستخدمك
  const REPO_NAME = 'jabri-com';  // ⚠️ غيّر إلى اسم مستودعك
  const FILE_PATH = `publish/posts/${filename}`;
  const COMMIT_MESSAGE = `📝 نشر منشور جديد: ${title}`;

  try {
    // 5. التحقق من وجود الملف (للتعديل لاحقاً)
    let sha = null;
    try {
      const checkRes = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
        { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
      );
      if (checkRes.ok) {
        const data = await checkRes.json();
        sha = data.sha;
      }
    } catch (e) { /* الملف غير موجود */ }

    // 6. رفع الملف إلى GitHub
    const githubPayload = {
      message: COMMIT_MESSAGE,
      content: Buffer.from(fileContent, 'utf-8').toString('base64'),
      branch: 'main'
    };
    if (sha) githubPayload.sha = sha;

    const githubRes = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(githubPayload),
      }
    );

    if (!githubRes.ok) {
      const errorData = await githubRes.json();
      throw new Error(`GitHub API: ${errorData.message || githubRes.status}`);
    }

    // 7. الرد بنجاح
    res.status(200).json({
      success: true,
      file: filename,
      url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/main/${FILE_PATH}`,
      message: 'تم نشر المنشور وحفظه في الواحة!'
    });

  } catch (error) {
    console.error('❌ خطأ النشر:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'حدث خطأ أثناء النشر'
    });
  }
}


document.getElementById('previewBtn').onclick = function() {
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const previewArea = document.getElementById('previewArea');
  
  if (!title && !content) {
    previewArea.innerHTML = '⚠️ اكتب عنواناً أو نصاً أولاً.';
    previewArea.style.display = 'block';
    return;
  }
  
  previewArea.innerHTML = `
        <h3>📄 معاينة المنشور</h3>
        <h4>${title || 'بدون عنوان'}</h4>
        <p>${content || '...'}</p>
        <hr>
        <small>#عبدالله_الجبري (صنعاء-اليمن)</small>
    `;
  previewArea.style.display = 'block';
};



document.getElementById('listBtn').addEventListener('click', async () => {
  try {
    const res = await fetch('/api/list-posts');
    const data = await res.json();
    if (data.success) {
      const posts = data.files.map(f => f.replace('.txt', '')).join('\n• ');
      setStatus(`📂 المنشورات المحفوظة:\n• ${posts}`, 'success');
    } else {
      setStatus('❌ لا توجد منشورات محفوظة.', 'error');
    }
  } catch (err) {
    setStatus('❌ فشل جلب القائمة.', 'error');
  }
});