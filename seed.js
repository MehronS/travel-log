const { db, User, Location } = require("./server/db");

const locations = [
  {
    name: "United States",
    createdAt: "2021-10-31 17:59:40.471-04",
    updatedAt: "2021-10-31 17:59:40.471-04",
  },
  {
    name: "Eritrea",
    createdAt: "2021-10-31 19:34:59.183-04",
    updatedAt: "2021-10-31 19:34:59.183-04",
  },

  {
    name: "Tajikistan",
    createdAt: "2021-10-31 19:34:59.183-04",
    updatedAt: "2021-10-31 19:34:59.183-04",
  },
];

const users = [
  {
    firstName: "Mehron",
    lastName: "Latifi",
    email: "mehrons@gmail.com",
    password: 1111,
    createdAt: "2021-10-31 16:00:54.502-04",
    updatedAt: "2021-10-31 16:00:54.502-04",
  },

  {
    firstName: "Nanish",
    lastName: "Saynieva",
    email: "nana_saynivea@yup.com",
    password: 1111,
    createdAt: "2021-10-31 16:00:54.502-04",
    updatedAt: "2021-10-31 16:00:54.502-04",
  },

  {
    firstName: "Mr.Nakka",
    lastName: "Latifi",
    email: "mrnakka@gmail.com",
    password: 1111,
    createdAt: "2021-10-31 16:00:54.502-04",
    updatedAt: "2021-10-31 16:00:54.502-04",
  },

  {
    firstName: "Mr.Mr.Nakka",
    lastName: "Latifi",
    email: "mrmrnakka@gmail.com",
    password: 1111,
    createdAt: "2021-10-31 16:00:54.502-04",
    updatedAt: "2021-10-31 16:00:54.502-04",
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

    const allUsers = await User.findAll();
    const allLocations = await Location.findAll();

    await Promise.all(
      allUsers.map((user) => {
        user.addLocation(allLocations);
      })
    );
  } catch (error) {
    console.error(error);
  }
};

seed()
  .then(() => {
    console.log("Seeding Success!");
  })
  .catch((err) => {
    console.log("Could not Seed Data");
    console.error(err);
    db.close();
  });

module.exports = seed;
