import BottomPanel from "@/app/component/BottomPanel";
import AuthContext from "@/app/context/AuthContext";
import useUserStore from "@/app/store/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import React, { useContext, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { rideHistoryDetails } from "../../../scripts/api/riderApi";
import RatingComponent from "../../component/RatingComponent";

export default function RideHistoryDetail() {
  const modalRef = React.useRef(null);
  const { user: userInfo } = useContext(AuthContext);
  const { rideInfo, setRideInfo } = useUserStore();

  useEffect(() => {
    modalRef.current?.close();
  }, []);

  const isDriver = () => userInfo?.role === "DRIVER";

  const open = () => modalRef.current?.expand();
  const close = () => modalRef.current?.close();
  const getFeedback = () =>
    isDriver() ? rideInfo.driver_feedback : rideInfo.user_feedback;
  const getRating = () =>
    isDriver() ? rideInfo.driver_rating : rideInfo.user_rating;

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

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.topLeft}>
              <Text style={styles.sectionLabel}>
                {rideInfo?.transport_mode}
              </Text>
              <Text style={styles.dateText}>
                {moment(rideInfo.requested_at).format(
                  "ddd, MMM DD YYYY HH:mm A"
                )}
              </Text>
              <Text style={styles.fare}>₹{rideInfo.fare_estimated} (est)</Text>
            </View>
            <View style={styles.topRight}>
              <Image
                source={require("@/assets/images/taxi_front.png")}
                style={{
                  width: 40,
                  height: 40,
                  marginRight: 25,
                }}
              />
              <Text
                style={[
                  styles.status,
                  {
                    backgroundColor: bgColorMap[rideInfo?.status],
                    color: colorMap[rideInfo?.status],
                  },
                ]}
              >
                {rideInfo.status}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Address Details</Text>
          <Text style={styles.rideId}>Ride ID #{rideInfo.rideId}</Text>

          <View style={styles.locationRow}>
            <View style={styles.pinGreen} />
            <View style={styles.locationText}>
              <Text style={styles.locTitle}>{rideInfo.pickup_location}</Text>
              <Text style={styles.locSub}>
                {moment(rideInfo.started_at).format("MMM DD YYYY HH:mm A")}
              </Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <View style={styles.pinOrange} />
            <View style={styles.locationText}>
              <Text style={styles.locTitle}>{rideInfo.drop_location}</Text>
              <Text style={styles.locSub}>
                {moment(rideInfo.completed_at).format("MMM DD YYYY HH:mm A")}
              </Text>
            </View>
          </View>

          <Text style={styles.estTime}>
            {rideInfo.duration_minutes} mins • {rideInfo.distance_km} Km (est)
          </Text>
        </View>
        {rideInfo?.reason && (
          <View style={styles.card}>
            <View style={styles.locationText}>
              <Text style={styles.locTitle}>Reason</Text>
              <Text style={styles.locSub}>{rideInfo.reason}</Text>
            </View>
          </View>
        )}

        {getFeedback() && (
          <View style={styles.card}>
            <View style={styles.locationText}>
              <Text style={styles.locTitle}>Feedback</Text>
              <Text style={styles.locSub}>{getFeedback()}</Text>
            </View>
          </View>
        )}

        {rideInfo?.status === "COMPLETED" && (
          <View style={styles.ratingRow}>
            {/* <Image
              source={{ uri: "https://placehold.co/48x48" }}
              style={styles.avatar}
            /> */}
            <Text style={styles.ratingTitle}>Rating</Text>
            <View style={styles.ratingInfo}>
              <TouchableOpacity onPress={open} disabled={getRating() > 0}>
                <View style={styles.starsRow}>
                  {Array.from({ length: 5 }).map((val, idx) => (
                    <Ionicons
                      key={idx}
                      name={getRating() >= idx + 1 ? "star" : "star-outline"}
                      size={36}
                      color={"green"}
                      style={{ marginRight: 8 }}
                    />
                  ))}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Ride Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{rideInfo.fare_estimated}</Text>
          </View>
          {isDriver() && (
            <>
              <View style={styles.dividerThin} />
              <View style={styles.row}>
                <Text style={styles.label}>Your Earnings</Text>
                <Text style={styles.value}>
                  ₹{rideInfo?.driverEarning || 0}
                </Text>
              </View>
            </>
          )}

          <TouchableOpacity style={styles.emailRow}>
            <Text style={styles.emailIcon}>✉️</Text>
            <Text style={styles.emailText}>Send receipt via email</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomPanel
        detached={false}
        enablePanClose={true}
        ref={modalRef}
        index={-1}
        backgroundStyle={{ borderRadius: 24 }}
        onClose={close}
      >
        <RatingComponent
          rideId={rideInfo.rideId}
          driverId={rideInfo.driverId}
          riderId={rideInfo.riderId}
          onClose={async () => {
            const details = await rideHistoryDetails({
              rideId: rideInfo.rideId,
            });
            setRideInfo(details.data[0]);
            close();
          }}
        ></RatingComponent>
      </BottomPanel>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f4f6fb",
  },
  header: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f6f7fb",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e2e6ef",
  },
  backBtn: {
    position: "absolute",
    left: 14,
    top: 16,
  },
  backText: {
    color: "#1b6ef3",
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerSpacer: {
    width: 60,
  },
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    paddingTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topLeft: {
    maxWidth: "70%",
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  dateText: {
    fontSize: 13,
    color: "#555",
    marginTop: 6,
  },
  fare: {
    fontSize: 14,
    color: "#333",
    marginTop: 6,
    fontWeight: "600",
  },
  topRight: {
    alignItems: "flex-end",
  },
  icon: {
    fontSize: 22,
  },
  status: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: "600",
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#8894a6",
    fontWeight: "700",
    marginTop: 4,
  },
  rideId: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
  },
  pinGreen: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#27a24b",
    marginTop: 6,
    marginRight: 10,
  },
  pinOrange: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#f5260bff",
    marginTop: 6,
    marginRight: 10,
  },
  locationText: {
    flex: 1,
  },
  locTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  locSub: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  estTime: {
    fontSize: 12,
    color: "#555",
    marginTop: 8,
  },
  helpCard: {
    backgroundColor: "#e8f0ff",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  helpIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  helpText: {
    color: "#1c4d96",
    fontWeight: "600",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  ratingInfo: {
    marginLeft: 12,
  },
  ratingTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  starsRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  star: {
    fontSize: 22,
    color: "#bbb",
    marginRight: 4,
  },
  sectionSubtitle: {},
  sectionHeader: {},
  sectionBody: {},
  sectionBodyText: {},
  ratingCard: {},
  sectionLabelLeft: {},
  ratingCardPlaceholder: {},
  sectionTitle2: {},
  ratingCardLine: {},
  ratingTextBlock: {},
  ratingTitle2: {},
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  label: {
    fontSize: 14,
    color: "#444",
  },
  value: {
    fontSize: 14,
    color: "#111",
    fontWeight: "600",
  },
  dividerThin: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 6,
  },
  totalLabel: {
    fontSize: 14,
    color: "#444",
  },
  totalValue: {
    fontSize: 14,
    color: "#111",
    fontWeight: "700",
  },
  emailRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  emailIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  emailText: {
    color: "#1e64b6",
    fontWeight: "600",
  },
});

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "#f2f2f2",
//     flex: 1,
//     padding: 10,
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 8,
//     flexDirection: "row",
//     marginTop: 8,
//     justifyContent: "space-around",
//   },
//   cardItem: {
//     backgroundColor: "#fff",
//     flexDirection: "row",
//   },
//   icon: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     backgroundColor: "#fff",
//     padding: 8,
//     borderRadius: 8,
//     borderRightWidth: 0,
//     paddingRight: 8,
//     borderTopRightRadius: 0,
//     borderBottomRightRadius: 0,
//   },
//   paymentIcon: { paddingRight: 10 },
// });
