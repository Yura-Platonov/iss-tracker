import React, { useEffect, useState, useRef } from 'react';

const App = () => {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [crew, setCrew] = useState([]);
  const [time, setTime] = useState("");
  const mapRef = useRef(null);
  const markerRef = useRef(null);

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

          if (mapRef.current && markerRef.current) {
            markerRef.current.setPosition(newLocation);
            mapRef.current.setCenter(newLocation);
          } else {
            const map = new google.maps.Map(document.getElementById('map'), {
              zoom: 4,
              center: newLocation,
            });
            mapRef.current = map;
  
            const marker = new google.maps.Marker({
              position: newLocation,
              map,
              title: 'ISS Current Location',
            });
            markerRef.current = marker;
          }
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
      <div id="map" style={{ height: '400px', width: '800px', marginTop: '20px' }}></div>
    </div>
  );
};

export default App;
