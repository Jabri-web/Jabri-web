// config.js - معالج الحروف الكبيرة/الصغيرة
const CFG = {
  // هنا حط اسم ملف اللوجو زي ما هو في الريبو بالضبط
  logo: './Logo.png',  // عندك L كبير في الريبو
  
  // المسار الذكي يشتغل github.io و github.io/repo
  base: window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, ''),
  
  // دالة تروح للصفحة بدون ما تفرق كبير/صغير
  go: function(page){
    // نخلي كل الصفحات حروف صغيرة عشان GitHub
    const file = page.toLowerCase() + '.html';
    window.location.href = this.base + '/' + file;
  },
  
  // دالة القفل
  exit: function(){
    if(window.history.length > 1) window.history.back();
    else alert('اغلق الصفحة يدوياً');
  }
};