export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false });
  const { title, content } = req.body;
  // مؤقتا: نحفظ في localStorage من المتصفح. لاحقا نربطه بـ GitHub
  return res.status(200).json({ success: true, url: '#' });
}