import React from "react";

function CanvaEmbed() {
  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 0,
          paddingTop: "56.25%",
          paddingBottom: 0,
          boxShadow: "0 2px 8px 0 rgba(63,69,81,0.16)",
          marginTop: "1.6em",
          marginBottom: "0.9em",
          overflow: "hidden",
          borderRadius: "8px",
          willChange: "transform",
        }}
      >
        <iframe
          loading="lazy"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            border: "none",
            padding: 0,
            margin: 0,
          }}
          src="https://www.canva.com/design/DAHDDgpOAfY/haQjDMDumvJt58d5lfiVwA/view?embed"
          allowFullScreen
          allow="fullscreen"
          title="Canva Presentation"
        />
      </div>
      <a
        href="https://www.canva.com/design/DAHDDgpOAfY/haQjDMDumvJt58d5lfiVwA/view?utm_content=DAHDDgpOAfY&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
        target="_blank"
        rel="noopener noreferrer"
      >
        Yellow Colorful Bright The Importance of Education Presentation
      </a>{" "}
      by Andz Rivero
    </>
  );
}

export default CanvaEmbed;
