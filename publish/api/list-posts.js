export default async function handler(req, res) {
  // مؤقتا: يرجع فاضي. لاحقا نقرأ من GitHub
  return res.status(200).json({ success: true, files: [] });
}