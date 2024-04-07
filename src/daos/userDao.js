const {createClient} = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const findUserByEmail = async (email) => {
  const {data, error} = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (!data) {
    return data;
  }
  if (error) {
    throw new Error(error.details);
  }

  return data;
};

const findUserByVerificationToken = async (token) => {
  const {data, error} = await supabase
    .from('users')
    .select('*')
    .eq('token', token)
    .single();

  if (!data) {
    return data;
  }
  if (error) {
    throw new Error(error.details);
  }

  return data;
};

const createUser = async (name, email, password, token) => {
  const {data, error} = await supabase
    .from('users')
    .insert([{name, email, password, token, verified: false, createTime: new Date()}])
    .single();

  if (!data) {
    return data;
  }
  if (error) {
    throw new Error(error.details);
  }

  return data;
};

const createGoogleUser = async (googleId, name, email, token) => {
  const {data, error} = await supabase
    .from('users')
    .insert([{googleId, name, email, token, verified: true, createTime: new Date()}])
    .single();

  if (!data) {
    return data;
  }
  if (error) {
    throw new Error(error.details);
  }

  return data;
};

const login = async (userId) => {
  const {data, error} = await supabase
    .from('user_log')
    .insert([{userId, loginTime: new Date()}])
    .single();

  if (!data) {
    return data;
  }
  if (error) {
    throw new Error(error.details);
  }

  return data;
};

const save = async (user) => {
  const {id, name, password, token, verified} = user;
  const {data, error} = await supabase
    .from('users')
    .update({name, password, token, verified})
    .match({id});

  if (!data) {
    return data;
  }
  if (error) {
    throw new Error(error.details);
  }

  return data;
};

const updateUsername = async (email, name) => {
  const {data, error} = await supabase
    .from('users')
    .update({name})
    .match({email});

  if (!data) {
    return data;
  }
  if (error) {
    throw new Error(error.details);
  }

  return data;
};

const verifyToken = async (token) => {
  const {data, error} = await supabase
    .from('users')
    .update({verified: true})
    .match({token});

  if (!data) {
    return data;
  }
  if (error) {
    throw new Error(error.details);
  }

  return data;
};

const resetPassword = async (email, password) => {
  const {data, error} = await supabase
    .from('users')
    .update({password})
    .match({email});

  if (!data) {
    return data;
  }
  if (error) {
    throw new Error(error.details);
  }

  return data;
};


const getAllUsersWithLoginDetail = async () => {
  const {data, error} = await supabase
    .rpc('get_all_users_with_login_detail');

  if (error) {
    console.error('Error:', error);
    return;
  }

  return data;
};


const getAllUserCount = async () => {
  const {data, error} = await supabase
    .from('users')
    .select('id', {count: 'exact'});

  if (!data) {
    return data;
  }
  if (error) {
    throw new Error(error.details);
  }

  return data.length;
};


const getActiveSessionNumberToday = async () => {
  const {data, error} = await supabase.rpc('get_active_session_number_today');

  if (error) {
    console.error('Error fetching active session number:', error.message);
    return null;
  }

  return data;
}


const getAvgNumActiveSevenDaysRolling = async () => {
  const {data, error} = await supabase
    .rpc('get_avg_num_active_seven_days_rolling');

  if (error) {
    console.error('Error:', error);
    return;
  }

  return data;
};

module.exports = {
  findUserByEmail,
  findUserByVerificationToken,
  createUser,
  createGoogleUser,
  login,
  save,
  updateUsername,
  verifyToken,
  resetPassword,
  getAllUsersWithLoginDetail,
  getAllUserCount,
  getActiveSessionNumberToday,
  getAvgNumActiveSevenDaysRolling,
};
