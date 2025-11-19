require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

async function createAdmin() {
  try {
    console.log('\n🔐 Admin User Creation Script\n');
    
    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password: ');
    
    if (!name || !email || !password) {
      console.error('❌ All fields are required!');
      process.exit(1);
    }

    console.log('\n📡 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('⚠️  User with this email already exists!');
      const update = await question('Update to admin role? (yes/no): ');
      
      if (update.toLowerCase() === 'yes' || update.toLowerCase() === 'y') {
        existingUser.role = 'admin';
        existingUser.name = name;
        
        // Update password if provided
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          existingUser.password = hashedPassword;
        }
        
        await existingUser.save();
        console.log('\n✅ User updated to admin successfully!');
      } else {
        console.log('\n❌ Operation cancelled.');
      }
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const adminUser = new User({
        name,
        email,
        password: hashedPassword,
        role: 'admin',
      });

      await adminUser.save();
      console.log('\n✅ Admin user created successfully!');
    }

    console.log('\n📝 Admin Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n⚠️  Please store these credentials securely!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  }
}

createAdmin();
