import { commonStyles } from "@/scripts/constants";
import { Ionicons } from "@expo/vector-icons";
import polylineTool from "@mapbox/polyline";
import { useRoute } from "@react-navigation/native";
import { lineString, point } from "@turf/helpers";
import length from "@turf/length";
import lineSlice from "@turf/line-slice";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import React, { useContext, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import MapView, { AnimatedRegion, Marker, Polyline } from "react-native-maps";
import { RenderHTML } from "react-native-render-html";
import { getBearing, getTurnIcon } from "../../scripts/GeoUtil";
import LocationContext from "../context/LocationContext";

const AnimatedMarker = Animated.createAnimatedComponent(Marker);

export default function CarNavigation() {
  const { width } = useWindowDimensions();
  const { location } = useContext(LocationContext);

  const [bearing, setBearing] = useState(0);
  const route = useRoute();
  const { steps, localPolyline } = route.params;
  const [step, setStep] = useState({});
  const [spoints, setSpoints] = useState([]);
  const mapRef = useRef(null);

  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const [stepPoints, setStepPoints] = useState([]);
  const [polyline, setPolyline] = useState([]);
  const [allSteps, setAllSteps] = useState([]);
  const cancelRef = useRef(true);
  const prevLocationRef = useRef(null);
  // const [carpoint, setCarpoint] = useState([]);

  // Start the navigation
  React.useEffect(() => {
    // prepareAllPoints(steps);
    console.log("location changed: ", location);
    if (!cancelRef.current) {
      startNavigation1();
    }
  }, [location]);

  const initialRegion = useMemo(
    () => ({
      latitude: location.lat,
      longitude: location.lng,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    }),
    [location.lat, location.lng]
  );

  const preparePoints = () => {
    const locaSteps = [];
    const coords = [];
    const tempPolyline = [];
    localPolyline?.forEach((poly) => {
      tempPolyline.push([poly.longitude, poly.latitude]);
    });
    setPolyline(tempPolyline);
    console.log("steps: ", steps.length);
    for (let i = 0; i < steps.length; i++) {
      const nextStep = steps[i];
      locaSteps.push(nextStep);

      const spoint = polylineTool.decode(nextStep.polyline?.points);
      spoint.forEach(([lat, lng]) =>
        coords.push({ latitude: lat, longitude: lng })
      );
    }
    setAllSteps(locaSteps);
    setStepPoints(coords);
  };

  function distanceAlongToStep(user, step, polyline1) {
    try {
      const line = lineString(polyline);
      const userPoint = point([user.lng, user.lat]);
      const stepPoint = point([step.end_location.lng, step.end_location.lat]);

      // snapped point
      // console.log("userPoint: ", userPoint);
      const snapped = nearestPointOnLine(line, userPoint);

      // slice polyline between snapped point and maneuver point
      const sliced = lineSlice(snapped, stepPoint, line);

      return length(sliced, { units: "kilometers" }) * 1000;
    } catch (error) {
      console.log("Error in distanceAlongToStep", error.message);
    }
  }

  // const startNavigation = async () => {
  //   // cancelled = true;
  //   // console.log("index: ", index, steps.length);

  //   try {
  //     for (let i = 0; i < steps.length; i++) {
  //       console.log("index: ", i);

  //       const nextStep = steps[i];
  //       setStep(nextStep);

  //       const spoint = polylineTool.decode(nextStep.polyline?.points);
  //       const coords = [];
  //       spoint.forEach(([lat, lng]) =>
  //         coords.push({ latitude: lat, longitude: lng })
  //       );
  //       setSpoints(coords);

  //       const bearing = getBearing(
  //         nextStep.start_location,
  //         nextStep.end_location
  //       );
  //       // console.log("bearing: ", bearing);
  //       for (let j = 1; j < coords.length; j++) {
  //         const coordinate = coords[j];

  //         console.log("coordinate: ", location);
  //         mapRef.current?.animateCamera(
  //           {
  //             center: {
  //               latitude: coordinate?.latitude,
  //               longitude: coordinate?.longitude,
  //             },
  //             zoom: 20.5,
  //             pitch: 60,
  //             heading: bearing,
  //           },
  //           { duration: 1200 }
  //         );
  //         onLocationUpdate(coords[j - 1], coords[j]);
  //         await new Promise((res, rej) =>
  //           cancelRef.current
  //             ? rej(new Error("Promise cancelled"))
  //             : setTimeout(res, 800)
  //         );
  //       }
  //       await new Promise((res, rej) =>
  //         cancelRef.current
  //           ? rej(new Error("Promise cancelled"))
  //           : setTimeout(res, 10000)
  //       );
  //     }
  //   } catch (e) {
  //     console.log("Navigation cancelled: ", e);
  //   }

  //   // setIndex(index + 1);
  // };

  const startNavigation1 = async () => {
    try {
      const nextStep = steps[indexRef.current];
      if (!nextStep) return;

      const dist = distanceAlongToStep(location, nextStep, localPolyline);

      console.log("Distance : ", dist);
      animateCarForLocation();
      setStep(nextStep);
      if (dist < 10 && indexRef.current < steps.length - 1) {
        indexRef.current += 1;
        setIndex(indexRef.current);
        return;
      }

      if (dist < 200 && dist > 150)
        console.log(
          `In ${Math.round(dist)} meters, ${nextStep.html_instructions}`
        );
    } catch (e) {
      console.log("Navigation cancelled: ", e.message);
    }
  };

  const animateCarForLocation = () => {
    let bearing = 90;

    if (prevLocationRef.current) {
      bearing = getBearing(prevLocationRef.current, location);
    }
    prevLocationRef.current = location;
    mapRef.current?.animateCamera(
      {
        center: {
          latitude: location?.lat,
          longitude: location?.lng,
        },
        zoom: 20.5,
        pitch: 60,
        heading: bearing,
      },
      { duration: 600 }
    );
    carPosition
      .timing({
        latitude: location.lat,
        longitude: location.lng,
        duration: 600,
        useNativeDriver: false,
      })
      .start();
  };

  // function prepareAllPoints(steps) {
  //   const points = [];
  //   for (const s of steps) {
  //     const spoint = polylineTool.decode(s.polyline?.points);
  //     spoint.forEach(([lat, lng]) => points.push({ lat, lng }));
  //   }
  //   setCarpoint(points);
  // }

  const carPosition = useRef(
    new AnimatedRegion({
      latitude: location.lat,
      longitude: location.lng,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    })
  ).current;

  function animateCar(prev, next, duration = 1000) {
    carPosition
      .timing({
        latitude: next.latitude,
        longitude: next.longitude,
        duration,
        useNativeDriver: false,
      })
      .start();
  }

  async function onLocationUpdate(prev, next) {
    const br = getBearing(prev, next);
    setBearing(br);
    animateCar(prev, next);
  }

  // async function startNavigationCar(points) {
  //   for (let i = 1; i < points.length; i++) {
  //     console.log("index: ", points[i]);
  //     await onLocationUpdate(points[i - 1], points[i]);
  //     await new Promise((res) => setTimeout(res, 1000));
  //   }
  // }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        showsUserLocation
        provider="google"
        initialRegion={initialRegion}
        style={{ flex: 1 }}
      >
        {step && (
          <>
            {/* {step.start_location && step.start_location?.lat && (
              <Marker
                pinColor="green"
                coordinate={{
                  latitude: step.start_location?.lat,
                  longitude: step.start_location?.lng,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
              ></Marker>
            )}
            {step.end_location && step.end_location?.lat && (
              <Marker
                pinColor="red"
                coordinate={{
                  latitude: step.end_location?.lat,
                  longitude: step.end_location?.lng,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
              ></Marker>
            )} */}
          </>
        )}
        {localPolyline?.length && (
          <Polyline
            coordinates={localPolyline}
            strokeWidth={5}
            strokeColor="blue"
            geodesic={true}
          />
        )}
        {steps.map((s, idx) => (
          <Marker
            key={"step-" + idx}
            coordinate={{
              latitude: s.start_location.lat,
              longitude: s.start_location.lng,
            }}
            title={`Step ${idx + 1} : ${s.html_instructions}`}
            pinColor={idx === index ? "blue" : "grey"}
          />
        ))}
        <AnimatedMarker
          coordinate={carPosition}
          style={{ transform: [{ rotate: `${bearing}deg` }] }}
        >
          <Image
            source={require("@/assets/images/car.png")}
            style={{ width: 40, height: 40 }}
          />
        </AnimatedMarker>
      </MapView>
      <View style={[commonStyles.overlayContainer, { top: 600 }]}>
        <View style={{}}>
          <TouchableOpacity
            style={commonStyles.overlayIcon}
            onPress={() => {
              cancelRef.current = true;
              prevLocationRef.current = null;
              indexRef.current = 0;
              setStep(null);
              carPosition
                .timing({
                  latitude: location.lat,
                  longitude: location.lng,
                  duration: 600,
                  useNativeDriver: false,
                })
                .start();
            }}
          >
            <Ionicons
              name="close-outline"
              size={20}
              color={"#000"}
              style={{ padding: 10 }}
            ></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity
            style={commonStyles.overlayIcon}
            onPress={() => {
              cancelRef.current = false;
            }}
          >
            <Ionicons
              name="navigate-outline"
              size={20}
              color={"#000"}
              style={{ padding: 10 }}
            ></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity
            style={commonStyles.overlayIcon}
            onPress={() => {
              preparePoints();
            }}
          >
            <Ionicons
              name="beer-outline"
              size={20}
              color={"#000"}
              style={{ padding: 10 }}
            ></Ionicons>
          </TouchableOpacity>
        </View>
      </View>
      <View style={commonStyles.overlayContainer}>
        <View style={commonStyles.row}>
          {step?.html_instructions && (
            <View
              style={{
                backgroundColor: "#86af7cff",
                padding: 10,
                margin: 10,
                borderRadius: 10,
              }}
            >
              <View style={commonStyles.row}>
                <Ionicons
                  name={getTurnIcon(step?.maneuver)}
                  size={30}
                ></Ionicons>
              </View>
              <View style={commonStyles.row}>
                {/* <Text>{step?.html_instructions}</Text> */}
                <RenderHTML
                  contentWidth={width}
                  source={{
                    html: `<div>${step?.html_instructions}</div>`,
                  }}
                />
              </View>
              <View style={commonStyles.row}>
                <Text style={commonStyles.title}>{step?.distance?.text}</Text>
                <Text style={commonStyles.title}>{step?.duration?.text}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
