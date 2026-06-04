// file=Config.js
const CFG = {
  logo: './Logo.png',
  base: window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, ''),
  
  // اتجاه الزر: row = انجليزي يسار، row-reverse = عربي يسار
  btnDirection: 'row-reverse', // ← هنا تتحكم بالمقلوب
  
  PAGES: {
    'sindbad': {file: 'Sindbad.html', ar: 'سندباد اليمن', en: 'Yemen Sindbad'},
    'yemen-sindbad': {file: 'Yemen-Sindbad.html', ar: 'سندباد اليمن', en: 'Yemen Sindbad'},
    'yemen-bird': {file: 'Yemen-bird.html', ar: 'طائر اليمن', en: 'Yemen Bird'},
    'yemen-ankboot': {file: 'Yemen-Ankboot.html', ar: 'عنكبوت اليمن', en: 'Yemen Ankboot'},
    'pages-researches': {file: 'Pages-Researches.html', ar: 'البحوث', en: 'Pages A2 Researches3'},
    'yemen-library': {file: 'Yemen-library.html', ar: 'مكتبتي', en: 'My Library'}
  },
  
  go: function(key){
    const page = this.PAGES[key.toLowerCase()];
    if(page){
      window.location.href = this.base + '/' + page.file;
    } else {
      alert('الصفحة غير موجودة: ' + key);
    }
  },
  
  exit: function(){
    if(window.history.length > 1) window.history.back();
    else alert('اغلق الصفحة يدوياً');
  }
};
