async function fetchPositions(token) {
  if (token === "FAKE") {
    // Return mocked data for demo/screenshot
    return [
      {
        tradingSymbol: "NIFTY 29 MAY 25000 CE",
        netQty: 75,
        realizedProfit: 1200.5,
        unrealizedProfit: 350.0,
      },
      {
        tradingSymbol: "INDIGO JUN FUT",
        netQty: 0,
        realizedProfit: -800.0,
        unrealizedProfit: 0,
      },
      {
        tradingSymbol: "RELIANCE",
        netQty: 10,
        realizedProfit: 200.0,
        unrealizedProfit: 150.0,
      },
      {
        tradingSymbol: "TCS",
        netQty: 0,
        realizedProfit: 500.0,
        unrealizedProfit: 0,
      },
    ];
  }
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
