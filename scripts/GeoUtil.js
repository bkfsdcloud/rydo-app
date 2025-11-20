export const getDistanceKm = (start, end) => {
  const lat1 = start.lat;
  const lon1 = start.lng;
  const lat2 = end.lat;
  const lon2 = end.lng;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export const getBearing = (start, end) => {
  const lat1 = ((start.latitude || start.lat) * Math.PI) / 180;
  const lat2 = ((end.latitude || end.lat) * Math.PI) / 180;
  const lonDiff =
    (((end.longitude || end.lng) - (start.longitude || start.lng)) * Math.PI) /
    180;

  const y = Math.sin(lonDiff) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lonDiff);

  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
};

export const getTurnIcon = (maneuver) => {
  switch (maneuver) {
    case "turn-left":
      return "arrow-undo-outline";
    case "turn-right":
      return "arrow-redo-outline";
    case "roundabout-left":
      return "refresh-outline";
    default:
      return "arrow-up-circle-outline";
  }
};
