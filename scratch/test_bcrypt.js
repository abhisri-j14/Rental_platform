const bcrypt = require('bcryptjs');
(async () => {
  try {
    const hash = await bcrypt.hash('test1234', 10);
    console.log('Hash success:', hash);
  } catch (err) {
    console.error('Hash error:', err);
  }
})();
