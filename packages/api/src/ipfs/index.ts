
const API = "http://127.0.0.1:5001/api/v0";

export const pinDb = async () => {
  try {
    const formData = new FormData();
    const file = Bun.file("./src/db_files/juicebox.db");
    formData.append("file", file);
    const res = await fetch(`${API}/add`, {
      method: "POST",
      body: formData,
    });
    const data = await res.text();
    const items = data.trim().split("\n").map((item) => JSON.parse(item));
    return items;
  } catch (err) {
    return Promise.reject(err);
  }
};
