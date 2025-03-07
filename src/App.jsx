import React, { useState } from 'react';

function SummarizerApp() {
  const [inputType, setInputType] = useState("youtube");
  const [textInput, setTextInput] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputTypeChange = (e) => {
    setInputType(e.target.value);
    setTextInput("");
    setFileInput(null);
    setSummary("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSummary("");

    const endpoint = "https://be5c-34-118-242-81.ngrok-free.app/summarize"; // Replace with your actual ngrok URL

    try {
      let response;
      if (inputType === "youtube" || inputType === "text") {
        // Send as JSON
        response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input_type: inputType,
            input_source: textInput,
          }),
        });
      } else if (inputType === "pdf" || inputType === "docx") {
        // Send as multipart/form-data
        const formData = new FormData();
        formData.append("file", fileInput);
        formData.append("input_type", inputType);
        response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });
      }
      const data = await response.json();
      console.log("Received data:", data);
      if (data.final_summary && data.final_summary.trim() !== "") {
        setSummary(data.final_summary);
      } else {
        setErrorMsg("No summary received.");
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
      setErrorMsg("Error fetching summary. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Multi-Source Summarizer</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Select Input Type:{" "}
            <select value={inputType} onChange={handleInputTypeChange}>
              <option value="youtube">YouTube</option>
              <option value="pdf">PDF</option>
              <option value="docx">DOCX</option>
              <option value="text">Text</option>
            </select>
          </label>
        </div>
        <br />
        {inputType === "youtube" || inputType === "text" ? (
          <div>
            <label>
              {inputType === "youtube" ? "YouTube URL:" : "Text:"}{" "}
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={
                  inputType === "youtube"
                    ? "Enter YouTube URL"
                    : "Enter raw text"
                }
                style={{ width: "400px", padding: "10px", fontSize: "16px" }}
                required
              />
            </label>
          </div>
        ) : (
          <div>
            <label>
              Upload {inputType.toUpperCase()} File:{" "}
              <input
                type="file"
                onChange={(e) => setFileInput(e.target.files[0])}
                accept={inputType === "pdf" ? ".pdf" : ".docx"}
                required
              />
            </label>
          </div>
        )}
        <br />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Summarize
        </button>
      </form>
      {loading && <p>Loading summary...</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {summary && (
        <div style={{ marginTop: "20px", textAlign: "left", maxWidth: "800px" }}>
          <h2>Final Summary:</h2>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "yellow",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {summary}
          </pre>
        </div>
      )}
    </div>
  );
}

export default SummarizerApp;
