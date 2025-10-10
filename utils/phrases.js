const phrases = {
    // Key: English Phrase
    // Value: Object mapping Country Name to Translation

    "Hello": {
        "United States": "Hello",
        "India": "Namaste",
        "China": "Nǐ hǎo",
        "Japan": "Konnichiwa",
        "Germany": "Hallo",
        "France": "Bonjour",
        "Spain": "Hola",
        "Italy": "Ciao",
        "Brazil": "Olá",
        "Russia": "Privet",
        "Mexico": "Hola",
        "South Korea": "Annyeonghaseyo",
        "Turkey": "Merhaba",
        "Canada": "Hello", 
        "Australia": "G'day", 
        "Sweden": "Hallå", 
        "Netherlands": "Hallo",
        "Thailand": "Sawadee krap/ka", // M/F ending
        "Vietnam": "Xin chào",
        "South Africa": "Sawubona",
        "Poland": "Cześć",
        "Greece": "Yassas",
        "Portugal": "Olá",
        "UAE": "Marhaban",
        "Indonesia": "Halo",
        "Argentina": "Hola",
        "Colombia": "Hola",
        "Kenya": "Jambo",
        "Philippines": "Kumusta",
        "Fiji": "Bula", // NEW
        "Switzerland": "Grüezi", // NEW (Swiss German)
        "Tanzania": "Hujambo", // NEW (Swahili)
        "Maldives": "Assalaamu Alaikum", // NEW (Dhivehi/Formal)
        "Costa Rica": "Pura vida", // NEW (Common Greeting/Slogan)
        "UAE": "Marhaban"
    },

    "Thank you": {
        "United States": "Thank you",
        "India": "Dhanyawad",
        "China": "Xiè xie",
        "Japan": "Arigatō",
        "Germany": "Danke",
        "France": "Merci",
        "Spain": "Gracias",
        "Italy": "Grazie",
        "Brazil": "Obrigado/a", 
        "Russia": "Spasibo",
        "Mexico": "Gracias",
        "South Korea": "Gamsahamnida",
        "Turkey": "Teşekkür ederim",
        "Canada": "Thank you", 
        "Australia": "Thanks mate", 
        "Sweden": "Tack", 
        "Netherlands": "Dank je",
        "Thailand": "K̄hxbkhun",
        "Vietnam": "Cảm ơn",
        "South Africa": "Ngiyabonga",
        "Poland": "Dziękuję",
        "Greece": "Efharisto",
        "Portugal": "Obrigado/a",
        "UAE": "Shukran",
        "Indonesia": "Terima kasih",
        "Argentina": "Gracias",
        "Colombia": "Gracias",
        "Kenya": "Asante",
        "Philippines": "Salamat",
        "Fiji": "Vinaka", // NEW
        "Switzerland": "Danke", // NEW
        "Tanzania": "Asante", // NEW
        "Maldives": "Shukuriyaa", // NEW
        "Costa Rica": "Gracias", // NEW
        "UAE": "Shukran"	
    },

    "Excuse me": {
        "United States": "Excuse me",
        "India": "Kshama Karein",
        "China": "Bù hǎoyìsi",
        "Japan": "Sumimasen",
        "Germany": "Entschuldigung",
        "France": "Excusez-moi",
        "Spain": "Perdón",
        "Italy": "Mi scusi",
        "Brazil": "Com licença",
        "Russia": "Izvinite",
        "Mexico": "Disculpe",
        "South Korea": "Sillyehabnida",
        "Turkey": "Affedersiniz",
        "Canada": "Excuse me", 
        "Australia": "Excuse me",
        "Sweden": "Ursäkta", 
        "Netherlands": "Pardon",
        "Thailand": "Kho thot",
        "Vietnam": "Xin lỗi",
        "South Africa": "Xolela",
        "Poland": "Przepraszam",
        "Greece": "Siggnomi",
        "Portugal": "Com licença",
        "UAE": "Law samaḥt",
        "Indonesia": "Permisi",
        "Argentina": "Permiso",
        "Colombia": "Disculpe",
        "Kenya": "Samahani",
        "Philippines": "Pasensya na",
        "Fiji": "Tulou", // NEW
        "Switzerland": "Entschuldigung", // NEW
        "Tanzania": "Samahani", // NEW
        "Maldives": "Ma’aaf kurey", // NEW
        "Costa Rica": "Permiso", // NEW
        "UAE": "Law samaḥt"	
    },

    "Yes": {
        "United States": "Yes",
        "India": "Haan",
        "China": "Shì",
        "Japan": "Hai",
        "Germany": "Ja",
        "France": "Oui",
        "Spain": "Sí",
        "Italy": "Sì",
        "Brazil": "Sim",
        "Russia": "Da",
        "Mexico": "Sí",
        "South Korea": "Ne",
        "Turkey": "Evet",
        "Canada": "Yes", 
        "Australia": "Yeah",
        "Sweden": "Ja", 
        "Netherlands": "Ja",
        "Thailand": "Chai",
        "Vietnam": "Vâng",
        "South Africa": "Yebo",
        "Poland": "Tak",
        "Greece": "Nai",
        "Portugal": "Sim",
        "UAE": "Na'am",
        "Indonesia": "Ya",
        "Argentina": "Sí",
        "Colombia": "Sí",
        "Kenya": "Ndio",
        "Philippines": "Oo",
        "Fiji": "Io", // NEW
        "Switzerland": "Ja", // NEW
        "Tanzania": "Ndio", // NEW
        "Maldives": "Aan", // NEW
        "Costa Rica": "Sí",
        "UAE": "Na'am"	 // NEW
    },

    "No": {
        "United States": "No",
        "India": "Nahin",
        "China": "Bù",
        "Japan": "Iie",
        "Germany": "Nein",
        "France": "Non",
        "Spain": "No",
        "Italy": "No",
        "Brazil": "Não",
        "Russia": "Net",
        "Mexico": "No",
        "South Korea": "Aniyo",
        "Turkey": "Hayır",
        "Canada": "No", 
        "Australia": "Nah",
        "Sweden": "Nej", 
        "Netherlands": "Nee",
        "Thailand": "Mai",
        "Vietnam": "Không",
        "South Africa": "Cha",
        "Poland": "Nie",
        "Greece": "Ohi",
        "Portugal": "Não",
        "UAE": "Laa",
        "Indonesia": "Tidak",
        "Argentina": "No",
        "Colombia": "No",
        "Kenya": "Hapana",
        "Philippines": "Hindi",
        "Fiji": "Sega", // NEW
        "Switzerland": "Nein", // NEW
        "Tanzania": "Hapana", // NEW
        "Maldives": "Noon", // NEW
        "Costa Rica": "No" ,
        "UAE": "Laa"	// NEW
    }
};

module.exports = phrases;