const path = require('path');
const { version } = require(path.join(__dirname, '..', 'package.json'));

let blessingCounter = 0;

const blessings = [
  {
    sindarin: 'Nai tiruvantel ar varyuvantel i Valar tielyanna',
    english: 'May the Valar protect you on your path',
    context: "Elrond's parting blessing — spoken at the gates of Rivendell to those departing on perilous quests"
  },
  {
    sindarin: 'Nai elen siluva lyenna',
    english: 'May a star shine upon you',
    context: 'A common Elvish blessing, invoking Elbereth Gilthoniel, Lady of Stars, whose light guides wanderers'
  },
  {
    sindarin: 'Cuio i Pheriain anann',
    english: 'May the Halflings live long',
    context: 'A blessing bestowed upon the Ring-bearers, Frodo and Samwise, after the destruction of the One Ring'
  },
  {
    sindarin: 'Nai aurelya nauva calima',
    english: 'May your day be bright',
    context: 'A gentle morning blessing exchanged among the Elves of Lothlórien, greeting the dawn in Caras Galadhon'
  },
  {
    sindarin: "Elen síla lúmenn' omentielvo",
    english: 'A star shines on the hour of our meeting',
    context: 'Spoken by Frodo to Gildor Inglorion — one of the oldest Elvish greetings, carrying the blessing of Elbereth'
  },
  {
    sindarin: 'Quel fara, mellon nín',
    english: 'Good hunting, my friend',
    context: 'A Sindarin farewell of blessing and fortune, often exchanged by the Wood-elves of Mirkwood before a journey'
  },
  {
    sindarin: 'Nai i hwindor nauvar vardar lye',
    english: 'May the breezes protect you',
    context: 'An old Rivendell blessing invoking the winds of the Misty Mountains as gentle guardians of travelers'
  },
  {
    sindarin: "Cormlle naa tanya tel'raa",
    english: 'Your heart is steadfast as stone',
    context: "Arwen's private blessing, whispered to Aragorn before the Grey Company departed for the Paths of the Dead"
  },
  {
    sindarin: "Lissenen ar' maska'lalaith tenna' lye omentuva",
    english: 'Sweet water and light laughter until we meet again',
    context: 'A Lothlórien farewell blessing from Galadriel, wishing peace and joy upon those she loved'
  },
  {
    sindarin: 'Nai Anar caluva tielyanna',
    english: 'May the Sun shine upon your path',
    context: "Spoken by Arwen Undómiel as she watched the Fellowship depart — her hope for Aragorn's safe return"
  },
  {
    sindarin: 'Ae ú-esteliach nad, estelio han',
    english: 'If you trust nothing else, trust this',
    context: "Arwen's vow to Aragorn at Rivendell — the blessing of her undying faith, stronger than the shadow"
  },
  {
    sindarin: 'Nai Valar nauvar as elye',
    english: 'May the Valar be with you',
    context: 'The oldest of Elvish blessings, invoking all the Powers of Arda to walk beside one on their road'
  }
];

function sendJson(res, payload) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(payload));
}

module.exports = (req, res) => {
  const route = Array.isArray(req.query.path) ? req.query.path.join('/') : String(req.query.path || '');

  if (req.method !== 'GET') {
    res.statusCode = 405;
    return sendJson(res, { success: false, error: 'Method not allowed' });
  }

  if (route === 'blessing') {
    const blessing = blessings[Math.floor(Math.random() * blessings.length)];
    blessingCounter += 1;
    return sendJson(res, {
      success: true,
      blessing,
      totalBlessings: blessingCounter
    });
  }

  if (route === 'counter') {
    return sendJson(res, {
      success: true,
      count: blessingCounter
    });
  }

  if (route === 'version') {
    return sendJson(res, {
      success: true,
      version,
      name: 'arwen-blessing',
      environment: process.env.NODE_ENV || 'development'
    });
  }

  res.statusCode = 404;
  return sendJson(res, { success: false, error: 'Not found' });
};