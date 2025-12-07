import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

const { width } = Dimensions.get("window");

const LineChart = ({ data, color = "#e74c3c" }) => {
  const w = width - 48;
  const h = 120;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const d = data
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / range) * (h - 20) - 6;
      return `${i === 0 ? "M" : "L"} ${x},${y}`;
    })
    .join(" ");

  return (
    <Svg width={w} height={h}>
      <Path d={d} stroke={color} strokeWidth={2.5} fill="none" />
      {/* subtle baseline grid */}
      <Path d={`M0 ${h - 6} H ${w}`} stroke="#1e2a3a" strokeWidth={1} />
    </Svg>
  );
};

const DonutChart = ({ total = 831, completed = 790, size = 160 }) => {
  const radius = (size - 20) / 2;
  const circ = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, completed / total));
  const dash = circ * progress;

  return (
    <View style={styles.donutWrap}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2a3650"
          strokeWidth={14}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2ecc71"
          strokeWidth={14}
          fill="none"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="transparent"
          strokeWidth={0}
          fill="none"
        />
      </Svg>
      <View style={styles.donutCenter}>
        <Text style={styles.donutValue}>{total}</Text>
        <Text style={styles.donutLabel}>Total Rides</Text>
      </View>
    </View>
  );
};

export default function Reports() {
  const pills = ["Today", "Last 7 Days", "Month to Date"];
  const [activePill, setActivePill] = React.useState("Today");
  const [activeTab, setActiveTab] = React.useState("Overview");
  const lineData = [60, 72, 68, 85, 90, 110, 95, 130];

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.menu}>☰</Text>
        <Text style={styles.title}>Analytics & Reports</Text>
        <Text style={styles.bell}>🔔</Text>
      </View> */}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Pills */}
        <View style={styles.pillRow}>
          {pills.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.pill, p === activePill ? styles.pillActive : null]}
              onPress={() => setActivePill(p)}
            >
              <Text
                style={
                  p === activePill ? styles.pillTextActive : styles.pillText
                }
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {["Overview", "Earnings", "Drivers"].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setActiveTab(t)}
              style={styles.tabItem}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === t && styles.tabTextActive,
                ]}
              >
                {t}
              </Text>
              {activeTab === t && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Cards grid (2 columns) */}
        <View style={styles.grid}>
          <View style={styles.cardSmall}>
            <Text style={styles.cardLabel}>Total Earnings</Text>
            <Text style={styles.cardValue}>$12,482</Text>
            <Text style={styles.cardDelta}>+5.1%</Text>
          </View>
          <View style={styles.cardSmall}>
            <Text style={styles.cardLabel}>Total Rides</Text>
            <Text style={styles.cardValue}>831</Text>
            <Text style={styles.cardDelta}>+2.3%</Text>
          </View>
          <View style={styles.cardSmall}>
            <Text style={styles.cardLabel}>Active Drivers</Text>
            <Text style={styles.cardValue}>96</Text>
            <Text style={styles.cardDelta}>-1.2%</Text>
          </View>
          <View style={styles.cardSmall}>
            <Text style={styles.cardLabel}>Avg. Rating</Text>
            <Text style={styles.cardValue}>4.8</Text>
            <Text style={styles.cardDelta}>--</Text>
          </View>
        </View>

        {/* Daily Earnings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Earnings</Text>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderTitle}>$8,930</Text>
              <Text style={styles.sectionHeaderSubtitle}>+5.1%</Text>
            </View>
            <LineChart data={lineData} color="#e74c3c" />
          </View>
        </View>

        {/* Ride Status Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ride Status Breakdown</Text>
          <View style={styles.sectionCardRow}>
            <DonutChart total={831} completed={790} size={140} />
            <View style={styles.legend}>
              <View style={styles.legendRow}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#2ecc71" }]}
                />
                <Text style={styles.legendText}>Completed (790)</Text>
              </View>
              <View style={styles.legendRow}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#e74c3c" }]}
                />
                <Text style={styles.legendText}>Canceled (41)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Download Reports */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Download Reports</Text>
          <TextInput
            placeholder="Search for a report"
            placeholderTextColor="#7c8a9e"
            style={styles.search}
          />
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={styles.reportItem}>
              <Text style={styles.reportTitle}>Monthly Earnings Statement</Text>
              <Text style={styles.reportSubtitle}>
                Detailed breakdown of all earnings.
              </Text>
              <Text style={styles.downloadIcon}>⤓</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1624",
  },
  header: {
    height: 64,
    paddingHorizontal: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#0b1624",
  },
  menu: { color: "#fff", fontSize: 22 },
  bell: { color: "#fff", fontSize: 20 },
  title: { color: "#fff", fontSize: 18, fontWeight: "600" },
  content: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 24,
  },
  pillRow: { flexDirection: "row", gap: 8, marginVertical: 8 },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#1e2a3a",
    marginRight: 8,
  },
  pillActive: { backgroundColor: "#e74c3c" },
  pillText: { color: "#d8e2f0", fontWeight: "600" },
  pillTextActive: { color: "#fff", fontWeight: "700" },
  tabs: {
    flexDirection: "row",
    marginTop: 6,
    borderBottomWidth: 1,
    borderColor: "#1e2a3a",
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 8,
    alignItems: "center",
  },
  tabText: { color: "#aab6d3", fontWeight: "600" },
  tabTextActive: { color: "#fff" },
  tabUnderline: {
    height: 3,
    width: "100%",
    backgroundColor: "#e74c3c",
    marginTop: 6,
    borderRadius: 2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
  },
  cardSmall: {
    width: "48%",
    backgroundColor: "#162235",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  cardLabel: { color: "#a1b4d8", fontSize: 12, marginBottom: 6 },
  cardValue: { color: "#fff", fontSize: 22, fontWeight: "700" },
  cardDelta: { color: "#2bd576", fontSize: 12, marginTop: 6 },
  section: { marginTop: 18 },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  sectionCard: { backgroundColor: "#162235", borderRadius: 12, padding: 14 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionHeaderTitle: { color: "#fff", fontSize: 24, fontWeight: "700" },
  sectionHeaderSubtitle: { color: "#2bd576", fontWeight: "700" },
  donutWrap: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  donutCenter: { position: "absolute", alignItems: "center" },
  donutValue: { fontSize: 18, color: "#fff", fontWeight: "700" },
  donutLabel: { fontSize: 12, color: "#a1b4d8" },
  sectionCardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  legend: { marginLeft: 12, justifyContent: "center" },
  legendRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  legendText: { color: "#d1d9e8" },
  search: {
    height: 40,
    backgroundColor: "#0f1b2b",
    borderRadius: 8,
    paddingHorizontal: 12,
    color: "#fff",
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#1e2a3a",
  },
  reportItem: {
    backgroundColor: "#162235",
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    position: "relative",
  },
  reportTitle: { color: "#fff", fontWeight: "700" },
  reportSubtitle: { color: "#a0b3d2", fontSize: 12, marginTop: 4 },
  downloadIcon: {
    position: "absolute",
    right: 12,
    top: 22,
    color: "#fff",
    fontSize: 16,
  },
});
