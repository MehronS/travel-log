const { db, User, Location } = require("./server/db");

const locations = [
  {
    name: "United States",
  },
  {
    name: "Eritrea",
  },

  {
    name: "Tajikistan",
  },
];

const users = [
  {
    firstName: "Mehron",
    lastName: "Latifi",
    email: "mehrons@gmail.com",
    password: "1111",
  },

  {
    firstName: "Nanish",
    lastName: "Saynieva",
    email: "nana_saynivea@yup.com",
    password: "1111",
  },

  {
    firstName: "Mr.Nakka",
    lastName: "Latifi",
    email: "mrnakka@gmail.com",
    password: "1111",
  },

  {
    firstName: "Mr.Mr.Nakka",
    lastName: "Latifi",
    email: "mrmrnakka@gmail.com",
    password: "1111",
  },
];

const seed = async () => {
  try {
    await db.sync({ force: true });

    await Promise.all(
      locations.map((location) => {
        return Location.create(location);
      }),

      users.map((user) => {
        return User.create(user);
      })
    );
  } catch (error) {
    console.error(error);
  }
};

const seed2 = async () => {
  try {
    const allUsers = await User.findAll();
    const allLocations = await Location.findAll();
    console.log(allUsers);

    await Promise.all(
      allUsers.map((user) => {
        user.addLocations(allLocations);
      })
    );
  } catch (error) {
    console.error(error);
  }
};

// first run npm seed then change seed to seed2 and run it again... beforeCreate hook is causing the users not to load in time to create associations
seed()
  .then(() => {
    console.log("Seeding Success!");
  })
  .catch((err) => {
    console.log("Could not Seed Data");
    console.error(err);
  });

module.exports = seed;
