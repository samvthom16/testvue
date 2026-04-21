const GRADIENTS = [
  ["#89558d", "#6d3f71"],
  ["#006491", "#004f73"],
  ["#DB6933", "#b85229"],
  ["#16a34a", "#0e7a38"],
  ["#9E81A0", "#7a617c"],
  ["#c2410c", "#9a3309"],
  ["#0369a1", "#025e8f"],
  ["#7c3aed", "#6427c4"],
];

export function getGradient(name) {
  if (!name) return `linear-gradient(135deg, ${GRADIENTS[0][0]}, ${GRADIENTS[0][1]})`;
  const index = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % GRADIENTS.length;
  const [from, to] = GRADIENTS[index];
  return `linear-gradient(135deg, ${from}, ${to})`;
}

export function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
}
