const { Pool } = require('pg');

// Initialize PostgreSQL client
const pool = new Pool({
  connectionString: 'postgresql://postgres:[YOUR-PASSWORD]@db.jrkzebosziywyfolevmu.supabase.co:5432/postgres'
});

async function setupDatabase() {
  console.log('Setting up Sliich database tables...');

  try {
    // Create all tables in sequence
    const sql = `
      -- 1. Profiles table
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID REFERENCES auth.users(id) PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        full_name TEXT,
        avatar_url TEXT,
        bio TEXT,
        website TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
      );

      -- 2. Messages table
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        recipient_id UUID REFERENCES profiles(id) NOT NULL,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        is_answered BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
      );

      -- 3. Polls table
      CREATE TABLE IF NOT EXISTS polls (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES profiles(id) NOT NULL,
        question TEXT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
        expires_at TIMESTAMP WITH TIME ZONE
      );

      -- 4. Poll options table
      CREATE TABLE IF NOT EXISTS poll_options (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
        option_text TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
      );

      -- 5. Poll responses table
      CREATE TABLE IF NOT EXISTS poll_responses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
        option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE NOT NULL,
        respondent_id UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
        UNIQUE(poll_id, respondent_id)
      );

      -- 6. User settings table
      CREATE TABLE IF NOT EXISTS user_settings (
        user_id UUID REFERENCES profiles(id) PRIMARY KEY,
        theme TEXT DEFAULT 'light',
        allow_anonymous_messages BOOLEAN DEFAULT TRUE,
        notification_email BOOLEAN DEFAULT TRUE,
        notification_push BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
      );
    `;

    // Execute SQL
    await pool.query(sql);
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error.message);
    console.log('Please create the tables manually in the Supabase dashboard using the SQL provided below:');
    console.log('\nSQL for manual table creation:');
    console.log(sql);
  } finally {
    await pool.end();
  }
}

// Run the setup
setupDatabase();