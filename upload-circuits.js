// Quick script om circuits data te uploaden
const circuits = [
  {
    name: "Circuit Zandvoort",
    location: "Zandvoort", 
    country: "Netherlands",
    length_in_meters: 4259.0,
    number_of_corners: 14,
    fastest_lap_time: 72.341,
    fastest_lap_driver: "Max Verstappen",
    description: "Historisch F1 circuit langs de Nederlandse kust",
    image_url: "https://example.com/zandvoort.jpg"
  },
  {
    name: "TT Circuit Assen",
    location: "Assen",
    country: "Netherlands", 
    length_in_meters: 4555.0,
    number_of_corners: 18,
    fastest_lap_time: 65.234,
    fastest_lap_driver: "Michele Pirro",
    description: "Beroemde motorrace circuit in Drenthe",
    image_url: "https://example.com/assen.jpg"
  },
  {
    name: "Circuit Park Zolder",
    location: "Heusden-Zolder",
    country: "Belgium",
    length_in_meters: 4004.0,
    number_of_corners: 13,
    fastest_lap_time: 68.912,
    fastest_lap_driver: "Lewis Hamilton", 
    description: "Belgisch circuit met technische uitdagingen",
    image_url: "https://example.com/zolder.jpg"
  }
];

// Upload naar Supabase
circuits.forEach(async (circuit) => {
  const response = await fetch('https://lyreegaeymsldxlbpfpi.supabase.co/rest/v1/circuits', {
    method: 'POST',
    headers: {
      'apikey': 'sb_publishable_eN3GWDS4BoGIiqThU3BHfg_ZQlBRdio',
      'Authorization': 'Bearer sb_publishable_eN3GWDS4BoGIiqThU3BHfg_ZQlBRdio',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(circuit)
  });
  
  const result = await response.json();
  console.log('Circuit uploaded:', result);
});

console.log('Upload complete! Refresh de circuits pagina.');
