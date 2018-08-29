let state = {
  currentQuestionIndex: 0,
  questions: [
    {
      question: "Do you have items/furniture that must be shipped to your new home?",
      subtext: "Planit will help you manage the logistics of long distance shipping!"
    },
    {
      question: "Would you like to rent a vehicle to transport those items/furniture?",
      subtext: "Planit can connect you with local, reputable businesses who can do the job.",
      task: [ "Rent a Moving Truck"]
    },
    {
      question: "Would you like to hire someone to move them for you?",
      subtext: "Planit can help you along the way!",
      task: [ "Hire Movers" ]
    },
    {
      question: "Are you flying to your destination?",
      subtext: "Planit can help you book your flight!",
      task: [ "Book a Flight" ]
    },
    {
      question: "Are you moving to a different country?",
      subtext: "Planit can help prepare you for entry into a foreign country.",
      task: [ "Review Travel Requirements" ]
    },
    {
      question: "Would you like your personal vehicle shipped to your destination?",
      subtext: "Planit can connect you with local, reputable businesses who can do the job.",
      task: [ "Ship your Vehicle" ]
    },
    {
      question: "Would you like to rent a storage unit before you move?",
      subtext: "Planit can connect you with local, reputable businesses.",
      task: [ "Find a Storage Unit" ]
    },
    {
      question: "Would you like to rent housing at your destination?",
      subtext: "Planit can connect you with the best available online services.",
      task: [ "Find Rental Housing" ]
    },
    {
      question: "Would you like to purchase a home at your destination?",
      subtext: "Planit can connect you with the best available online services.",
      task: [ "Find a Home to Purchase" ]
    },
    {
      question: "Would you like Planit to email you reminders as you approach your moving deadline?",
      subtext: "[Feature to be implemented] You may opt into email reminders as we prepare for your journey to foreign lands!",
      task: [ "Setup Email Reminders" ]
    }
  ]
};