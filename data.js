let state = {
  currentQuestionIndex: 0,
  questions: [
    {
      question: "Do you have items/furniture that must be shipped to your new home?",
      subtext: "Moovit will help you manage the logistics of long distance shipping!"
    },
    {
      question: "Are you flying to your destination?",
      subtext: "Moovit can show you what a reasonable ticket price looks like, and help you book your flight!",
      task: [ "Book a Flight" ]
    },
    {
      question: "Are you moving to a different country?",
      subtext: "Moovit can help prepare you for entry into a foreign country!",
      task: [ "Review International Travel Requirements" ]
    },
    {
      question: "Would you like to hire someone to move them for you?",
      subtext: "Moovit can help you along the way!",
      task: [ "Hire Movers" ]
    },
    {
      question: "Would you like to rent a vehicle to transport those items/furniture?",
      subtext: "Moovit can help you find the cheapest company for the job by balancing $/mile and rental fees!",
      task: [ "Rent a Moving Truck", "Plan your stops" ]
    },
    {
      question: "Would you like your personal vehicle shipped to your destination?",
      subtext: "If not, Moovit can show you what the shipping costs will look like, and help connect you with local businesses who can get the job done.",
      task: [ "Ship your Vehicle" ]
    },
    {
      question: "Would you like to rent a storage unit at your location or destination?",
      subtext: "Moovit can provide you with reasonable price estimates and leads for businesses in the area.",
      task: [ "Find a Storage Unit" ]
    },
    {
      question: "Would you like to rent housing at your destination?",
      subtext: "Moovit can provide you with rental estimates and good services available for 'apartment-hunting'!",
      task: [ "Find Rental Housing" ]
    },
    {
      question: "Would you like to purchase a home at your destination?",
      subtext: "Moovit can provide you with the average cost of housing in the area and good services available for 'house-hunting'!",
      task: [ "Find a Home to Purchase" ]
    },
    {
      question: "Would you like Moovit to text or email you reminders as you approach your moving deadlines?",
      subtext: "You may opt into phone or email reminders as we prepare for our journey to foreign lands! (May be disabled at any time)",
      task: [ "Setup Reminders" ]
    }
  ]
};