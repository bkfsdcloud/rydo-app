import { commonStyles } from "@/scripts/constants";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminDashboard() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#0b1733" /> */}
      <View style={commonStyles.overlayContainer}>
        <TouchableOpacity
          style={commonStyles.overlayIcon}
          onPress={() => {
            navigation.toggleDrawer();
          }}
        >
          <Ionicons
            name="menu-outline"
            size={20}
            color={"#000"}
            style={{ padding: 10 }}
          ></Ionicons>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridRow}>
          <View style={styles.smallCard}>
            <Text style={styles.smallLabel}>Active Drivers</Text>
            <Text style={styles.smallValue}>1,204</Text>
          </View>
          <View style={styles.smallCard}>
            <Text style={styles.smallLabel}>Pending Approvals</Text>
            <Text style={[styles.smallValue, { color: "#ff6b6b" }]}>16</Text>
          </View>
        </View>

        <View style={styles.cardWide}>
          <Text style={styles.smallLabel}>Rides in Progress</Text>
          <Text style={styles.bigValue}>215</Text>
        </View>

        <View style={styles.cardActivity}>
          <Text style={styles.activityTitle}>Today's Activity</Text>
          <Text style={styles.activityValue}>
            3,450 Rides <Text style={styles.green}>+12%</Text>
          </Text>

          <View style={styles.chartRow}>
            <View style={[styles.arc, styles.arcLeft]} />
            <View style={[styles.arc, styles.arcMid]} />
            <View style={[styles.arc, styles.arcRight]} />
          </View>

          <View style={styles.chartLabels}>
            <Text style={styles.chartLabel}>12AM</Text>
            <Text style={styles.chartLabel}>12PM</Text>
            <Text style={styles.chartLabel}>Now</Text>
          </View>

          <View style={styles.chartRowBottom}>
            <Text style={styles.chartLabel}>6AM</Text>
            <Text style={styles.chartLabel}>6PM</Text>
          </View>
        </View>

        <View style={styles.quickSection}>
          <Text style={styles.quickTitle}>Quick Links</Text>

          <TouchableOpacity
            style={styles.quickItem}
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate("DriverManagement");
            }}
          >
            <View style={styles.quickIcon} />
            <Text style={styles.quickText}>Manage Drivers</Text>
            <Text style={styles.quickChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickItem} activeOpacity={0.8}>
            <View style={styles.quickIcon} />
            <Text style={styles.quickText}>View Ride History</Text>
            <Text style={styles.quickChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickItem} activeOpacity={0.8}>
            <View style={styles.quickIcon} />
            <Text style={styles.quickText}>Support Tickets</Text>
            <Text style={styles.quickChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickItem} activeOpacity={0.8}>
            <View style={styles.quickIcon} />
            <Text style={styles.quickText}>Payments & Payouts</Text>
            <Text style={styles.quickChevron}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
        <Text style={styles.fabIcon}>🔊</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1430",
  },
  header: {
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#0b1430",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },
  avatar: {
    position: "absolute",
    right: 16,
    top: 14,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1b2550",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  smallCard: {
    width: "48%",
    backgroundColor: "#162041",
    borderRadius: 14,
    padding: 18,
    justifyContent: "center",
  },
  smallLabel: {
    color: "#cbd6f7",
    fontSize: 13,
    marginBottom: 6,
  },
  smallValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  cardWide: {
    backgroundColor: "#162041",
    borderRadius: 14,
    padding: 18,
    marginTop: 10,
    alignItems: "flex-start",
  },
  bigValue: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "800",
    marginTop: 6,
  },
  cardActivity: {
    backgroundColor: "#162041",
    borderRadius: 14,
    padding: 18,
    marginTop: 14,
  },
  activityTitle: {
    color: "#cbd6f7",
    fontSize: 14,
    marginBottom: 6,
  },
  activityValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  green: {
    color: "#3bd17a",
    fontWeight: "700",
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 12,
    justifyContent: "space-between",
    height: 60,
  },
  arc: {
    width: 60,
    height: 52,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: "#2a1e2d",
  },
  arcLeft: {
    backgroundColor: "#3a2b2f",
  },
  arcMid: {
    backgroundColor: "#2a1e2d",
  },
  arcRight: {
    backgroundColor: "#ff4d4d",
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  chartLabel: {
    fontSize: 12,
    color: "#a9b3d3",
    width: "33%",
    textAlign: "center",
  },
  chartRowBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  quickSection: {
    marginTop: 18,
  },
  quickTitle: {
    color: "#cbd6f7",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  quickItem: {
    backgroundColor: "#162041",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  quickIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#1e2a45",
    marginRight: 12,
  },
  quickText: {
    color: "#fff",
    fontSize: 15,
  },
  quickChevron: {
    color: "#9fb1ff",
    fontSize: 18,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ff4d4d",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  fabIcon: {
    fontSize: 26,
    color: "#fff",
  },
});
