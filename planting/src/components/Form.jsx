import React, { useState } from "react";
import styles from "./Form.module.css";

function Form() {
  const [farmerName, setFarmerName] = useState("");

  const handleRecommendationSubmit = (e) => {
    e.preventDefault();
    alert(`Generating report for: ${farmerName}`);
    // Later: API integration to fill pH, Soil, Rain, Temp, Alt
  };

  const handleSaplingSubmit = (e) => {
    e.preventDefault();
    alert("Computing sapling needs...");
    // Later: Add file processing logic
  };

  return (
    <div className={styles.container}>
      {/* --- Farm Species Recommendation Form --- */}
      <div className={styles.card}>
        <h1>Farm Species Recommendation</h1>
        <form onSubmit={handleRecommendationSubmit} className={styles.form}>
          <label>Farmer Name</label>
          <input
            type="text"
            value={farmerName}
            onChange={(e) => setFarmerName(e.target.value)}
            placeholder="Enter farmer name"
            required
          />

          <label>pH</label>
          <input type="text" placeholder="" disabled />

          <label>Soil</label>
          <input type="text" placeholder="" disabled />

          <label>Rain (mm)</label>
          <input type="text" placeholder="" disabled />

          <label>Temp (°C)</label>
          <input type="text" placeholder="" disabled />

          <label>Alt (m)</label>
          <input type="text" placeholder="" disabled />

          <label>NVDI (Distance to the coastal)</label>
          <input type="text" placeholder="" disabled />

          <button type="submit">Generate Report</button>
        </form>
      </div>

      {/* --- Bulk Sapling Calculator Form --- */}
      <div className={styles.card}>
        <h1>Bulk Sapling Calculator</h1>
        <form onSubmit={handleSaplingSubmit} className={styles.form}>
          <label>Upload CSV/Excel File</label>
          <input type="file" className={styles.fileInput} required />
          <button className={styles.formbtn} type="submit">
            Compute Sapling Needs
          </button>
        </form>
      </div>
    </div>
  );
}

export default Form;
