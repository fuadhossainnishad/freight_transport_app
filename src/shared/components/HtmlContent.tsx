import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

interface Props {
  html: string;
}

const HAS_TAGS = /<[a-z][\s\S]*>/i;

// Backend-authored copy (About/Privacy/Terms/Hiring/Carrier Data) is sometimes
// plain text with no markup at all. Escape and turn newlines into <br> in that
// case so it doesn't collapse into a single line inside the WebView.
function toHtmlBody(raw: string): string {
  if (HAS_TAGS.test(raw)) return raw;
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}

const INJECTED_JS = `
  function postHeight() {
    window.ReactNativeWebView.postMessage(String(document.body.scrollHeight));
  }
  postHeight();
  window.addEventListener('load', postHeight);
  setTimeout(postHeight, 300);
  true;
`;

// Renders backend HTML content (About/Privacy/Terms/Hiring/Carrier Data)
// instead of showing the raw markup as text. Height is measured from inside
// the page and applied to the WebView so it flows naturally in an outer
// ScrollView rather than being clipped or independently scrollable.
export default function HtmlContent({ html }: Props) {
  const [height, setHeight] = useState(1);

  const document = `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, Roboto, sans-serif;
        font-size: 16px;
        line-height: 1.75;
        color: #374151;
      }
      img { max-width: 100%; height: auto; }
      p { margin: 0 0 12px; }
      a { color: #036BB4; }
    </style>
  </head>
  <body>${toHtmlBody(html)}</body>
</html>`;

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html: document }}
      style={[styles.webview, { height }]}
      scrollEnabled={false}
      injectedJavaScript={INJECTED_JS}
      onMessage={(e) => {
        const next = Number(e.nativeEvent.data);
        if (!Number.isNaN(next) && next > 0) setHeight(next);
      }}
    />
  );
}

const styles = StyleSheet.create({
  webview: { backgroundColor: "transparent" },
});
