import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './MapStyle.scss';


// react-leaflet
const Map = ({ latitude = 51.505, longitude = -0.09, zoom = 10 }) => {
    return (
        <div className="map-container"> {/* Apply the CSS class to ensure proper sizing */}
            <MapContainer
                // scrollWheelZoom={false}
                style={{ height: "200px", width: "100%" }}
                center={[latitude, longitude]}
                zoom={zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* <Marker position={[latitude, longitude]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker> */}
            </MapContainer>
        </div>
    );
};

export default Map;
