const checkUser = (data, fields) => {
  return Object.entries(fields).every(([key, value]) => {
    const userData = data[key];

    if (typeof userData === 'object') {
      return checkUser(userData, value);
    }

    return userData.includes(value);
  })
};

const findUsers = (users, fields) => {
  return users.filter((user) => {
    return checkUser(user, fields);
  });
};

module.exports = {
  findUsers,
};
