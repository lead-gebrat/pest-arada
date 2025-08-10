"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/components/i18n/i18n";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((m) => m.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
});

type Props = { accent?: string };

interface Report {
  id: string;
  diseaseName: string;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
}

export default function OutbreakMap({ accent = "#255957" }: Props) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => setMounted(true), []);
  const center = useMemo<[number, number]>(() => [0.0236, 37.9062], []);

  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:3001/reports");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: Report[] = await res.json();
      console.log("Fetched reports:", data);
      setReports(data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const colors = [
    "#ef4444", // red
    "#f59e0b", // orange
    "#10b981", // green
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#6b7280", // gray
  ];

  // ✅ Store the disease-color map across renders
  const diseaseColorMap = useRef<Map<string, string>>(new Map());

  const getDiseaseColor = (disease: string) => {
    const normalized = disease.trim().toLowerCase();

    if (!diseaseColorMap.current.has(normalized)) {
      const assignedColor =
        colors[diseaseColorMap.current.size % colors.length];
      diseaseColorMap.current.set(normalized, assignedColor);
    }

    return diseaseColorMap.current.get(normalized)!;
  };

  if (!mounted) {
    return (
      <Card
        className="h-[420px] w-full rounded-xl overflow-hidden border"
        style={{ borderColor: "rgba(37,89,87,0.2)" }}
      >
        <div className="h-full w-full flex items-center justify-center text-sm text-gray-500">
          {t("loadingMap")}
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="h-[420px] w-full rounded-xl overflow-hidden border"
      style={{ borderColor: "rgba(37,89,87,0.2)" }}
    >
      <MapContainer
        center={center}
        zoom={6}
        className="h-full w-full"
        style={{ outline: "none" }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.map((report) => (
          <CircleMarker
            key={report.id}
            center={[report.location.latitude, report.location.longitude]}
            radius={12}
            pathOptions={{
              color: "white",
              weight: 2,
              fillColor: getDiseaseColor(report.diseaseName),
              fillOpacity: 0.85,
            }}
          >
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">{report.diseaseName}</p>
                <p className="text-sm text-gray-700">
                  Location: {report.location.latitude.toFixed(4)},{" "}
                  {report.location.longitude.toFixed(4)}
                </p>
                <p
                  className="text-xs"
                  style={{ color: getDiseaseColor(report.diseaseName) }}
                >
                  Reported: {new Date(report.timestamp).toLocaleString()}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </Card>
  );
}
