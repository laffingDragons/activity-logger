import Papa from "papaparse";

export function exportToCSV(logs, categories) {
  const logCSV = Papa.unparse(logs);
  const categoryCSV = Papa.unparse(
    categories.flatMap((cat) =>
      cat.subcategories.map((sub) => ({ category: cat.name, subcategory: sub.name }))
    )
  );

  const logBlob = new Blob([logCSV], { type: "text/csv" });
  const categoryBlob = new Blob([categoryCSV], { type: "text/csv" });

  const logUrl = URL.createObjectURL(logBlob);
  const categoryUrl = URL.createObjectURL(categoryBlob);

  const logLink = document.createElement("a");
  logLink.href = logUrl;
  logLink.download = "logs.csv";
  logLink.click();

  const categoryLink = document.createElement("a");
  categoryLink.href = categoryUrl;
  categoryLink.download = "categories.csv";
  categoryLink.click();
}

export function importFromCSV(file, callback) {
  Papa.parse(file, {
    header: true,
    complete: (result) => {
      callback(result.data);
    },
  });
}