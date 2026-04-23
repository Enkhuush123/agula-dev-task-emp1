const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const CLAIMS_PATH = path.join(__dirname, "..", "claims.csv");
const REPORT_PATH = path.join(__dirname, "..", "report.json");

function toMonthKey(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function round(value, digits = 2) {
  return Number(value.toFixed(digits));
}

function parseClaimAmount(rawAmount) {
  const amount = Number(rawAmount);
  return Number.isFinite(amount) ? amount : 0;
}

function analyzeClaims() {
  return new Promise((resolve, reject) => {
    const byType = {};
    const byMonth = {};

    let totalClaims = 0;
    let approvedClaims = 0;

    if (!fs.existsSync(CLAIMS_PATH)) {
      reject(new Error(`claims.csv not found at ${CLAIMS_PATH}`));
      return;
    }

    fs.createReadStream(CLAIMS_PATH)
      .pipe(csv())
      .on("data", (row) => {
        totalClaims += 1;

        const policyType = String(row.policy_type || "").trim().toLowerCase();
        const status = String(row.status || "").trim().toLowerCase();
        const claimAmount = parseClaimAmount(row.claim_amount);
        const monthKey = toMonthKey(row.claim_date);

        if (!byType[policyType]) {
          byType[policyType] = {
            claim_count: 0,
            total_claim_amount: 0,
            approved_claim_amount: 0,
          };
        }

        byType[policyType].claim_count += 1;
        byType[policyType].total_claim_amount += claimAmount;

        if (status === "approved") {
          approvedClaims += 1;
          byType[policyType].approved_claim_amount += claimAmount;
        }

        if (monthKey) {
          byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;
        }
      })
      .on("end", () => {
        const approvedPercentage =
          totalClaims === 0 ? 0 : round((approvedClaims / totalClaims) * 100);

        const averageClaimAmountByType = Object.fromEntries(
          Object.entries(byType).map(([type, stats]) => {
            const average =
              stats.claim_count === 0
                ? 0
                : round(stats.total_claim_amount / stats.claim_count);
            return [type, average];
          }),
        );

        const topMonths = Object.entries(byMonth)
          .sort((a, b) => {
            if (b[1] !== a[1]) return b[1] - a[1];
            return a[0].localeCompare(b[0]);
          })
          .slice(0, 3)
          .map(([month, claim_count]) => ({ month, claim_count }));

        // claims.csv contains no explicit policy amount column, so this is
        // a claim-based loss ratio proxy by policy type.
        const lossRatioByType = Object.fromEntries(
          Object.entries(byType).map(([type, stats]) => {
            const ratio =
              stats.total_claim_amount === 0
                ? 0
                : round(
                    stats.approved_claim_amount / stats.total_claim_amount,
                    4,
                  );

            return [
              type,
              {
                approved_claim_amount: round(stats.approved_claim_amount),
                total_claim_amount: round(stats.total_claim_amount),
                loss_ratio_proxy: ratio,
              },
            ];
          }),
        );

        const report = {
          generated_at: new Date().toISOString(),
          input_file: "claims.csv",
          summary: {
            total_claim_count: totalClaims,
            approved_claim_count: approvedClaims,
            approved_percentage: approvedPercentage,
          },
          average_claim_amount_by_policy_type: averageClaimAmountByType,
          top_3_months_by_claim_count: topMonths,
          loss_ratio_by_policy_type: lossRatioByType,
          notes: [
            "loss_ratio_proxy = approved_claim_amount / total_claim_amount",
            "claims.csv дээр policy amount багана байхгүй тул proxy ratio ашигласан.",
          ],
        };

        fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");
        resolve(report);
      })
      .on("error", (error) => reject(error));
  });
}

analyzeClaims()
  .then((report) => {
    console.log("Claims analysis completed.");
    console.log(
      `Total claims: ${report.summary.total_claim_count}, approved: ${report.summary.approved_percentage}%`,
    );
    console.log(`Report saved to: ${REPORT_PATH}`);
  })
  .catch((error) => {
    console.error("Failed to analyze claims.", error.message);
    process.exit(1);
  });
