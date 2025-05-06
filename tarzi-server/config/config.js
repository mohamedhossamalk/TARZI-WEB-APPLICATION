const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options are no longer required in Mongoose 6+
      // but we include them for compatibility with older versions
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`تم الاتصال بقاعدة البيانات: ${conn.connection.host}`);
  } catch (err) {
    console.error(`خطأ: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;