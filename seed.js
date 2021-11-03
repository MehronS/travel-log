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
seed2()
  .then(() => {
    console.log("Seeding Success!");
  })
  .catch((err) => {
    console.log("Could not Seed Data");
    console.error(err);
  });

module.exports = seed;

const dummyFromRoadGoat = {
  data: {
    id: "6588544",
    type: "destination",
    attributes: {
      slug: "new-york-ny-usa",
      destination_type: "City",
      short_name: "New York",
      name: "New York, NY",
      long_name: "New York, New York State, US",
      population: 8175133,
      latitude: 40.742185,
      longitude: -73.992602,
      bounding_box: null,
      geonames_id: 5128581,
      walk_score_url: "https://www.walkscore.com/NY/New_York",
      budget: {
        "New York, NY": {
          id: 8,
          text: "Extreme",
        },
        "New York (State)": {
          id: 7,
          text: "Very High",
        },
        "United States": {
          id: 6,
          text: "High",
        },
      },
      safety: {
        "New York, NY": {
          id: 4,
          text: "High",
          subtext: "Exercise Normal Precaution",
        },
        "United States": {
          id: 4,
          text: "High",
          subtext: "Exercise Normal Precaution",
        },
      },
      covid: {
        "New York City": {
          metric: 48.574933544965,
          url: "https://covidactnow.org/us/new_york-ny/county/bronx_county",
          text: "Critical",
        },
        "New York (State)": {
          metric: 42.4086880545932,
          url: "https://covidactnow.org/us/new_york-ny/",
          text: "Critical",
        },
        "United States": {
          metric: 20.0069563500323,
          url: "https://www.worldometers.info/coronavirus/",
          text: "High",
        },
      },
      average_rating: 4.55,
      check_in_count: 6762,
      open_elevation_url:
        "https://api.open-elevation.com/api/v1/lookup?locations=40.742185,-73.992602",
      foursquare_url:
        "https://api.foursquare.com/v2/venues/search?ll=40.742185,-73.992602&radius=100000",
      kayak_car_rental_url:
        "https://www.kayak.com/in?a=roadgoatdl&url=/cars/NewYork,NY/NewYork,NY/2021-03-16/2021-03-23/?sort=price_a",
      kayak_lodgings_url:
        "https://www.kayak.com/in?a=roadgoatdl&url=/hotels/NewYork,NY/2021-03-16/2021-03-23/1adults?sort=userrating_b",
      airbnb_url: "https://www.airbnb.com/s/New York, NY/homes",
      getyourguide_url:
        "https://getyourguide.com/s/?q=New+York%2C+NY&partner_id=0TQGVTE",
      url: "https://www.roadgoat.com/travel-guides/new-york-ny-usa",
    },
    relationships: {
      state: {
        data: {
          id: "2010537",
          type: "destination",
        },
      },
      country: {
        data: {
          id: "2008781",
          type: "destination",
        },
      },
      continent: {
        data: {
          id: "10935560",
          type: "destination",
        },
      },
      known_for: {
        data: [
          {
            id: "12",
            type: "known_for",
          },
          {
            id: "4",
            type: "known_for",
          },
          {
            id: "3",
            type: "known_for",
          },
          {
            id: "17",
            type: "known_for",
          },
          {
            id: "2",
            type: "known_for",
          },
          {
            id: "8",
            type: "known_for",
          },
          {
            id: "7",
            type: "known_for",
          },
          {
            id: "21",
            type: "known_for",
          },
          {
            id: "9",
            type: "known_for",
          },
          {
            id: "18",
            type: "known_for",
          },
          {
            id: "20",
            type: "known_for",
          },
          {
            id: "6",
            type: "known_for",
          },
        ],
      },
      photos: {
        data: [
          {
            id: "608",
            type: "photo",
          },
          {
            id: "585",
            type: "photo",
          },
          {
            id: "581",
            type: "photo",
          },
          {
            id: "579",
            type: "photo",
          },
          {
            id: "578",
            type: "photo",
          },
        ],
      },
      travelers: {
        data: [
          {
            id: "1716",
            type: "user",
          },
          {
            id: "532",
            type: "user",
          },
          {
            id: "573",
            type: "user",
          },
          {
            id: "1243",
            type: "user",
          },
          {
            id: "1959",
            type: "user",
          },
        ],
      },
      mentions: {
        data: [
          {
            id: "3",
            type: "mention",
          },
        ],
      },
    },
  },
  included: [
    {
      id: "10935560",
      type: "destination",
      attributes: {
        slug: "north-america",
        destination_type: "Continent",
        short_name: "North America",
        name: "North America",
        long_name: "North America",
        latitude: 42.13646,
        longitude: -100.8141,
        bounding_box: {
          sw_lon: -171.486609,
          sw_lat: 8.040134,
          ne_lon: -39.362977,
          ne_lat: 71.088537,
        },
        average_rating: 4.83333333333333,
        check_in_count: 12877,
      },
      relationships: {
        known_for: {
          data: [],
        },
        featured_photo: {
          data: {
            id: "2436",
            type: "photo",
          },
        },
      },
    },
    {
      id: "2436",
      type: "photo",
      attributes: {
        image: {
          full: "https://cdn.roadgoat.com/uploads/photo/image/2436/landscapes-1426130_1920.jpg",
          large:
            "https://cdn.roadgoat.com/uploads/photo/image/2436/large_landscapes-1426130_1920.jpg",
          medium:
            "https://cdn.roadgoat.com/uploads/photo/image/2436/medium_landscapes-1426130_1920.jpg",
          thumb:
            "https://cdn.roadgoat.com/uploads/photo/image/2436/thumb_landscapes-1426130_1920.jpg",
          avatar:
            "https://cdn.roadgoat.com/uploads/photo/image/2436/avatar_landscapes-1426130_1920.jpg",
        },
      },
    },
    {
      id: "12",
      type: "known_for",
      attributes: {
        slug: "charming",
        name: "Charming",
        icon: "https://cdn.roadgoat.com/images/shared/icons/known-for/charming",
      },
    },
    {
      id: "4",
      type: "known_for",
      attributes: {
        slug: "foodie",
        name: "Foodie",
        icon: "https://cdn.roadgoat.com/images/shared/icons/known-for/foodie",
      },
    },
    {
      id: "3",
      type: "known_for",
      attributes: {
        slug: "nightlife",
        name: "Nightlife",
        icon: "https://cdn.roadgoat.com/images/shared/icons/known-for/nightlife",
      },
    },
    {
      id: "17",
      type: "known_for",
      attributes: {
        slug: "architecture",
        name: "Architecture",
        icon: "https://cdn.roadgoat.com/images/shared/icons/known-for/architecture",
      },
    },
    {
      id: "2",
      type: "known_for",
      attributes: {
        slug: "history",
        name: "History",
        icon: "https://cdn.roadgoat.com/images/shared/icons/known-for/history",
      },
    },
    {
      id: "8",
      type: "known_for",
      attributes: {
        slug: "museums",
        name: "Museums",
        icon: "https://cdn.roadgoat.com/images/shared/icons/known-for/museums",
      },
    },
    {
      id: "7",
      type: "known_for",
      attributes: {
        slug: "performing-arts",
        name: "Performing Arts",
        icon: "https://cdn.roadgoat.com/images/shared/icons/known-for/performing-arts",
      },
    },
    {
      id: "21",
      type: "known_for",
      attributes: {
        slug: "music",
        name: "Music",
        icon: "https://cdn.roadgoat.com/images/shared/icons/known-for/music",
      },
    },
    {
      id: "9",
      type: "known_for",
      attributes: {
        slug: "posh",
        name: "Posh",
        icon: "https://cdn.roadgoat.com/images/shared/icons/known-for/posh",
      },
    },
    {
      id: "18",
      type: "known_for",
      attributes: {
        slug: "lgbt-friendly",
        name: "LGBT Scene",
        icon: "https://cdn.roadgoat.com/images/shared/icons/known-for/lgbt-friendly",
      },
    },
    {
      id: "20",
      type: "known_for",
      attributes: {
        slug: "diversity",
        name: "Diversity",
        icon: "https://cdn.roadgoat.com/images/shared/icons/known-for/diversity",
      },
    },
    {
      id: "6",
      type: "known_for",
      attributes: {
        slug: "shopping",
        name: "Shopping",
        icon: "https://cdn.roadgoat.com/images/shared/icons/known-for/shopping",
      },
    },
    {
      id: "2008781",
      type: "destination",
      attributes: {
        slug: "united-states",
        destination_type: "Country",
        short_name: "United States",
        name: "United States",
        long_name: "United States",
        latitude: 39.76,
        longitude: -98.5,
        bounding_box: {
          sw_lon: -124.733253,
          sw_lat: 24.544245,
          ne_lon: -66.954811,
          ne_lat: 49.388611,
        },
        average_rating: 4.23076923076923,
        check_in_count: 12498,
      },
      relationships: {
        known_for: {
          data: [],
        },
        featured_photo: {
          data: {
            id: "692",
            type: "photo",
          },
        },
      },
    },
    {
      id: "692",
      type: "photo",
      attributes: {
        image: {
          full: "https://cdn.roadgoat.com/uploads/photo/image/692/travel-guide-of-san-francisco-ca-usa-original.jpg",
          large:
            "https://cdn.roadgoat.com/uploads/photo/image/692/large_travel-guide-of-san-francisco-ca-usa-original.jpg",
          medium:
            "https://cdn.roadgoat.com/uploads/photo/image/692/medium_travel-guide-of-san-francisco-ca-usa-original.jpg",
          thumb:
            "https://cdn.roadgoat.com/uploads/photo/image/692/thumb_travel-guide-of-san-francisco-ca-usa-original.jpg",
          avatar:
            "https://cdn.roadgoat.com/uploads/photo/image/692/avatar_travel-guide-of-san-francisco-ca-usa-original.jpg",
        },
      },
    },
    {
      id: "3",
      type: "mention",
      attributes: {
        title: "52 Places to Go in 2019",
        excerpt: "A starter kit for escaping into the world",
        url: "https://www.roadgoat.com/blog/lists/52-places-to-go-in-2019",
        source_name: "New York Times",
        source_domain: "nytimes.com",
        source_logo:
          "https://cdn.roadgoat.com/uploads/mention_source/logo/1/avatar_new-york-times-logo.webp",
      },
      relationships: {},
    },
    {
      id: "608",
      type: "photo",
      attributes: {
        image: {
          full: "https://cdn.roadgoat.com/uploads/photo/image/608/travel-guide-of-new-york-ny-usa-original.jpg",
          large:
            "https://cdn.roadgoat.com/uploads/photo/image/608/large_travel-guide-of-new-york-ny-usa-original.jpg",
          medium:
            "https://cdn.roadgoat.com/uploads/photo/image/608/medium_travel-guide-of-new-york-ny-usa-original.jpg",
          thumb:
            "https://cdn.roadgoat.com/uploads/photo/image/608/thumb_travel-guide-of-new-york-ny-usa-original.jpg",
          avatar:
            "https://cdn.roadgoat.com/uploads/photo/image/608/avatar_travel-guide-of-new-york-ny-usa-original.jpg",
        },
      },
    },
    {
      id: "585",
      type: "photo",
      attributes: {
        image: {
          full: "https://cdn.roadgoat.com/uploads/photo/image/585/travel-guide-of-new-york-ny-usa-original.jpg",
          large:
            "https://cdn.roadgoat.com/uploads/photo/image/585/large_travel-guide-of-new-york-ny-usa-original.jpg",
          medium:
            "https://cdn.roadgoat.com/uploads/photo/image/585/medium_travel-guide-of-new-york-ny-usa-original.jpg",
          thumb:
            "https://cdn.roadgoat.com/uploads/photo/image/585/thumb_travel-guide-of-new-york-ny-usa-original.jpg",
          avatar:
            "https://cdn.roadgoat.com/uploads/photo/image/585/avatar_travel-guide-of-new-york-ny-usa-original.jpg",
        },
      },
    },
    {
      id: "581",
      type: "photo",
      attributes: {
        image: {
          full: "https://cdn.roadgoat.com/uploads/photo/image/581/travel-guide-of-new-york-ny-usa-original.jpg",
          large:
            "https://cdn.roadgoat.com/uploads/photo/image/581/large_travel-guide-of-new-york-ny-usa-original.jpg",
          medium:
            "https://cdn.roadgoat.com/uploads/photo/image/581/medium_travel-guide-of-new-york-ny-usa-original.jpg",
          thumb:
            "https://cdn.roadgoat.com/uploads/photo/image/581/thumb_travel-guide-of-new-york-ny-usa-original.jpg",
          avatar:
            "https://cdn.roadgoat.com/uploads/photo/image/581/avatar_travel-guide-of-new-york-ny-usa-original.jpg",
        },
      },
    },
    {
      id: "579",
      type: "photo",
      attributes: {
        image: {
          full: "https://cdn.roadgoat.com/uploads/photo/image/579/travel-guide-of-new-york-ny-usa-original.jpg",
          large:
            "https://cdn.roadgoat.com/uploads/photo/image/579/large_travel-guide-of-new-york-ny-usa-original.jpg",
          medium:
            "https://cdn.roadgoat.com/uploads/photo/image/579/medium_travel-guide-of-new-york-ny-usa-original.jpg",
          thumb:
            "https://cdn.roadgoat.com/uploads/photo/image/579/thumb_travel-guide-of-new-york-ny-usa-original.jpg",
          avatar:
            "https://cdn.roadgoat.com/uploads/photo/image/579/avatar_travel-guide-of-new-york-ny-usa-original.jpg",
        },
      },
    },
    {
      id: "578",
      type: "photo",
      attributes: {
        image: {
          full: "https://cdn.roadgoat.com/uploads/photo/image/578/travel-guide-of-new-york-ny-usa-original.jpg",
          large:
            "https://cdn.roadgoat.com/uploads/photo/image/578/large_travel-guide-of-new-york-ny-usa-original.jpg",
          medium:
            "https://cdn.roadgoat.com/uploads/photo/image/578/medium_travel-guide-of-new-york-ny-usa-original.jpg",
          thumb:
            "https://cdn.roadgoat.com/uploads/photo/image/578/thumb_travel-guide-of-new-york-ny-usa-original.jpg",
          avatar:
            "https://cdn.roadgoat.com/uploads/photo/image/578/avatar_travel-guide-of-new-york-ny-usa-original.jpg",
        },
      },
    },
    {
      id: "2010537",
      type: "destination",
      attributes: {
        slug: "new-york",
        destination_type: "State",
        short_name: "New York (State)",
        name: "New York (State)",
        long_name: "New York (State)",
        latitude: 43.00035,
        longitude: -75.4999,
        bounding_box: {
          sw_lon: -79.7625122070312,
          sw_lat: 40.4773979187012,
          ne_lon: -71.8527069091797,
          ne_lat: 45.0158615112305,
        },
        average_rating: 4.35714285714286,
        check_in_count: 8548,
      },
      relationships: {
        known_for: {
          data: [],
        },
        featured_photo: {
          data: {
            id: "2355",
            type: "photo",
          },
        },
      },
    },
    {
      id: "2355",
      type: "photo",
      attributes: {
        image: {
          full: "https://cdn.roadgoat.com/uploads/photo/image/2355/34485049333_5a836a9a39_o.jpg",
          large:
            "https://cdn.roadgoat.com/uploads/photo/image/2355/large_34485049333_5a836a9a39_o.jpg",
          medium:
            "https://cdn.roadgoat.com/uploads/photo/image/2355/medium_34485049333_5a836a9a39_o.jpg",
          thumb:
            "https://cdn.roadgoat.com/uploads/photo/image/2355/thumb_34485049333_5a836a9a39_o.jpg",
          avatar:
            "https://cdn.roadgoat.com/uploads/photo/image/2355/avatar_34485049333_5a836a9a39_o.jpg",
        },
      },
    },
    {
      id: "1716",
      type: "user",
      attributes: {
        name: "Joe Avino",
        url: "https://www.roadgoat.com/travelers/joe-avino",
        avatar_url:
          "https://cdn.roadgoat.com/uploads/user/avatar/1716/avatar_unnamed.jpg",
      },
    },
    {
      id: "532",
      type: "user",
      attributes: {
        name: "Peter Gerard",
        url: "https://www.roadgoat.com/travelers/peter-gerard",
        avatar_url:
          "https://cdn.roadgoat.com/uploads/user/avatar/532/avatar_profilepic.jpeg",
      },
    },
    {
      id: "573",
      type: "user",
      attributes: {
        name: "Michael Marranzini",
        url: "https://www.roadgoat.com/travelers/michael-marranzini",
        avatar_url: null,
      },
    },
    {
      id: "1243",
      type: "user",
      attributes: {
        name: "Michael Williams",
        url: "https://www.roadgoat.com/travelers/michael-williams",
        avatar_url: null,
      },
    },
    {
      id: "1959",
      type: "user",
      attributes: {
        name: "Peter St.Wecker",
        url: "https://www.roadgoat.com/travelers/peter-st-wecker",
        avatar_url:
          "https://cdn.roadgoat.com/uploads/user/avatar/1959/avatar_profilepic.jpeg",
      },
    },
  ],
};
