import { ToastContainer, toast as toastifyToast } from "react-toastify";
import toast, { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import Modal from "react-modal";
import Icon from "./image.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./upload.css";


Modal.setAppElement("#root");

const precautions = {
  Atelectasis:
    "Atelectasis is a condition where part or all of a lung collapses or fails to inflate properly, leading to reduced or absent gas exchange in the affected lung tissue. It occurs when the alveoli, the tiny air sacs within the lungs, become deflated.\nHere are the common treatment approaches: \nOption 1: Chest Physiotherapy (CPT) \nOption 2: Positive Pressure Therapies \nOption 3: Bronchoscopy and other.\nMoreover you can consult with Doctor for better treatment.\n",
  Cardiomegaly:
    "Cardiomegaly, commonly referred to as an enlarged heart, is a medical condition where the heart is abnormally large due to various underlying health issues. It sign of a condition that causes the heart to work harder than normal.\nDiagnosing cardiomegaly involves several steps, including physical examination, imaging studies, and other tests: \nOption 1: Clinical Evaluation \nOption 2: Imaging Studies \nOption 3: Blood Tests and other.\nMoreover you can consult with Doctor for better treatment.\n",
  Effusion:
    "Effusion refers to the abnormal accumulation of fluid within a body cavity. While there are different types of effusions depending on where the fluid accumulates, one of the most common and clinically significant forms is pleural effusion.\nDiagnosing effusion involves several steps to determine the type, cause, and extent of the fluid accumulation: \nOption 1: Clinical Evaluation \nOption 2: Thoracentesis \nOption 3: Biopsy and other. \nMoreover you can consult with Doctor for better treatment.\n",
};

export default function Upload() {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      toast.error("No file selected.");
      return;
    }

    const validTypes = ["image/jpg", "image/jpeg", "image/png"];
    if (validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
      toast.success("File type is valid.");
    } else {
      setFile(null);
      setFilePreview(null);
      toast.error("Invalid file type. Please select a JPG or PNG image.");
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("No file selected for upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8001/predict/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch predictions: ${errorData.detail}`);
      }

      const data = await response.json();
      setPredictions(data);
      setError(null);

      if (data.disease_predictions !== "N/A") {
        toast.success(`Predicted Class: ${data.predicted_class}`);
      } else {
        toastifyToast.error(
          "No Disease Predictions Available for Non X-Ray Images."
        );
      }

      // Open modal to show predictions
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error during prediction:", error);
      setError(error.message);
      setPredictions(null);
      toast.error("Error uploading file");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const downloadAsPDF = () => {
    const element = document.getElementById("results-only");
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;

      const imgWidth = 350;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let yOffset = 10;
      const xOffset = (pageWidth - imgWidth) / 2;

      pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);
      yOffset += imgHeight + 8;

      const tableData = Object.keys(predictions.disease_predictions)
        .filter((key) => predictions.disease_predictions[key] >= 0.3)
        .map((key) => [
          key,
          `${(predictions.disease_predictions[key] * 100).toFixed(0)}%`,
          precautions[key] || "No specific precautions available.",
        ]);

      pdf.autoTable({
        head: [["Disease", "Probability", "Precautions"]],
        body: tableData,
        startY: yOffset,
        margin: { top: yOffset },
        styles: { fontSize: 10 },
        theme: "grid",
        didDrawPage: function(data) {
          const footerText = "Report Generated by DiagnoTechHub";
          pdf.setFontSize(7);
          const footerHeight = 8;
          const footerTextWidth = pdf.getTextWidth(footerText);
          const footerX = (pageWidth - footerTextWidth) / 2;
          pdf.text(footerText, footerX, pageHeight - footerHeight);
        },
      });

      pdf.save("Report.pdf");
    });
  };

  return (
    <div id="upload-page">
      <Toaster position="top-center" reverseOrder={false} />
      <ToastContainer position="top-center" />

      <div id="log-btn">
        <div id="logout">
          <h4>
            <Link to="/" className="lg-btn" onClick={handleLogout}>
              Log Out
            </Link>
          </h4>
        </div>
      </div>

      {/* <div id="cirle-img"></div> */}

      <div id="text">
        <h1>Upload Chest X-Ray Image</h1>
      </div>

      <div id="effect"></div>

      <div id="upload-tag">
        <label className="file">
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            hidden
            onChange={handleFileChange}
          />
          <div className="icon">
            <img src={Icon} alt="Upload icon" />
          </div>
        </label>
      </div>

      {file && (
        <div id="upload-button-container">
          <button onClick={handleFileUpload}>Analyze</button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Predictions"
        className="modal"
        overlayClassName="overlay"
      >
        <div style={{ position: "relative" }} id="result-page">
          <div id="results-only">
            <h2>Report</h2>
            {filePreview && (
              <div>
                <img src={filePreview} alt="Uploaded" className="input-image" />
              </div>
            )}
            {predictions && predictions.disease_predictions !== "N/A" ? (
              Object.keys(predictions.disease_predictions).includes("Normal") &&
              predictions.disease_predictions["Normal"] >= 0.3 ? (
                <p className="predict-text">
                  No disease found from (Atelectasis, Cardiomegaly, pleural
                  Effusion)
                </p>
              ) : (
                <p className="predict-text">
                  Disease Detected:{" "}
                  {Object.keys(predictions.disease_predictions)
                    .filter(
                      (key) => predictions.disease_predictions[key] >= 0.2
                    )
                    .map(
                      (key) =>
                        `${key} (${(
                          predictions.disease_predictions[key] * 100
                        ).toFixed(1)}%)`
                    )
                    .join(", ")}
                </p>
              )
            ) : (
              <p className="Non-XRay">Please Select X-Ray Image.</p>
            )}
          </div>

          <button className="close-button" onClick={closeModal}>
            <span className="X"></span>
            <span className="Y"></span>
            <div className="close">Close</div>
          </button>

          {predictions && predictions.disease_predictions !== "N/A" && (
            <div className="download-buttons">
              <button
                className="download-button"
                type="button"
                onClick={downloadAsPDF}
              >
                <span className="download-button_text">Download</span>
                <span className="download-button_icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 35 35"
                    id="bdd05811-e15d-428c-bb53-8661459f9307"
                    data-name="Layer 2"
                    className="svg"
                  >
                    <path d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path>
                    <path d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path>
                    <path d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path>
                  </svg>
                </span>
              </button>
            </div>
          )}
        </div>
      </Modal>

      <div id="video-container">
        <video autoPlay loop muted>
          <source
            src={`${process.env.PUBLIC_URL}/Visual.mp4`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
