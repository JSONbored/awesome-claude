export type ListingLeadPayload = {
  kind: "job" | "tool" | "claim";
  tierInterest?: "free" | "standard" | "featured" | "sponsored";
  contactName: string;
  contactEmail: string;
  companyName: string;
  listingTitle: string;
  websiteUrl?: string;
  applyUrl?: string;
  message?: string;
};

export async function submitListingLead(payload: ListingLeadPayload) {
  const response = await fetch("/api/listing-leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Lead intake returned ${response.status}`);
  }
  return response;
}
