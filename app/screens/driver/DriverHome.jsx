import { LocationContext } from '@/app/context/LocationContext';
import { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import WebSocketTest from '../../component/webSocketTest';

export default function DriverHome() {

  const [originCoord, setOriginCoord] = useState({});
  const [destCoord, setDestCoord] = useState({});
  const [polyline, setPolyline] = useState([]);

  const { location, refresh } = useContext(LocationContext);

  return (
    <>
      <MapView
        style={StyleSheet.absoluteFill}
        followsUserLocation={true}
        showsUserLocation={true}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        region={{
          latitude: originCoord.lat || location.latitude ,
          longitude: originCoord.lng || location.longitude ,
          latitudeDelta: destCoord.lat || 0.05,
          longitudeDelta: destCoord.lng || 0.05,
        }}
      >
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title="Origin" />
          <Marker coordinate={{ latitude: destCoord.lat || 0.05, longitude: destCoord.lng || 0.05 }} title="Destination" />
          {polyline.length > 0 && <Polyline coordinates={polyline} strokeWidth={5} strokeColor="blue" />}
        </MapView>

      <WebSocketTest></WebSocketTest>
    </>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, justifyContent:'center', alignItems:'center' },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  }
});
