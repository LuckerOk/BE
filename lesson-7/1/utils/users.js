//{
//         "id": 0,
//         "name": {
//             "first": "Ron",
//             "last": "McLaughlin"
//         },
//         "phone": "615-247-4689",
//         "address": {
//             "zip": "99396-0178",
//             "city": "South Garfieldview",
//             "country": "Kuwait",
//             "street": "64984 Alanna Points"
//         },
//         "email": "annabell.hackett@hotmail.com"
//     },

//{
//     name: {
//         first: 'John',
//     },
//     email: '@gmail.com',
// }

const checkUser = (data, fields) => {
  return Object.entries(fields).every(([key, value]) => {
    const userData = data[key];

    if (typeof userData === 'object') {
      return checkUser(userData, value);
    }
console.log('userData: ', userData)
console.log('value: ', value)
console.log('res: ', userData.includes(value))
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
