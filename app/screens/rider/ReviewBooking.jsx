import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ReviewBooking() {
  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>One Way Trip</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>TRIP DETAILS</Text>

        <View style={styles.tripRow}>
          <Text style={styles.car}>🚗</Text>
          <View style={styles.locations}>
            <View style={styles.destRow}>
              <View style={[styles.dot, { backgroundColor: "green" }]} />
              <Text style={styles.destText}>Coimbatore Tamil Nadu, India</Text>
            </View>
            <View style={styles.destRow}>
              <View style={[styles.dot, { backgroundColor: "red" }]} />
              <Text style={styles.destText}>Salem</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionSpace} />

        <Text style={styles.sectionLabel}>DATE & TIME</Text>
        <View style={styles.dateBlock}>
          <Text style={styles.dateText}>
            Trip Starts at, 25 Nov 2025, 12:15 PM
          </Text>
          <Text style={styles.small}>
            One way trip of about 167 kms, 3 hrs 2 mins
          </Text>
        </View>

        <View style={styles.sectionSpace} />

        <Text style={styles.sectionLabel}>FARE DETAILS</Text>

        <View style={styles.yellowCard}>
          <Text style={styles.total}>₹4,553.00</Text>
          <Text style={styles.totalSub}>Estimated Fare</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.fareRow}>
            <Text>Trip Fare</Text>
            <Text>₹3,906.00</Text>
          </View>
          <View style={styles.fareRow}>
            <Text>Approx Toll Charges*</Text>
            <Text>₹406.00</Text>
          </View>
          <View style={styles.fareRow}>
            <Text>Convenience Fee</Text>
            <Text>₹20.00</Text>
          </View>
          <View style={styles.fareRow}>
            <Text>Taxes & Fees</Text>
            <Text>₹221.00</Text>
          </View>
        </View>

        <Text style={styles.note}>
          * Toll Charges Added to the Estimated Fare
        </Text>

        <View style={styles.sectionSpace} />

        <Text style={styles.sectionLabel}>DESCRIPTION</Text>
        <View style={styles.description}>
          <Text>- Excludes parking, permits and state tax.</Text>
          <Text>- ₹100/hr will be charged for additional hours.</Text>
        </View>

        <View style={styles.sectionSpace} />

        <View style={styles.pillRow}>
          <TouchableOpacity style={styles.pill}>
            <Text style={styles.pillIcon}>💳</Text>
            <Text>Cash</Text>
            <Text style={styles.pillArrow}>▼</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pill}>
            <Text style={styles.pillIcon}>👤</Text>
            <Text>Personal</Text>
            <Text style={styles.pillArrow}>▼</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pill}>
            <Text style={styles.pillIcon}>🎫</Text>
            <Text>Coupon</Text>
            <Text style={styles.pillArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.confirmBtn}>
          <Text style={styles.confirmText}>Confirm Booking</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  backBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  backText: { fontSize: 18 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
  },
  content: { paddingHorizontal: 16, paddingBottom: 40 },
  sectionLabel: {
    color: "#6f6f6f",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 6,
  },
  sectionSpace: { height: 8 },
  tripRow: { flexDirection: "row", alignItems: "center" },
  car: { fontSize: 22, marginRight: 6 },
  locations: { marginLeft: 6 },
  destRow: { flexDirection: "row", alignItems: "center", marginVertical: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  destText: { fontSize: 14, color: "#333" },
  dateBlock: { paddingHorizontal: 6 },
  dateText: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 6 },
  small: { fontSize: 12, color: "#777" },
  yellowCard: {
    backgroundColor: "#F6C400",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: "center",
    marginVertical: 8,
  },
  total: { fontSize: 28, fontWeight: "800" },
  totalSub: { fontSize: 14, color: "#555" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: "#eee",
    marginVertical: 8,
  },
  fareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  note: { fontSize: 12, color: "#666", marginTop: 6 },
  description: { paddingVertical: 6 },
  pillRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    marginBottom: 6,
  },
  pill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    marginHorizontal: 6,
  },
  pillIcon: { fontSize: 16 },
  pillArrow: { fontSize: 12, color: "#aaa", marginTop: 2 },
  confirmBtn: {
    backgroundColor: "#D83434",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  confirmText: { color: "#fff", fontWeight: "600" },
});
