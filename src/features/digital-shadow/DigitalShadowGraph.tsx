import * as d3 from "d3";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ShadowLink, ShadowNode, ShadowNodeKind } from "../../data/mockDigitalShadow";

interface GraphNode extends ShadowNode, d3.SimulationNodeDatum {}
interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  signal: string;
}

interface DataPacket {
  id: string;
  link: GraphLink;
  offset: number;
  speed: number;
  active: boolean;
}

interface TooltipState {
  node: GraphNode;
  x: number;
  y: number;
}

const kindColors: Record<ShadowNodeKind, string> = {
  user: "#35e9ff",
  application: "#4586ff",
  "tracker-company": "#9b5cff",
};

const nodeColor = (node: ShadowNode) => node.risk === "high" ? "#ff4d6d" : kindColors[node.kind];
const nodeRadius: Record<ShadowNodeKind, number> = { user: 27, application: 20, "tracker-company": 15 };
const columnPosition: Record<ShadowNodeKind, number> = { user: 0.13, application: 0.48, "tracker-company": 0.84 };
const activePath = new Set(["user->chrome", "chrome->google-analytics"]);
const nodeId = (node: string | GraphNode) => typeof node === "string" ? node : node.id;
const linkId = (link: GraphLink) => `${nodeId(link.source)}->${nodeId(link.target)}`;

export function DigitalShadowGraph({ nodes, links }: { nodes: ShadowNode[]; links: ShadowLink[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const svgElement = svgRef.current;
    if (!container || !svgElement) return;

    const graphNodes: GraphNode[] = nodes.map((node) => ({ ...node }));
    const graphLinks: GraphLink[] = links.map((link) => ({ ...link }));
    const svg = d3.select(svgElement);
    svg.selectAll("*").remove();

    const defs = svg.append("defs");
    const glow = defs.append("filter").attr("id", "nodeGlow").attr("x", "-100%").attr("y", "-100%").attr("width", "300%").attr("height", "300%");
    glow.append("feGaussianBlur").attr("stdDeviation", "5").attr("result", "blur");
    glow.append("feMerge").selectAll("feMergeNode").data(["blur", "SourceGraphic"]).join("feMergeNode").attr("in", (value) => value);
    const packetGlow = defs.append("filter").attr("id", "packetGlow").attr("x", "-200%").attr("y", "-200%").attr("width", "500%").attr("height", "500%");
    packetGlow.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "blur");
    packetGlow.append("feMerge").selectAll("feMergeNode").data(["blur", "SourceGraphic"]).join("feMergeNode").attr("in", (value) => value);
    defs.append("marker").attr("id", "linkArrow").attr("viewBox", "0 -5 10 10").attr("refX", 28).attr("refY", 0).attr("markerWidth", 5).attr("markerHeight", 5).attr("orient", "auto")
      .append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "#657089");

    const root = svg.append("g");
    const linkGroup = root.append("g");
    const packetGroup = root.append("g").attr("pointer-events", "none");
    const nodeGroup = root.append("g");
    const linksSelection = linkGroup.selectAll<SVGLineElement, GraphLink>("line").data(graphLinks).join("line")
      .attr("class", (link) => `shadow-graph-link ${activePath.has(linkId(link)) ? "shadow-graph-link-active" : ""}`)
      .attr("marker-end", "url(#linkArrow)").attr("stroke-dasharray", "4 7").attr("stroke-opacity", 0)
      .transition().duration(700).delay((_, index) => index * 70).attr("stroke-opacity", (link) => activePath.has(linkId(link)) ? 0.9 : 0.42)
      .selection();

    const packets: DataPacket[] = graphLinks.flatMap((link, linkIndex) => {
      const isActive = activePath.has(linkId(link));
      const count = isActive ? 4 : 1;
      return Array.from({ length: count }, (_, packetIndex) => ({
        id: `${linkIndex}-${packetIndex}`,
        link,
        active: isActive,
        offset: packetIndex / count + linkIndex * 0.11,
        speed: isActive ? 0.00018 + packetIndex * 0.000012 : 0.00009,
      }));
    });
    const packetSelection = packetGroup.selectAll<SVGCircleElement, DataPacket>("circle").data(packets).join("circle")
      .attr("r", (packet) => packet.active ? 3.2 : 2).attr("fill", (packet) => packet.active ? "#35e9ff" : "#9b5cff")
      .attr("filter", "url(#packetGlow)").attr("opacity", (packet) => packet.active ? 1 : 0.58);

    const nodeSelection = nodeGroup.selectAll<SVGGElement, GraphNode>("g").data(graphNodes).join("g")
      .attr("class", "cursor-grab active:cursor-grabbing").attr("opacity", 0);
    nodeSelection.append("circle").attr("class", "shadow-node-pulse").attr("r", (node) => nodeRadius[node.kind] + 8)
      .attr("fill", "transparent").attr("stroke", nodeColor).attr("stroke-opacity", 0.24).attr("stroke-width", 1);
    nodeSelection.append("circle").attr("class", "shadow-node-orbit").attr("r", (node) => nodeRadius[node.kind] + 7)
      .attr("fill", "transparent").attr("stroke", nodeColor).attr("stroke-opacity", 0.25).attr("stroke-dasharray", "2 5");
    nodeSelection.append("circle").attr("class", "shadow-node-core").attr("r", 0).attr("fill", (node) => `${nodeColor(node)}22`)
      .attr("stroke", nodeColor).attr("stroke-width", 1.5).attr("filter", "url(#nodeGlow)")
      .transition().duration(650).delay((_, index) => index * 65).attr("r", (node) => nodeRadius[node.kind]);
    nodeSelection.append("circle").attr("r", 3).attr("fill", nodeColor);
    nodeSelection.append("text").attr("y", (node) => nodeRadius[node.kind] + 20).attr("text-anchor", "middle")
      .attr("class", "fill-white font-mono text-[10px] font-bold tracking-wide").text((node) => node.label);
    nodeSelection.transition().duration(450).delay((_, index) => index * 65).attr("opacity", 1);

    let width = container.clientWidth;
    let height = container.clientHeight;
    const simulation = d3.forceSimulation(graphNodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(graphLinks).id((node) => node.id).distance(128).strength(0.78))
      .force("charge", d3.forceManyBody().strength(-580))
      .force("collision", d3.forceCollide<GraphNode>().radius((node) => nodeRadius[node.kind] + 34))
      .force("x", d3.forceX<GraphNode>((node) => width * columnPosition[node.kind]).strength(0.72))
      .force("y", d3.forceY<GraphNode>(height / 2).strength(0.1));

    const connectedTo = (link: GraphLink, id: string) => nodeId(link.source) === id || nodeId(link.target) === id;
    const highlightConnections = (hovered?: GraphNode) => {
      linksSelection.transition().duration(180).attr("stroke-opacity", (link) => !hovered ? (activePath.has(linkId(link)) ? 0.9 : 0.42) : connectedTo(link, hovered.id) ? 1 : 0.1)
        .attr("stroke-width", (link) => hovered && connectedTo(link, hovered.id) ? 2.4 : activePath.has(linkId(link)) ? 1.8 : 1.2);
      packetSelection.transition().duration(180).attr("opacity", (packet) => !hovered ? (packet.active ? 1 : 0.58) : connectedTo(packet.link, hovered.id) ? 1 : 0.08);
      nodeSelection.transition().duration(180).attr("opacity", (node) => !hovered || node.id === hovered.id || graphLinks.some((link) => connectedTo(link, hovered.id) && connectedTo(link, node.id)) ? 1 : 0.22);
      nodeSelection.select<SVGCircleElement>(".shadow-node-core").transition().duration(180).attr("r", (node) => nodeRadius[node.kind] + (hovered?.id === node.id ? 5 : 0));
    };

    const drag = d3.drag<SVGGElement, GraphNode>()
      .on("start", (event, node) => { if (!event.active) simulation.alphaTarget(0.25).restart(); node.fx = node.x; node.fy = node.y; })
      .on("drag", (event, node) => { node.fx = event.x; node.fy = event.y; })
      .on("end", (event, node) => { if (!event.active) simulation.alphaTarget(0); node.fx = null; node.fy = null; });

    nodeSelection.call(drag).on("mouseenter", (event, node) => {
      const bounds = container.getBoundingClientRect();
      highlightConnections(node);
      setTooltip({ node, x: Math.min(event.clientX - bounds.left + 16, Math.max(12, bounds.width - 208)), y: Math.max(event.clientY - bounds.top - 34, 12) });
    }).on("mousemove", (event, node) => {
      const bounds = container.getBoundingClientRect();
      setTooltip({ node, x: Math.min(event.clientX - bounds.left + 16, Math.max(12, bounds.width - 208)), y: Math.max(event.clientY - bounds.top - 34, 12) });
    }).on("mouseleave", () => { highlightConnections(); setTooltip(null); });

    simulation.on("tick", () => {
      linksSelection.attr("x1", (link) => (link.source as GraphNode).x ?? 0).attr("y1", (link) => (link.source as GraphNode).y ?? 0)
        .attr("x2", (link) => (link.target as GraphNode).x ?? 0).attr("y2", (link) => (link.target as GraphNode).y ?? 0);
      nodeSelection.attr("transform", (node) => `translate(${node.x ?? 0},${node.y ?? 0})`);
    });

    const startedAt = performance.now();
    let animationFrame = 0;
    const animatePackets = (time: number) => {
      packetSelection.attr("cx", (packet) => {
        const progress = ((time - startedAt) * packet.speed + packet.offset) % 1;
        const source = packet.link.source as GraphNode;
        const target = packet.link.target as GraphNode;
        return (source.x ?? 0) + ((target.x ?? 0) - (source.x ?? 0)) * progress;
      }).attr("cy", (packet) => {
        const progress = ((time - startedAt) * packet.speed + packet.offset) % 1;
        const source = packet.link.source as GraphNode;
        const target = packet.link.target as GraphNode;
        return (source.y ?? 0) + ((target.y ?? 0) - (source.y ?? 0)) * progress;
      });
      animationFrame = requestAnimationFrame(animatePackets);
    };
    animationFrame = requestAnimationFrame(animatePackets);

    const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.55, 2.4]).on("zoom", (event) => root.attr("transform", event.transform));
    svg.call(zoom).call(zoom.transform, d3.zoomIdentity);
    const resizeObserver = new ResizeObserver(() => {
      width = container.clientWidth;
      height = container.clientHeight;
      svg.attr("viewBox", `0 0 ${width} ${height}`);
      simulation.force("x", d3.forceX<GraphNode>((node) => width * columnPosition[node.kind]).strength(0.72));
      simulation.force("y", d3.forceY<GraphNode>(height / 2).strength(0.1));
      simulation.alpha(0.35).restart();
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      simulation.stop();
      svg.on(".zoom", null);
    };
  }, [links, nodes]);

  return (
    <div className="relative h-full min-h-[520px] overflow-hidden rounded-2xl" ref={containerRef}>
      <svg aria-label="Real-time digital shadow relationship graph" className="h-full w-full" ref={svgRef} role="img" />
      <AnimatePresence>
        {tooltip && (
          <motion.div animate={{ opacity: 1, scale: 1 }} className="pointer-events-none absolute z-10 w-48 rounded-xl border border-white/[0.12] bg-[#090d18]/95 p-3 shadow-panel backdrop-blur-xl" exit={{ opacity: 0, scale: 0.95 }} initial={{ opacity: 0, scale: 0.95 }} style={{ left: tooltip.x, top: tooltip.y }}>
            <div className="flex items-center justify-between gap-2"><p className="text-xs font-bold text-white">{tooltip.node.label}</p><span className="font-mono text-[8px] uppercase tracking-wider" style={{ color: nodeColor(tooltip.node) }}>{tooltip.node.risk} risk</span></div>
            <p className="mt-2 text-[11px] leading-4 text-[#8792aa]">{tooltip.node.detail}</p>
            <p className="mt-2 font-mono text-[9px] text-cyan">{tooltip.node.events.toLocaleString()} observed events</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
