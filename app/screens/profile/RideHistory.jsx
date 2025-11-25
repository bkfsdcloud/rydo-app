import useUserStore from "@/app/store/useUserStore";
import { rideHistory, rideHistoryDetails } from "@/scripts/api/riderApi";
import { useNavigation } from "@react-navigation/native";
import * as _ from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RideHistory() {
  const navigation = useNavigation();
  const [rides, setRides] = useState([]);

  const { setRideInfo } = useUserStore();

  useEffect(() => {
    if (!rides.length) allRides();
  }, []);

  const allRides = async () => {
    const rideInfo = await rideHistory();

    const grouped = _.groupBy(rideInfo.data, (ride) => {
      const key = moment(ride.requested_at).format("MMM YYYY");
      return key;
    });
    const result = Object.entries(grouped).map(([month, data]) => ({
      month,
      data,
    }));
    setRides(result);
  };

  const bgColorMap = {
    COMPLETED: "#d7f6e0",
    CANCELLED: "#f7d7d7ff",
    REJECTED: "#f7d7d7ff",
    ONGOING: "#f3f2cfff",
    ASSIGNED: "#f3f2cfff",
    REQUESTED: "#f3f2cfff",
  };
  const colorMap = {
    COMPLETED: "#0a7a3a",
    CANCELLED: "#810d0dff",
    REJECTED: "#810d0dff",
    ONGOING: "#7a790dff",
    ASSIGNED: "#7a790dff",
    REQUESTED: "#7a790dff",
  };

  const renderBookingItem = (booking) => (
    <TouchableOpacity
      style={styles.bookingItem}
      onPress={async () => {
        const details = await rideHistoryDetails({
          rideId: booking.rideId,
        });
        setRideInfo(details.data[0]);
        navigation.navigate("RideHistoryDetail");
      }}
    >
      <View style={styles.bookingContent}>
        <View style={styles.carIcon}>
          <View style={styles.carBody}>
            <View style={styles.carWindow} />
            <View style={styles.carWheel} />
            <View style={styles.carWheel} />
          </View>
        </View>
        <View style={styles.bookingDetails}>
          <Text style={styles.bookingDate}>
            {moment(booking.requested_at).format("MMM DD, YYYY HH:mm A")}
          </Text>
          <Text style={styles.bookingService}>
            {booking.transport_mode}, {booking.category}, #{booking.rideId}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.status,
              {
                backgroundColor: bgColorMap[booking?.status],
                color: colorMap[booking?.status],
              },
            ]}
          >
            {booking.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <SectionList
        sections={rides}
        contentContainerStyle={{ paddingBottom: 200 }}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={({ section: { month, data } }) =>
          data.length > 0 ? (
            <Text style={styles.monthHeader}>{month}</Text>
          ) : null
        }
        renderItem={({ item }) => renderBookingItem(item)}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No Rides found
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 20,
    color: "#333",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  notificationButton: {
    padding: 8,
  },
  bellIcon: {
    width: 20,
    height: 20,
    position: "relative",
  },
  bellBody: {
    width: 16,
    height: 16,
    backgroundColor: "#333",
    borderRadius: 8,
    position: "absolute",
    top: 2,
    left: 2,
  },
  bellHandle: {
    width: 4,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    position: "absolute",
    top: 0,
    left: 8,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabButton: {
    borderBottomColor: "#e53e3e",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#e53e3e",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  monthHeader: {
    fontSize: 16,
    color: "#999",
    marginTop: 24,
    marginBottom: 16,
    fontWeight: "500",
  },
  bookingItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  bookingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  carIcon: {
    marginRight: 12,
  },
  carBody: {
    width: 40,
    height: 24,
    backgroundColor: "#e53e3e",
    borderRadius: 12,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  carWindow: {
    width: 20,
    height: 8,
    backgroundColor: "#fff",
    borderRadius: 4,
    position: "absolute",
    top: 4,
  },
  carWheel: {
    width: 8,
    height: 8,
    backgroundColor: "#333",
    borderRadius: 4,
    position: "absolute",
    bottom: -4,
  },
  bookingDetails: {
    flex: 1,
  },
  bookingDate: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  bookingService: {
    fontSize: 14,
    color: "#666",
  },
  statusContainer: {
    borderRadius: 16,
  },
  status: {
    padding: 6,
    borderRadius: 16,
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontWeight: "600",
    fontSize: 12,
  },
  bottomIndicator: {
    width: 134,
    height: 5,
    backgroundColor: "#333",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 8,
  },
});

// Position car wheels
StyleSheet.flatten([styles.carWheel, { left: 6 }]);

StyleSheet.flatten([styles.carWheel, { right: 6 }]);
