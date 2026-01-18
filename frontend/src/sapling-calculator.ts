export function initSaplingCalculator() {
  const select = document.getElementById(
    "farmerId"
  ) as HTMLSelectElement | null;
  const btn = document.getElementById("computeBtn") as HTMLButtonElement | null;
  const fileInput = document.getElementById(
    "saplingFile"
  ) as HTMLInputElement | null;
  const maxBytes = 5 * 1024 * 1024;
  if (!btn) return;
  btn.addEventListener("click", () => {
    const id = select?.value ?? "";
    alert(`Computing sapling needs for Farmer ${id}`);
    const footer = document.querySelector(".site-footer") as HTMLElement | null;
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  });
  if (fileInput) {
    fileInput.addEventListener("change", () => {
      const f = fileInput.files?.[0];
      if (!f) return;
      if (f.size > maxBytes) {
        alert("File too large. Please upload a file under 5 MB.");
        fileInput.value = "";
        return;
      }
      const allowed = [".csv", ".xlsx"];
      const ok = allowed.some(ext => f.name.toLowerCase().endsWith(ext));
      if (!ok) {
        alert("Unsupported format. Use .csv or .xlsx");
        fileInput.value = "";
      }
    });
  }
}
