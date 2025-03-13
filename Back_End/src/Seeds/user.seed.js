const {config} = require('dotenv');
const User = require('../models/User');
const {connectDB} = require('../lib/db');

config();

const seedUsers = [
  // Female Users
  {
    Email: "emma.thompson@example.com",
    FullName: "Emma Thompson",
    Password: "123456",
    ProfilePic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    Email: "olivia.miller@example.com",
    FullName: "Olivia Miller",
    Password: "123456",
    ProfilePic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    Email: "sophia.davis@example.com",
    FullName: "Sophia Davis",
    Password: "123456",
    ProfilePic: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    Email: "ava.wilson@example.com",
    FullName: "Ava Wilson",
    Password: "123456",
    ProfilePic: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    Email: "isabella.brown@example.com",
    FullName: "Isabella Brown",
    Password: "123456",
    ProfilePic: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    Email: "mia.johnson@example.com",
    FullName: "Mia Johnson",
    Password: "123456",
    ProfilePic: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    Email: "charlotte.williams@example.com",
    FullName: "Charlotte Williams",
    Password: "123456",
    ProfilePic: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    Email: "amelia.garcia@example.com",
    FullName: "Amelia Garcia",
    Password: "123456",
    ProfilePic: "https://randomuser.me/api/portraits/women/8.jpg",
  },

  // Male Users
  {
    Email: "james.anderson@example.com",
    FullName: "James Anderson",
    Password: "123456",
    ProfilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    Email: "william.clark@example.com",
    FullName: "William Clark",
    Password: "123456",
    ProfilePic: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    Email: "benjamin.taylor@example.com",
    FullName: "Benjamin Taylor",
    Password: "123456",
    ProfilePic: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    Email: "lucas.moore@example.com",
    FullName: "Lucas Moore",
    Password: "123456",
    ProfilePic: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    Email: "henry.jackson@example.com",
    FullName: "Henry Jackson",
    Password: "123456",
    ProfilePic: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    Email: "alexander.martin@example.com",
    FullName: "Alexander Martin",
    Password: "123456",
    ProfilePic: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    Email: "daniel.rodriguez@example.com",
    FullName: "Daniel Rodriguez",
    Password: "123456",
    ProfilePic: "https://randomuser.me/api/portraits/men/7.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();