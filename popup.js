document.getElementById("settings-btn").addEventListener("click", () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
});

function renderPositions(open, closed, netPnl) {
  const pnlElem = document.getElementById("net-pnl");
  let pnlValue = 0;
  if (typeof netPnl === "string") {
    pnlValue = Number(netPnl.replace(/[^\d.-]/g, ""));
  } else if (typeof netPnl === "number") {
    pnlValue = netPnl;
  }
  pnlElem.classList.remove("positive", "negative");
  if (pnlValue > 0) {
    pnlElem.classList.add("positive");
    pnlElem.textContent = "+" + netPnl;
  } else if (pnlValue < 0) {
    pnlElem.classList.add("negative");
    pnlElem.textContent = netPnl;
  } else {
    pnlElem.textContent = netPnl;
  }
  const openList = document.getElementById("open-positions");
  const closedList = document.getElementById("closed-positions");
  openList.innerHTML = "";
  closedList.innerHTML = "";
  open.forEach((pos) => {
    const li = document.createElement("li");
    li.textContent = `${pos.tradingSymbol}: Qty ${pos.netQty}, P&L ₹${(
      pos.realizedProfit + pos.unrealizedProfit
    ).toFixed(2)}`;
    openList.appendChild(li);
  });
  closed.forEach((pos) => {
    const li = document.createElement("li");
    li.textContent = `${
      pos.tradingSymbol
    }: Realized P&L ₹${pos.realizedProfit.toFixed(2)}`;
    closedList.appendChild(li);
  });
}

function fetchAndRenderPositions() {
  console.log("Fetching positions...");
  chrome.runtime.sendMessage({ type: "GET_POSITIONS" }, (resp) => {
    console.log("API response:", resp);
    if (resp && resp.success) {
      renderPositions(resp.openPositions, resp.closedPositions, resp.netPnl);
    } else {
      document.getElementById("net-pnl").textContent = "Error";
    }
  });
}

document
  .getElementById("reload-btn")
  .addEventListener("click", fetchAndRenderPositions);

fetchAndRenderPositions();
