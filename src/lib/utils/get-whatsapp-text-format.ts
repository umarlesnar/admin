export const getWhatsappTextFormat = (text: string): string => {
  // Apply bold formatting (*text*)
  text = text.replace(/\*(.*?)\*/g, "<strong>$1</strong>");

  // Apply italic formatting (_text_)
  text = text.replace(/_(.*?)_/g, "<em>$1</em>");

  // Apply strikethrough formatting (~text~)
  text = text.replace(/~(.*?)~/g, "<del>$1</del>");

  // Convert line breaks
  text = text.replace(/\n/g, "<br />");

  // Apply inline code formatting (`text`)
  text = text.replace(/`(.*?)`/g, "<code>$1</code>");

  // Apply blockquote (quote)
  text = text.replace(/^> (.*?$)/gm, "<blockquote>$1</blockquote>");

  // Apply numbered list (1. text)
  text = text.replace(/^\d+\.\s+(.*?$)/gm, "<ol><li>$1</li></ol>");

  // Check if all lines start with '*' or '-' for unordered list
  const lines = text.split("<br />");
  const allBulleted = lines.every(
    (line) => line.trim().startsWith("*") || line.trim().startsWith("-")
  );

  if (allBulleted) {
    // If all lines are bulleted, convert them into a single <ul>
    const listItems = lines
      .map((line) => {
        // Replace bullet points with <li> elements
        return line.replace(/^[*-]\s+(.*?$)/gm, "<li >$1</li>");
      })
      .join("");

    text = `<ul style='list-style-type: disc; padding-left: 20px;'>${listItems}</ul>`;
  } else {
    // If not all lines are bulleted, just replace the individual lines
    const listItems = text.replace(/^[*-]\s+(.*?$)/gm, "<li>$1</li>");
    text = listItems.replace(
      /(<li.*?<\/li>\s*)+/g,
      "<ul style='list-style-type: disc; padding-left: 20px;'>$&</ul>"
    );
  }

  return text;
};
