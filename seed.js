const { db, User, Location, PictureAtLocation } = require("./server/db");

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

const links = [
  {
    imageUrl:
      "https://www.nomadicmatt.com/wp-content/uploads/2020/02/tajikistan_budget.jpg",
  },
  {
    imageUrl:
      "https://www.travelanddestinations.com/wp-content/uploads/2019/11/Fann-Mountains-Lake-Tajikistan.jpg",
  },
  {
    imageUrl:
      "https://www.worldatlas.com/r/w1200/upload/d5/2e/3f/shutterstock-1033815457.jpg",
  },
  {
    imageUrl:
      "https://www.travelanddestinations.com/wp-content/uploads/2019/11/Iskanderkul-in-the-Fann-Mountains-Tajikistan.jpg",
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
      }),

      links.map((link) => {
        return PictureAtLocation.create(link);
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

    const user1 = await User.findByPk(4);
    const location1 = await Location.findByPk("Tajikistan");

    await user1.addPictureAtLocation(await PictureAtLocation.findByPk(3)),
      await location1.addPictureAtLocation(await PictureAtLocation.findByPk(3));
  } catch (error) {
    console.error(error);
  }
};

// first run npm seed then change seed to seed2 and run it again... beforeCreate hook is causing the users not to load in time to create associations
// seed2()
//   .then(() => {
//     console.log("Seeding Success!");
//   })
//   .catch((err) => {
//     console.log("Could not Seed Data");
//     console.error(err);
//   });

module.exports = seed;
