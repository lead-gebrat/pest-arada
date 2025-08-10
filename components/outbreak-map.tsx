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
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
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
  const [L, setL] = useState<any>(null); // leaflet instance

  useEffect(() => {
    setMounted(true);

    // dynamically import leaflet only in the browser
    import("leaflet").then((leaflet) => {
      setL(leaflet);
    });
  }, []);

  const center = useMemo<[number, number]>(() => [0.0236, 37.9062], []);

  const fetchReports = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/reports`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: Report[] = await res.json();
      setReports(data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const colors = [
    "#ef4444",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#6b7280",
  ];

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

  const getCustomIcon = (disease: string) => {
    if (!L) return undefined; // L not ready yet
    const color = getDiseaseColor(disease);
    return L.divIcon({
      html: `
        <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.373 0 0 5.373 0 12C0 21.75 12 36 12 36C12 36 24 21.75 24 12C24 5.373 18.627 0 12 0Z" fill="${color}" fill-opacity="0.85"/>
          <circle cx="12" cy="12" r="6" fill="white"/>
        </svg>
      `,
      className: "custom-icon",
      iconSize: [24, 36],
      iconAnchor: [12, 36],
      popupAnchor: [0, -36],
    });
  };

  if (!mounted || !L) {
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
      <MapContainer center={center} zoom={6} className="h-full w-full">
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.location.latitude, report.location.longitude]}
            icon={getCustomIcon(report.diseaseName)}
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
          </Marker>
        ))}
      </MapContainer>
    </Card>
  );
}
