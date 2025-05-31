async function fetchPositions(token) {
  const resp = await fetch("http://localhost:3001/positions", {
    headers: {
      "Content-Type": "application/json",
      "access-token": token,
    },
  });
  if (!resp.ok) throw new Error("API error");
  return resp.json();
}

function splitPositions(positions) {
  const open = [],
    closed = [];
  let netPnl = 0;
  positions.forEach((pos) => {
    const realized = Number(pos.realizedProfit) || 0;
    const unrealized = Number(pos.unrealizedProfit) || 0;
    if ((Number(pos.netQty) || 0) !== 0) {
      open.push(pos);
      netPnl += realized + unrealized;
    } else {
      closed.push(pos);
      netPnl += realized;
    }
  });
  return { open, closed, netPnl: `₹${netPnl.toFixed(2)}` };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_POSITIONS") {
    chrome.storage.sync.get(["dhanAccessToken"], async (result) => {
      const token = result.dhanAccessToken;
      if (!token) {
        console.log("No token found");
        return sendResponse({ success: false, error: "No token" });
      }
      try {
        const positions = await fetchPositions(token);
        console.log("Fetched positions:", positions);
        const { open, closed, netPnl } = splitPositions(positions);
        sendResponse({
          success: true,
          openPositions: open,
          closedPositions: closed,
          netPnl,
        });
      } catch (e) {
        console.error("Error fetching positions:", e);
        sendResponse({ success: false, error: e.message });
      }
    });
    return true; // async
  }
});
