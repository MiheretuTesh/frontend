async function getData() {
  const options: RequestInit = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  try {
    const response = await fetch(
      "https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete",
      options
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function getApiData() {
  const data = await getData();
  return data;
}
