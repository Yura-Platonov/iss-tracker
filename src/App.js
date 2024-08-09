import React, { useEffect, useState} from 'react';

const App = () => {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [crew, setCrew] = useState([]);
  const [time, setTime] = useState("");

  useEffect(() => {
    const fetchISSData = async () => {
        try {
          const locationResponse = await fetch('http://api.open-notify.org/iss-now.json');
          const locationData = await locationResponse.json();
          const newLocation = {
            lat: parseFloat(locationData.iss_position.latitude),
            lng: parseFloat(locationData.iss_position.longitude),
          };
          setLocation(newLocation);
        } catch (error) {
          console.error('Error fetching ISS location data:', error);
        }

        try {
          const crewResponse = await fetch('http://api.open-notify.org/astros.json');
          const crewData = await crewResponse.json();
          setCrew(crewData.people.filter(person => person.craft === 'ISS'));
        } catch (error) {
          console.error('Error fetching ISS crew data:', error);
        }

        const now = new Date();
        const hours = now.getUTCHours();
        const minutes = now.getUTCMinutes().toString().padStart(2, '0');
        const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
        const day = now.getUTCDate();
        const month = now.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
        const year = now.getUTCFullYear();

        const formattedTime = `${hours}:${minutes} ${dayOfWeek}, ${day} ${month} ${year}`;
        setTime(formattedTime);

    };

    fetchISSData();
    const intervalId = setInterval(fetchISSData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1>ISS Tracker</h1>
      <p>Latitude: {location.lat}</p>
      <p>Longitude: {location.lng}</p>
      <p>UTC Time: {time}</p>
      <h2>Crew on ISS</h2>
      <ul>
        {crew.map((member, index) => (
          <li key={index}>{member.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
