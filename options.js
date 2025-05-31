const input = document.getElementById("access-token");
const status = document.getElementById("status");

// Load token
chrome.storage.sync.get(["dhanAccessToken"], (result) => {
  if (result.dhanAccessToken) input.value = result.dhanAccessToken;
});

document.getElementById("save-btn").addEventListener("click", () => {
  const token = input.value.trim();
  chrome.storage.sync.set({ dhanAccessToken: token }, () => {
    status.textContent = "Saved!";
    setTimeout(() => (status.textContent = ""), 1500);
  });
});
