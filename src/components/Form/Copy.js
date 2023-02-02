const questionsData = {
    "1": {
        "title": "What is your current site speed (seconds)?",
        "type": "Float"
    },
    "2": {
        "title": "What is your monthly average sessions?",
        "type": "Integer"
    },
    "3": {
        "title": "Average order value ($)?",
        "type": "Float"
    },
    "4": {
        "title": "Estimated Conversion Rate (%)",
        "type": "Float"
    },
    "5": {
        "title": "New target site speed (seconds)",
        "type": "Float"
    },
    "6": {
        "title": "What is your industry?",
        "type": "Dropdown",
        "dropdownOptions": [
            {
                "option": "Arts and Crafts"
            },
            {
                "option": "Electrical and Commercial Equipment"
            },
            {
                "option": "Pet Care"
            },
            {
                "option": "Health and Wellbeing"
            },
            {
                "option": "Kitchen and Home Appliances"
            },
            {
                "option": "Home Accessories and Giftware"
            },
            {
                "option": "Cars and Motorcycling"
            },
            {
                "option": "Fashion, Clothing, and Accessories"
            },
            {
                "option": "Sports and Recreation"
            }
        ]
    }
};



export default { 
    questionsData
}