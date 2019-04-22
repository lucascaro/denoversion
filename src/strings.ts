export function stripIndent(strings, ...values) {
  // Interweave the strings with the
  // substitution vars first.
  let output = "";
  for (let i = 0; i < values.length; i++) {
    output += strings[i] + values[i];
  }
  output += strings[values.length];

  // Split on newlines.
  const lines = output.split(/(?:\r\n|\n|\r)/);

  if (lines[0] && lines[0] === "") {
    lines.shift();
  }

  const indentSpaces = lines
    // Use non-blank lines to detect whitespace.
    .filter(l => l.trim().length > 0)
    // Calculate minimum number of spaces.
    .reduce((p, c) => Math.min(p, c.search(/\S|$/)), Number.MAX_SAFE_INTEGER);

  // Rip out the leading whitespace.
  return lines
    .map(line => line.slice(indentSpaces))
    .join("\n")
    .trim();
}
