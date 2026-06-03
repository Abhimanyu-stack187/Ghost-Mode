import * as d3 from "d3";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ExposureHeatmapCell } from "../../data/mockExposureHeatmap";

const levelColors = { low: "#38e88b", medium: "#ffd84d", high: "#ff9838", critical: "#ff4d5f" };
const bandLabels = ["", "Low", "Medium", "High", "Critical"];

interface TooltipState {
  cell: ExposureHeatmapCell;
  x: number;
  y: number;
}

export function ExposureHeatmap({ cells }: { cells: ExposureHeatmapCell[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const hours = useMemo(() => [...new Set(cells.map((cell) => cell.hour))], [cells]);

  useEffect(() => {
    const container = containerRef.current;
    const svgElement = svgRef.current;
    if (!container || !svgElement || hours.length === 0) return;

    const svg = d3.select(svgElement);
    const render = () => {
      svg.selectAll("*").remove();
      const width = Math.max(container.clientWidth, 560);
      const height = 390;
      const margin = { top: 20, right: 18, bottom: 46, left: 68 };
      const x = d3.scaleBand<number>().domain(hours).range([margin.left, width - margin.right]).padding(0.14);
      const y = d3.scaleBand<number>().domain([4, 3, 2, 1]).range([margin.top, height - margin.bottom]).padding(0.14);

      svg.attr("viewBox", `0 0 ${width} ${height}`);
      svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x).tickFormat((hour) => `${String(hour).padStart(2, "0")}:00`).tickSizeOuter(0))
        .attr("class", "heatmap-axis");
      svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y).tickFormat((band) => bandLabels[band]).tickSizeOuter(0))
        .attr("class", "heatmap-axis");

      const cellSelection = svg.append("g").selectAll<SVGRectElement, ExposureHeatmapCell>("rect").data(cells).join("rect")
        .attr("x", (cell) => x(cell.hour) ?? 0).attr("y", (cell) => y(cell.intensityBand) ?? 0)
        .attr("rx", 5).attr("width", x.bandwidth()).attr("height", y.bandwidth()).attr("fill", (cell) => levelColors[cell.level])
        .attr("fill-opacity", 0).attr("stroke", (cell) => `${levelColors[cell.level]}88`).attr("stroke-width", 0.7)
        .style("filter", (cell) => cell.level === "critical" ? `drop-shadow(0 0 7px ${levelColors.critical}80)` : null)
        .style("cursor", "crosshair");

      cellSelection.transition().duration(450).delay((_, index) => index * 9).attr("fill-opacity", (cell) => 0.2 + cell.score / 145);
      cellSelection.on("mouseenter", (event, cell) => {
        const bounds = container.getBoundingClientRect();
        setTooltip({ cell, x: Math.min(event.clientX - bounds.left + 12, Math.max(12, bounds.width - 228)), y: Math.max(event.clientY - bounds.top - 48, 12) });
      }).on("mousemove", (event, cell) => {
        const bounds = container.getBoundingClientRect();
        setTooltip({ cell, x: Math.min(event.clientX - bounds.left + 12, Math.max(12, bounds.width - 228)), y: Math.max(event.clientY - bounds.top - 48, 12) });
      }).on("mouseleave", () => setTooltip(null));
    };

    render();
    const observer = new ResizeObserver(render);
    observer.observe(container);
    return () => observer.disconnect();
  }, [cells, hours]);

  return (
    <div className="relative overflow-x-auto" ref={containerRef}>
      <svg aria-label="Exposure intensity heatmap by time of day" className="min-w-[560px] w-full" ref={svgRef} role="img" />
      <AnimatePresence>
        {tooltip && (
          <motion.div animate={{ opacity: 1, scale: 1 }} className="pointer-events-none absolute z-10 w-52 rounded-xl border border-white/[0.12] bg-[#090d18]/95 p-3 shadow-panel backdrop-blur-xl" exit={{ opacity: 0, scale: 0.96 }} initial={{ opacity: 0, scale: 0.96 }} style={{ left: tooltip.x, top: tooltip.y }}>
            <div className="flex items-center justify-between gap-2"><p className="font-mono text-[10px] text-white">{String(tooltip.cell.hour).padStart(2, "0")}:00</p><span className="font-mono text-[8px] uppercase tracking-wider" style={{ color: levelColors[tooltip.cell.level] }}>{tooltip.cell.level}</span></div>
            <p className="mt-2 text-xs text-[#a4aec4]">{tooltip.cell.detail}</p>
            <div className="mt-3 flex justify-between font-mono text-[9px] text-[#657089]"><span>{tooltip.cell.signal}</span><span>{tooltip.cell.trackers} TRACKERS / {tooltip.cell.score}%</span></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
