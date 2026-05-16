import { useState, useEffect, useCallback } from "react";

// ============================================================
// SIMA LOGISTICS — Transport & Logistics Consultancy, Abuja
// ============================================================

const BRAND = {
  primary: "#1E1E1E",
  accent: "#E86A2C",
  accentHover: "#D45A20",
  light: "#F5F0EB",
  white: "#FFFFFF",
  dark: "#141414",
  grey: "#7A756D",
  greyLight: "#B5B0A8",
  success: "#2ECC71",
  surface: "#F5F0EB",
};

// Blog article generation via Claude API
async function generateBlogArticle(topic) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `You are a senior editorial writer for SIMA Logistics (simalogistics.ng), a transport, freight, and logistics consultancy headquartered in Abuja, Nigeria. Write an authoritative, data-rich blog article about: "${topic}".

Requirements:
- Write 6-8 substantial paragraphs with real-world statistics, figures, and data points (e.g. "Nigeria's logistics sector is valued at over $6 billion", "AfCFTA could boost intra-African trade by 52%")
- Reference specific countries, cities, companies, ports, corridors, and infrastructure projects by name
- Cover both Nigerian/African and international perspectives where relevant
- Use a professional but accessible tone suitable for business owners, logistics managers, and industry professionals
- Include practical takeaways or implications for businesses operating in Nigeria
- Reference recent developments, policy changes, or industry trends from 2024-2026

Return ONLY valid JSON with no markdown backticks or other text. Format:
{"title":"Compelling headline","excerpt":"2-3 sentence summary with a key stat","body":"Full article in HTML using <p> tags and <h3> subheadings. Include specific numbers, company names, route names, and policy references.","image":"A relevant Unsplash image URL in format https://images.unsplash.com/photo-XXXXX?w=900&q=80 — pick a real photo ID related to the topic such as logistics, trucks, shipping, ports, trains, planes, Africa, delivery, warehouse, cargo","category":"One of: Freight, Aviation, Rail, Shipping, Last-Mile, Industry News","readTime":"X min read","tags":["tag1","tag2","tag3"]}`,
          },
        ],
      }),
    });
    const data = await response.json();
    const text = data.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (e) {
    console.error("Blog generation error:", e);
    return null;
  }
}

// Preloaded blog articles for immediate display
const SEED_ARTICLES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=80",
    title: "Nigeria's $6 Billion Logistics Sector: Where the Opportunities Are in 2026",
    excerpt: "With logistics costs accounting for up to 70% of commodity prices in Africa versus 6% in the US, the push to digitise and optimise Nigeria's supply chain is creating billion-dollar opportunities.",
    body: `<p>Nigeria's transportation sector was valued at approximately $6 billion in 2016 by MarketLine, and has grown substantially since. Yet the inefficiencies remain staggering — logistics costs in Africa can represent up to 70% of final commodity prices, compared to just 6% in the United States and roughly 12% in Europe. This gap represents both a massive burden on Nigerian businesses and an enormous opportunity for those who can close it.</p><h3>The Digital Freight Revolution</h3><p>Platforms like Kobo360, which raised $79 million before facing restructuring challenges, demonstrated that demand for digital freight matching in Nigeria is real. The company connected over 50,000 truck owners with major clients including Unilever, Dangote, and Nestlé. While Kobo360's working capital model proved unsustainable — paying drivers upfront while waiting 30-90 days for corporate payments — the underlying market need hasn't gone away. New entrants are learning from these lessons.</p><h3>The AfCFTA Catalyst</h3><p>The African Continental Free Trade Area, signed by all 54 African Union member states, aims to eliminate tariffs on 90% of goods and could boost intra-African trade by 52% by 2030, according to the UN Economic Commission for Africa. For Nigerian logistics operators, this means growing cross-border volumes along corridors to Ghana, Cameroon, Niger, and beyond. Companies that can handle multi-country documentation and customs clearance digitally will capture the lion's share.</p><h3>Where the Smart Money Is Going</h3><p>Investment is flowing into three areas: last-mile delivery (driven by e-commerce growth projected to reach $29 billion), cold chain logistics (pharmaceuticals and perishables), and freight technology platforms. The African Development Bank estimates that widespread adoption of digital logistics platforms could reduce freight costs by 15-20% across the continent. For businesses in Abuja and across the FCT, the message is clear — those who embrace digital logistics tools now will have a significant cost advantage within 2-3 years.</p>`,
    category: "Industry News",
    readTime: "6 min read",
    tags: ["Nigeria", "Logistics Market", "Investment"],
    date: "2026-05-15",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&q=80",
    title: "Apapa Port Congestion: How Smart Routing Is Saving Shippers Millions",
    excerpt: "Lagos ports handle over 75% of Nigeria's maritime trade, but chronic congestion at Apapa and Tin Can Island costs the economy an estimated $19 billion annually. Here's how businesses are fighting back.",
    body: `<p>The Lagos Chamber of Commerce estimated in 2018 that Nigeria loses $19 billion annually due to red tape, delays, and corruption at its ports. While improvements have been made since, Apapa and Tin Can Island ports continue to experience significant congestion, with trucks sometimes waiting 5-7 days for cargo clearance. For businesses importing raw materials or exporting finished goods, these delays directly impact profitability.</p><h3>The Root Causes</h3><p>Port congestion in Lagos stems from multiple factors: inadequate road infrastructure connecting the ports to the hinterland, insufficient rail connectivity, manual documentation processes, and the concentration of over 75% of Nigeria's maritime trade through Lagos alone. The Lekki Deep Sea Port, which began operations in 2024, was designed to relieve some of this pressure, but uptake has been gradual.</p><h3>Digital Solutions Making a Difference</h3><p>Rwanda's paperless trade system, implemented in 2021, cut import clearance time from five days to under 24 hours, according to UNCTAD. Nigeria's own Single Window initiative — SIGMAT — is working toward similar efficiency gains. Companies like OnePort365 are digitising freight booking, documentation, and tracking for containerised cargo, reportedly reducing the back-and-forth paperwork that contributes to delays.</p><h3>Practical Steps for Nigerian Businesses</h3><p>For businesses in Abuja and northern Nigeria, diversifying port entry points is becoming essential. The Onne Port in Rivers State and the developing dry ports in Kaduna and Kano offer alternatives to Lagos. Working with experienced freight consultants who understand these options can save weeks of transit time and significant cost. The businesses that treat logistics as a strategic function — not an afterthought — are the ones seeing the biggest savings.</p>`,
    category: "Shipping",
    readTime: "5 min read",
    tags: ["Ports", "Apapa", "Maritime"],
    date: "2026-05-13",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=900&q=80",
    title: "The Lagos-Kano Rail Line: What It Means for Nigerian Freight",
    excerpt: "With over 90% of Nigeria's freight moving by road, the modernisation of the railway network promises to transform how goods move — cutting costs per tonne-kilometre by up to 60%.",
    body: `<p>Nigeria's railway infrastructure is undergoing its most significant transformation in decades. The standard gauge railway programme, connecting Lagos to Kano via Ibadan and Abuja, represents a potential game-changer for a country where over 90% of freight currently moves by road. Rail transport can move bulk goods at roughly 40% of the cost per tonne-kilometre compared to road haulage.</p><h3>What's Operational Now</h3><p>The Abuja-Kaduna rail line has been operational since 2016, demonstrating the viability of modern rail in Nigeria. The Lagos-Ibadan line followed, handling both passenger and limited cargo services. The extension from Ibadan to Kano, passing through Osogbo, Ilorin, Minna, and Abuja, is at various stages of completion. When fully operational, it will create a 1,100km freight corridor connecting Nigeria's largest port city to its commercial north.</p><h3>The Intermodal Opportunity</h3><p>For logistics businesses, rail doesn't replace road — it complements it. The most efficient model, proven in markets like South Africa and Kenya, combines rail for long-distance trunk movement with road transport for last-mile delivery. Dry ports in Kaduna and Kano are being developed precisely to enable this — containers arrive by rail, then transfer to trucks for final delivery. Companies positioned at these intermodal points will capture significant value.</p><h3>Impact on Abuja Businesses</h3><p>For businesses operating from the FCT, the rail connection has specific implications. Abuja sits on the Lagos-Kano corridor, meaning direct rail access for bulk inputs and finished goods. Construction materials, FMCG products, and agricultural commodities are the most likely early beneficiaries. Forward-thinking logistics providers are already mapping their service offerings around the new rail infrastructure.</p>`,
    category: "Rail",
    readTime: "5 min read",
    tags: ["Rail", "Infrastructure", "Lagos-Kano"],
    date: "2026-05-11",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=900&q=80",
    title: "Air Cargo in West Africa: Nigeria's Airports as Regional Freight Hubs",
    excerpt: "Nigerian airports handled over 200,000 tonnes of cargo in 2023, but capacity utilisation remains below potential. New investments and route expansions are changing the picture.",
    body: `<p>Air cargo remains the fastest-growing segment of African logistics, driven by e-commerce expansion, pharmaceutical distribution, and time-sensitive manufacturing supply chains. Nigeria's Murtala Muhammed International Airport in Lagos and Nnamdi Azikiwe International Airport in Abuja serve as the primary cargo gateways, with Ethiopian Airlines, Emirates SkyCargo, and Turkish Cargo operating regular freight services.</p><h3>The E-Commerce Driver</h3><p>Nigeria's e-commerce sector is projected to reach $29 billion, and consumers increasingly expect 2-3 day delivery windows — even for goods sourced internationally. This is driving demand for air cargo capacity, particularly for high-value, low-weight goods like electronics, fashion, and pharmaceuticals. Amazon's 2024 entry into South Africa has set new delivery expectations that are rippling across the continent.</p><h3>Cold Chain and Pharma</h3><p>The pharmaceutical air freight segment has grown significantly post-COVID, with IAG Cargo partnering with SkyCell in January 2025 to deploy specialised temperature-controlled containers for African pharmaceutical lanes. For Nigerian importers of vaccines, biologics, and temperature-sensitive medicines, reliable cold chain air cargo is becoming a competitive necessity rather than a luxury.</p><h3>The Ground Connection</h3><p>For logistics operators based in Abuja, the real opportunity often lies in the ground segment — pickup from and delivery to air cargo terminals, customs facilitation, and warehousing. A shipment's journey doesn't end at the airport, and the last-mile connection between cargo terminal and final destination is where local logistics expertise adds the most value. Companies offering seamless airport-to-door services are finding strong demand from both corporate clients and e-commerce platforms.</p>`,
    category: "Aviation",
    readTime: "5 min read",
    tags: ["Aviation", "Air Cargo", "E-Commerce"],
    date: "2026-05-09",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&q=80",
    title: "Goods-in-Transit Insurance: Why Nigerian Businesses Can't Afford to Skip It",
    excerpt: "With armed robbery, road accidents, and cargo theft costing Nigerian businesses billions annually, GIT insurance is moving from optional to essential — and new insurtech platforms are making it accessible.",
    body: `<p>Every day, millions of naira worth of goods travel Nigerian roads uninsured. When a truck carrying ₦10 million in electronics overturns on the Abuja-Lokoja highway, or a delivery van is hijacked on the Sagamu interchange, the financial loss falls entirely on the business owner. Goods-in-Transit (GIT) insurance exists precisely to prevent this — yet adoption among Nigerian SMEs remains remarkably low.</p><h3>What GIT Insurance Covers</h3><p>A standard all-risks GIT policy in Nigeria covers accidental loss or damage during transit, including road accidents, fire, theft, and armed robbery. Most policies from insurers like Leadway Assurance and Standard Alliance cover goods moving by road, rail, and air within Nigeria. Premiums typically range from 0.5% to 1.5% of the declared goods value — meaning ₦500,000 worth of cargo can be insured for as little as ₦2,500 to ₦7,500.</p><h3>The Embedded Insurance Revolution</h3><p>Nigerian insurtech company Octamile, founded in 2021, is changing how logistics businesses access GIT insurance. Through API integration, platforms like Gokada, Peng Logistics, and Messenger.ng now offer insurance at the point of booking — no separate broker visit required. Peng Logistics even includes free GIT coverage up to ₦100,000 on every interstate delivery. This embedded model is exactly how insurance penetration will grow in Nigeria's logistics sector.</p><h3>When to Insure</h3><p>For everyday low-value deliveries within Abuja — a ₦5,000 food delivery or ₦15,000 market run — the risk may be acceptable without insurance. But for construction materials, event equipment, electronics, bulk goods, or anything moving interstate, GIT insurance should be standard practice. Large retailers, multinationals, and government procurement frameworks increasingly require suppliers to carry GIT cover as a contractual pre-condition. Smart businesses are getting ahead of this curve.</p>`,
    category: "Industry News",
    readTime: "5 min read",
    tags: ["Insurance", "GIT", "Risk Management"],
    date: "2026-05-07",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=900&q=80",
    title: "How AfCFTA Is Reshaping Cross-Border Freight Across Africa",
    excerpt: "The world's largest free trade area by member countries is redrawing trade routes and creating new logistics corridors. Nigerian businesses that prepare now will dominate regional trade.",
    body: `<p>The African Continental Free Trade Area (AfCFTA), operational since January 2021, connects 1.3 billion people across 54 countries in a single market worth an estimated $3.4 trillion in combined GDP. For the logistics sector, it represents the most significant structural shift in African trade in decades. UNCTAD estimates that countries combining tariff reductions with digital customs systems are seeing 22% higher trade growth than those applying tariff relief alone.</p><h3>New Corridors Opening Up</h3><p>Trade volumes along key corridors are growing: Lagos-Accra, Abuja-Douala, and the Trans-Saharan route to Niger and beyond. One-Stop Border Posts, like the Mwami/Mchinji crossing between Zambia and Malawi which cut processing times by 60% in 2024, are proving the model works. Nigeria's SIGMAT system and the ECOWAS Trade Liberalisation Scheme are slowly reducing the friction that has historically made cross-border road freight prohibitively expensive.</p><h3>The Digital Documentation Gap</h3><p>Perhaps the biggest opportunity lies in digital trade facilitation. Rwanda's paperless system slashed clearance from five days to under 24 hours. Nigeria is working toward similar capabilities, but adoption is uneven. Logistics companies that invest in digital documentation — electronic bills of lading, digital customs declarations, and real-time compliance tracking — will move goods faster and cheaper than competitors still relying on paper-based processes.</p><h3>What This Means for Nigerian Exporters</h3><p>Nigeria, as Africa's largest economy, stands to be both the biggest exporter and importer under AfCFTA. For Abuja-based businesses, the corridors west to Ghana and south to Cameroon are the most immediate opportunities. Freight consultants who understand the regulatory requirements of multiple ECOWAS jurisdictions are becoming invaluable partners for businesses looking to expand regionally.</p>`,
    category: "Freight",
    readTime: "6 min read",
    tags: ["AfCFTA", "Cross-Border", "Trade"],
    date: "2026-05-05",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=900&q=80",
    title: "Last-Mile Delivery in Abuja: The $230 Million Opportunity Nobody Is Talking About",
    excerpt: "Nigeria's last-mile delivery market is valued at $230 million and growing fast. But while Lagos gets all the attention, Abuja's FCT market remains dramatically underserved.",
    body: `<p>The Nigeria last-mile delivery market is valued at approximately $230 million, according to Ken Research, with Lagos, Abuja, and Port Harcourt as the dominant cities. E-commerce expansion — projected to reach $29 billion — is the primary driver, with 80% of transactions occurring in urban areas. But here's the gap: while Lagos has Gokada (1,200+ riders), Kwik Delivery (300,000+ merchants), GIG Logistics, Sendbox, and dozens more competing for every delivery, Abuja's market has far fewer digital options despite being Nigeria's political capital with significant purchasing power.</p><h3>What Abuja Needs</h3><p>The FCT's delivery needs are different from Lagos. Government offices, embassies, corporate headquarters, and a rapidly growing residential population in satellites like Gwarinpa, Kubwa, and Lugbe create demand for reliable, professional delivery services. The customer base here tends to be more corporate, more willing to pay for quality, and less price-sensitive than Lagos's hustle-driven market. Yet most Abuja deliveries still happen through informal WhatsApp groups and phone calls to individual riders.</p><h3>The Middle Market Gap</h3><p>Existing platforms serve two extremes well: small parcel dispatch (Kwik, Gokada) and enterprise freight (Kobo360, DHL). But the middle — a caterer moving 50 coolers to an event, a furniture business delivering to a customer in Maitama, a construction supplier sending cement bags to a site in Lugbe — is almost entirely unserved by any digital platform. This middle market represents the biggest near-term opportunity in Abuja logistics.</p><h3>The Digital Infrastructure Advantage</h3><p>Abuja has better road infrastructure than Lagos, more predictable traffic patterns, and a population that's rapidly adopting digital payments. These fundamentals make it an ideal market for a logistics marketplace that can match customers with verified vehicle operators quickly and transparently. The first mover to properly serve this market will have a significant advantage as the FCT continues its rapid growth.</p>`,
    category: "Last-Mile",
    readTime: "6 min read",
    tags: ["Abuja", "Last-Mile", "Market Opportunity"],
    date: "2026-05-03",
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1559511260-66a654ae982a?w=900&q=80",
    title: "DP World's $3 Billion African Bet: What It Means for Nigerian Logistics",
    excerpt: "Dubai-based DP World committed $3 billion to African ports and logistics through 2029. For Nigerian shippers and freight operators, this signals a major upgrade in infrastructure and competition.",
    body: `<p>In June 2024, DP World committed $3 billion to African ports and logistics through 2029, targeting mineral exports and intra-continental trade. This is not charity — it's a calculated bet on Africa's growing trade volumes. DP World already operates in Senegal, Rwanda, Mozambique, Somaliland, and Egypt, and is expanding its corridor strategy to connect ports with inland logistics hubs.</p><h3>The Corridor Approach</h3><p>DP World's strategy goes beyond ports. They're building end-to-end logistics corridors — port operations connected to inland container depots, free trade zones, and digital platforms. This model, already proven in Dubai's Jebel Ali, essentially creates seamless freight highways from ship to final destination. For Nigerian businesses currently navigating fragmented port-to-warehouse chains, this could be transformative.</p><h3>Competition and Opportunity</h3><p>For Nigerian logistics operators, DP World's expansion creates both competition and opportunity. Competition because global operators bring scale, technology, and efficiency that local players struggle to match. Opportunity because improved port infrastructure reduces delays and costs for everyone, and global operators need local partners for last-mile distribution, customs brokerage, and regional knowledge.</p><h3>Implications for Abuja</h3><p>While DP World's investments are primarily coastal, the ripple effects reach inland. Faster port clearance means goods arrive in Abuja sooner. Better infrastructure means lower transport costs from Lagos to the FCT. And the arrival of international logistics standards pushes the entire industry toward greater professionalism, transparency, and digital adoption — trends that benefit forward-thinking local operators.</p>`,
    category: "Shipping",
    readTime: "5 min read",
    tags: ["DP World", "Ports", "Investment"],
    date: "2026-05-01",
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=900&q=80",
    title: "Electric Vehicles in African Delivery: Hype or the Future?",
    excerpt: "From MAX.ng's electric bikes in Lagos to Ampersand's battery-swap stations in Kigali, EV adoption in African logistics is accelerating. But is the infrastructure ready for scale?",
    body: `<p>The conversation around electric vehicles in African logistics has moved from theoretical to practical. MAX.ng, one of Nigeria's largest mobility platforms, has been piloting electric motorcycles for delivery in Lagos. In East Africa, Ampersand operates over 3,000 electric motorcycles across Rwanda and Kenya with a battery-swap model that eliminates charging downtime. The economics are compelling — electric motorcycles can reduce fuel costs by up to 70% compared to petrol equivalents.</p><h3>The Nigerian Context</h3><p>Nigeria's fuel price volatility makes the EV proposition particularly attractive. With petrol averaging ₦700+ per litre in 2025, fuel represents the single largest operating cost for delivery riders and truck operators. Electric alternatives, where available, offer dramatically lower per-kilometre costs. However, Nigeria's electricity grid remains unreliable, making the charging infrastructure a significant hurdle.</p><h3>Battery Swap: The African Solution</h3><p>Rather than waiting hours for vehicles to charge, the battery-swap model — pioneered by Ampersand in Kigali and now expanding — lets riders swap a depleted battery for a full one in under 60 seconds. This solves the range anxiety and downtime problems simultaneously. For last-mile delivery operations running 8-12 hours daily, the ability to swap batteries mid-shift without stopping is a game-changer.</p><h3>What This Means for Nigerian Logistics</h3><p>Full electrification of Nigerian freight is years away — the grid simply can't support it yet. But for urban last-mile delivery in cities like Abuja and Lagos, electric two-wheelers and small vans are becoming viable. Logistics companies that begin building EV capability now — even as a pilot alongside their petrol fleet — will be better positioned as infrastructure improves and fuel costs continue to rise.</p>`,
    category: "Industry News",
    readTime: "5 min read",
    tags: ["Electric Vehicles", "Sustainability", "Innovation"],
    date: "2026-04-28",
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=900&q=80",
    title: "Kenya's SGR vs Nigeria's Rail: Lessons for African Freight",
    excerpt: "Kenya's Standard Gauge Railway moved 5.8 million tonnes of cargo in its first five years. As Nigeria builds its own network, the Kenyan experience offers critical lessons on what works — and what doesn't.",
    body: `<p>Kenya's Standard Gauge Railway (SGR), connecting Mombasa port to Nairobi, has been operational since 2017. By 2022, it had transported over 5.8 million tonnes of cargo, significantly reducing the cost and time of moving goods from East Africa's busiest port to the capital. Transit time dropped from roughly 12 hours by road to 4 hours by rail, with freight costs falling by approximately 30%.</p><h3>What Worked</h3><p>The SGR succeeded in capturing freight volume because Kenya made a deliberate policy decision to direct port cargo to rail. The Kenya Railways Corporation offered competitive pricing and guaranteed schedules that road hauliers couldn't match for bulk cargo. The Nairobi Inland Container Depot created a seamless transfer point where containers move from rail to road for last-mile delivery. This intermodal design was critical.</p><h3>The Cautionary Notes</h3><p>Kenya's SGR also carries lessons in what not to do. The railway's debt burden — approximately $3.6 billion in Chinese loans — has been controversial. The line currently terminates at Naivasha rather than reaching the originally planned Malaba border with Uganda, limiting its regional connectivity. And the forced migration of cargo from road to rail created friction with the trucking industry.</p><h3>Applying This to Nigeria</h3><p>Nigeria's railway modernisation has the potential to be even more impactful than Kenya's, given the country's larger economy and longer distances. The key lessons: invest heavily in intermodal transfer facilities (dry ports), offer competitive pricing that makes rail genuinely cheaper than road, build digital booking systems from day one, and ensure the routes connect to where goods actually need to go. For logistics companies planning around Nigeria's rail future, the Kenyan experience is essential reading.</p>`,
    category: "Rail",
    readTime: "6 min read",
    tags: ["Kenya SGR", "Rail Freight", "Comparison"],
    date: "2026-04-25",
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1616432043562-3671ea2e5242?w=900&q=80",
    title: "The Real Cost of Moving Goods in Nigeria: A Breakdown for Business Owners",
    excerpt: "Fuel, tolls, driver costs, insurance, vehicle maintenance — what does it actually cost to move a load from Lagos to Abuja? We break down the numbers every business owner should know.",
    body: `<p>Understanding the true cost of freight in Nigeria is essential for any business that ships goods. Yet many business owners rely on quotes from transporters without understanding the underlying economics. Here's a realistic breakdown for one of Nigeria's most common routes: Lagos to Abuja, approximately 850km by road.</p><h3>The Cost Components</h3><p>For a standard 30-tonne truck, fuel alone costs approximately ₦250,000-350,000 for the Lagos-Abuja run at current diesel prices. Driver costs (salary plus feeding allowance) add ₦30,000-50,000 per trip. Vehicle depreciation and maintenance contribute roughly ₦40,000-60,000 when amortised across trips. Insurance, if carried, adds ₦15,000-30,000. Then there are the unofficial costs — police checkpoints, community levies, and delays — which transporters estimate at ₦20,000-50,000 per trip. Total: ₦355,000-540,000 per trip, or roughly ₦12,000-18,000 per tonne.</p><h3>Why Prices Vary So Much</h3><p>If you've ever been quoted wildly different prices from different transporters, now you understand why. Fuel efficiency varies between trucks, some drivers know routes that avoid costly checkpoints, insurance may or may not be included, and the return journey matters enormously — a transporter who can find a return load from Abuja to Lagos can offer significantly lower one-way pricing than one driving back empty.</p><h3>How to Reduce Your Logistics Costs</h3><p>Consolidate shipments to fill trucks completely — a half-empty truck costs nearly the same to run as a full one. Use digital platforms that optimise route matching and reduce empty return journeys. Negotiate based on knowledge of actual cost components, not arbitrary quotes. Consider rail for bulk, non-time-sensitive goods once the Lagos-Abuja rail freight service scales up. And always insure high-value cargo — the cost of GIT insurance is trivial compared to losing an entire shipment.</p>`,
    category: "Freight",
    readTime: "5 min read",
    tags: ["Costs", "Lagos-Abuja", "Business Guide"],
    date: "2026-04-22",
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80",
    title: "Abuja Event Logistics: How the Best Event Planners Move Their Equipment",
    excerpt: "Behind every successful conference, wedding, or corporate event in Abuja is a logistics operation most guests never see. Here's how professional event planners manage the moving parts.",
    body: `<p>Abuja hosts thousands of events annually — from international conferences at the ICC to weddings in Maitama, corporate launches in Garki, and cultural festivals across the FCT. Each one involves moving significant amounts of equipment: staging, sound systems, lighting rigs, catering supplies, decor, furniture, generators, and more. The logistics behind these events is a substantial and growing business.</p><h3>The Typical Event Move</h3><p>A mid-sized corporate event might require 2-3 truck trips over 2 days: one for staging and technical equipment (typically 3-5 tonnes), one for catering supplies and decor, and potentially a third for furniture and miscellaneous items. Timing is critical — venue access windows are often limited to specific hours, and setup must be complete before guests arrive. This makes reliable, punctual transport not just important but essential.</p><h3>Common Pain Points</h3><p>Event planners consistently cite three challenges: unreliable transport operators who show up late or not at all, damage to expensive equipment during transit, and difficulty coordinating multiple vehicles and loading teams. The current solution for most Abuja event companies is maintaining a personal network of trusted drivers — but this doesn't scale and offers no protection when things go wrong.</p><h3>The Professional Approach</h3><p>Leading event logistics operators are now using goods-in-transit insurance for high-value equipment, GPS tracking for real-time visibility on deliveries, and professional loading teams who understand how to handle fragile technical gear. For event planners looking to scale their operations, partnering with a logistics provider who understands event-specific requirements — timed deliveries, careful handling, setup-day coordination — can transform their operations and protect their reputation with clients.</p>`,
    category: "Last-Mile",
    readTime: "4 min read",
    tags: ["Events", "Abuja", "Logistics Planning"],
    date: "2026-04-19",
  },
  {
    id: 13,
    image: "https://images.unsplash.com/photo-1524522173746-f628baad3644?w=900&q=80",
    title: "Ethiopia's Airlines, Morocco's Ports, Nigeria's Roads: Who Wins Africa's Logistics Race?",
    excerpt: "Three African countries are taking radically different approaches to becoming continental logistics hubs. Understanding their strategies reveals where Nigeria's real advantages and vulnerabilities lie.",
    body: `<p>The competition to become Africa's dominant logistics hub is playing out across three distinct strategies. Ethiopia has bet on aviation — Ethiopian Airlines is Africa's largest carrier, and Addis Ababa's Bole International Airport serves as the continent's primary air cargo hub. Morocco has invested in maritime infrastructure — the Tanger Med port is now the largest in Africa and the Mediterranean, handling over 7 million TEUs annually. Nigeria has the continent's largest economy and domestic market, but relies predominantly on road transport for internal freight.</p><h3>Ethiopia's Air Cargo Dominance</h3><p>Ethiopian Airlines Cargo handles over 600,000 tonnes annually, connecting 130+ destinations worldwide. The airline's hub-and-spoke model means goods from anywhere in Africa can reach any global destination through Addis Ababa, often faster and cheaper than routing through European hubs. For Nigerian exporters of perishables, fashion, and high-value goods, Ethiopian's cargo services are increasingly competitive alternatives to routing through Lagos or Johannesburg.</p><h3>Morocco's Port Play</h3><p>Tanger Med's success is a masterclass in infrastructure-led strategy. Located at the intersection of Atlantic and Mediterranean shipping routes, it offers connectivity to Europe (15km across the Strait of Gibraltar) and West Africa simultaneously. Morocco has combined this with free trade zones and manufacturing incentives, creating an integrated logistics ecosystem. Nigeria's ports, by contrast, suffer from congestion, aging infrastructure, and bureaucratic complexity.</p><h3>Nigeria's Advantage: Market Size</h3><p>Nigeria's trump card is its 220-million-person domestic market — the largest in Africa. While Ethiopia and Morocco excel at moving goods through their territory, Nigeria generates enormous freight demand internally. The businesses and logistics operators who can efficiently serve this massive domestic market have an advantage no other African country can replicate. The question is whether Nigeria will complement its market size with the infrastructure investments needed to reduce logistics costs to competitive levels.</p>`,
    category: "Industry News",
    readTime: "6 min read",
    tags: ["Africa", "Competition", "Hubs"],
    date: "2026-04-16",
  },
  {
    id: 14,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80",
    title: "Digital Payments Are Transforming Nigerian Trucking — Here's How",
    excerpt: "Most Nigerian truck drivers are unbanked, but mobile money platforms like OPay, Moniepoint, and Paga are changing the economics of haulage by eliminating cash risks and speeding up payments.",
    body: `<p>A defining challenge of Nigerian trucking has always been payment. Most truck drivers — particularly the owner-operators who dominate the industry — are in the unbanked or underbanked segment. They lack credit profiles, many don't hold traditional bank accounts, and the informal nature of their work puts them outside the formal financial system. Yet they handle cargo worth millions of naira daily. This mismatch between financial exclusion and economic activity creates enormous friction.</p><h3>The Cash Problem</h3><p>Traditionally, trucking payments happen in cash — large bundles of naira passed between parties at truck parks, loading bays, and delivery points. This creates three problems: security risk (drivers carrying hundreds of thousands of naira are targets for robbery), payment disputes (no paper trail for cash transactions), and delayed payments (drivers waiting days or weeks while corporates process invoices). Kobo360's KoPay product attempted to solve this by paying drivers immediately through the platform, but the working capital burden ultimately proved unsustainable at scale.</p><h3>Mobile Money Changes the Game</h3><p>The explosion of mobile money in Nigeria — OPay, Moniepoint, Paga, and PalmPay collectively serve tens of millions of users — is creating new possibilities. Drivers can receive payments instantly to their mobile wallets, eliminating the need to carry cash. Shippers can pay through secure, trackable digital channels. And platforms can hold funds in escrow, releasing payment automatically upon delivery confirmation. The infrastructure for cashless trucking now exists — adoption is the remaining challenge.</p><h3>What's Next</h3><p>The convergence of mobile money, GPS tracking, and digital proof-of-delivery creates a payment system where trust is built into the technology rather than relying on personal relationships. For logistics platforms operating in Nigeria, integrating with mobile money providers isn't optional — it's the foundation of a scalable, sustainable business model. The companies getting this right will build the next generation of Nigerian freight infrastructure.</p>`,
    category: "Freight",
    readTime: "5 min read",
    tags: ["Payments", "Mobile Money", "Trucking"],
    date: "2026-04-13",
  },
  {
    id: 15,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80",
    title: "Construction Logistics in Abuja: Moving Materials to the FCT's Building Boom",
    excerpt: "Abuja is one of Africa's fastest-growing cities, with construction activity spanning government projects, residential estates, and commercial developments. The logistics behind this building boom is a story in itself.",
    body: `<p>Abuja's construction sector is one of the most active in West Africa. Government infrastructure projects, residential estate development in areas like Gwarinpa, Life Camp, and Lugbe, and commercial projects along the airport road corridor are driving consistent demand for construction material logistics. Cement, steel reinforcement bars (rebar), granite, sand, blocks, roofing sheets, and finishing materials all need to move from suppliers to sites — often on tight schedules.</p><h3>The Supply Chain</h3><p>Most construction materials entering Abuja come from three sources: cement from Dangote's plants in Obajana (Kogi State) and Gboko (Benue State), steel from Ajaokuta and imported through Lagos ports, and aggregates from quarries within and around the FCT. Each has different logistics requirements — cement requires covered transport and careful handling, steel needs flatbed trucks with proper securing, and aggregates move in tippers and are measured by volume rather than weight.</p><h3>Common Logistics Challenges</h3><p>Construction site deliveries in Abuja face specific challenges: site access roads are often unpaved and difficult for heavy trucks during rainy season, delivery windows may be restricted by site managers or neighbouring residents, and the informal nature of most construction logistics means no tracking, no insurance, and no accountability when materials arrive damaged or short. These inefficiencies add cost that ultimately gets passed to property buyers and developers.</p><h3>A Smarter Approach</h3><p>Progressive developers are beginning to treat construction logistics as a managed function rather than an ad-hoc activity. This means scheduled deliveries coordinated with site build programmes, GPS tracking on material shipments, proper goods-in-transit insurance for high-value items, and digital records of every delivery for project management purposes. For logistics providers who can offer this level of professionalism to the construction sector, the opportunity in Abuja is substantial and growing.</p>`,
    category: "Last-Mile",
    readTime: "5 min read",
    tags: ["Construction", "Abuja", "Building Materials"],
    date: "2026-04-10",
  },
];

const BLOG_TOPICS = [
  "Cold chain logistics challenges and solutions in West Africa — pharmaceuticals, food, and agriculture",
  "How fuel subsidy removal in Nigeria is reshaping haulage economics and what businesses should do",
  "The rise of warehouse automation in Lagos and implications for Nigerian supply chains",
  "How Abuja small businesses can reduce delivery costs by 30% using digital logistics tools",
  "The role of drones in last-mile delivery across rural Africa — pilots in Rwanda, Ghana, and Nigeria",
  "Maritime shipping routes connecting Nigeria to global markets — Asia, Europe, and the Americas",
  "How construction logistics in Abuja is evolving with digital tracking and insurance",
  "Africa's free trade zones — SEZs in Nigeria, Kenya, Ethiopia and their impact on freight volumes",
  "The payment crisis in African trucking — why drivers need fintech solutions now",
  "What Amazon's Africa expansion means for Nigerian logistics and delivery businesses",
  "Lekki Deep Sea Port update — is it reducing congestion at Apapa and Tin Can?",
  "How to choose between road, rail, and air freight for your Nigerian business shipments",
  "The growing demand for furniture and house moving services in Abuja's expanding suburbs",
  "PAPSS — how the Pan-African Payment Settlement System could transform cross-border logistics payments",
  "How event logistics companies in Abuja can scale using digital platforms and insurance",
  "Dangote Refinery's impact on Nigerian fuel supply chains and transport economics",
  "Why insurance penetration in Nigerian logistics is so low and how insurtechs are fixing it",
  "Comparing African freight marketplaces — Kobo360, Lori Systems, MyLoad, and what comes next",
  "The impact of climate change on African trade routes and logistics infrastructure",
  "How Nigerian exporters can leverage AfCFTA to reach 1.3 billion African consumers",
];

const CATEGORY_COLORS = {
  Freight: "#E86A2C",
  Aviation: "#3498DB",
  Rail: "#2ECC71",
  Shipping: "#1ABC9C",
  "Last-Mile": "#E74C3C",
  "Industry News": "#9B59B6",
};

// ============================================================
// COMPONENTS
// ============================================================

function NavBar({ currentPage, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // On non-home pages, navbar must always be solid (no transparent bg on white pages)
  const isHome = currentPage === "home";
  const solid = !isHome || scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "blog", label: "Blog" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: solid ? "rgba(30,30,30,0.97)" : "transparent",
        backdropFilter: solid ? "blur(12px)" : "none",
        transition: "all 0.4s ease",
        borderBottom: solid ? "1px solid rgba(232,106,44,0.15)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: solid ? 64 : 80,
          transition: "height 0.4s ease",
        }}
      >
        <div
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
          onClick={() => setPage("home")}
        >
          <img
            src="/logo.png"
            alt="SIMA Logistics"
            style={{
              height: 40,
              width: "auto",
              filter: "brightness(0) invert(1)",
            }}
          />
        </div>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {links.map((l) => (
            <span
              key={l.id}
              onClick={() => { setPage(l.id); setMenuOpen(false); }}
              style={{
                color: currentPage === l.id ? BRAND.accent : "rgba(255,255,255,0.75)",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "color 0.3s",
                borderBottom: currentPage === l.id ? `2px solid ${BRAND.accent}` : "2px solid transparent",
                paddingBottom: 4,
              }}
            >
              {l.label}
            </span>
          ))}
        </div>
      </div>
    </nav>
  );
}

const DEFAULT_SLIDES = [
  { id: 1, title: "Moving Abuja", highlight: "Forward", subtitle: "Reliable transport and logistics consultancy delivering haulage, last-mile delivery, and freight solutions across the FCT.", image: "/truck.jpeg" },
  { id: 2, title: "Local Delivery", highlight: "You Can Trust", subtitle: "From market goods and construction materials to event equipment and furniture — we move what matters to your business.", image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1400&q=80" },
  { id: 3, title: "Freight & Logistics", highlight: "Simplified", subtitle: "End-to-end freight management and consultancy for businesses operating across Nigeria. Let us handle the complexity.", image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1400&q=80" },
];

function loadSlides() {
  try { const s = localStorage.getItem("sima_hero_slides"); if (s) return JSON.parse(s); } catch (e) {}
  return DEFAULT_SLIDES;
}

function Hero({ setPage }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(loadSlides);
  const [heroAdmin, setHeroAdmin] = useState(false);
  const [heroCode, setHeroCode] = useState("");
  const [showHeroLogin, setShowHeroLogin] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const ADMIN_CODE = "sima2026";

  const persist = (s) => { setSlides(s); try { localStorage.setItem("sima_hero_slides", JSON.stringify(s)); } catch(e){} };
  const addSlide = () => { const n = { id: Date.now(), title: "New Slide", highlight: "Title", subtitle: "Description here", image: "" }; persist([...slides, n]); setEditingSlide(n.id); };
  const updateSlide = (id, f, v) => persist(slides.map((s) => s.id === id ? { ...s, [f]: v } : s));
  const deleteSlide = (id) => { if (slides.length <= 1) return; persist(slides.filter((s) => s.id !== id)); if (currentSlide >= slides.length - 1) setCurrentSlide(0); };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #2C231E 0%, #3B2F2A 100%)",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: -120, left: -120, width: 400, height: 400, borderRadius: "50%", border: "1px solid rgba(232,106,44,0.07)" }} />

      {/* Admin toggle */}
      <div style={{ position: "absolute", top: 90, right: 24, zIndex: 20 }}>
        {heroAdmin ? (
          <button onClick={() => { setHeroAdmin(false); setEditingSlide(null); }} style={{ background: "rgba(232,106,44,0.2)", border: "1px solid rgba(232,106,44,0.4)", color: BRAND.accent, padding: "6px 14px", fontSize: 11, borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>Exit Slide Editor</button>
        ) : showHeroLogin ? (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input type="password" placeholder="Code" value={heroCode} onChange={(e) => setHeroCode(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && heroCode === ADMIN_CODE) { setHeroAdmin(true); setShowHeroLogin(false); setHeroCode(""); } }} style={{ padding: "6px 10px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, fontSize: 12, background: "rgba(0,0,0,0.3)", color: "#fff", outline: "none", width: 90 }} />
            <button onClick={() => { if (heroCode === ADMIN_CODE) { setHeroAdmin(true); setShowHeroLogin(false); setHeroCode(""); } }} style={{ background: BRAND.accent, color: "#fff", border: "none", padding: "6px 12px", fontSize: 11, borderRadius: 6, cursor: "pointer" }}>Go</button>
            <button onClick={() => { setShowHeroLogin(false); setHeroCode(""); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 11 }}>✕</button>
          </div>
        ) : (
          <span onClick={() => setShowHeroLogin(true)} style={{ color: "rgba(255,255,255,0.08)", cursor: "pointer", fontSize: 10 }}>·</span>
        )}
      </div>

      {/* Admin panel */}
      {heroAdmin && (
        <div style={{ position: "absolute", top: 120, right: 24, zIndex: 20, width: 320, maxHeight: "70vh", overflowY: "auto", background: "rgba(0,0,0,0.9)", borderRadius: 12, padding: 16, border: "1px solid rgba(232,106,44,0.3)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>Slides — {slides.length}</div>
          {slides.map((slide, i) => (
            <div key={slide.id} style={{ marginBottom: 12, padding: 10, background: editingSlide === slide.id ? "rgba(232,106,44,0.1)" : "rgba(255,255,255,0.03)", borderRadius: 8, border: editingSlide === slide.id ? "1px solid rgba(232,106,44,0.3)" : "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>Slide {i + 1}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <span onClick={() => setEditingSlide(editingSlide === slide.id ? null : slide.id)} style={{ fontSize: 10, color: BRAND.accent, cursor: "pointer" }}>{editingSlide === slide.id ? "Close" : "Edit"}</span>
                  {slides.length > 1 && <span onClick={() => deleteSlide(slide.id)} style={{ fontSize: 10, color: "#E74C3C", cursor: "pointer" }}>Delete</span>}
                </div>
              </div>
              {editingSlide === slide.id && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
                  <input value={slide.title} onChange={(e) => updateSlide(slide.id, "title", e.target.value)} placeholder="Title" style={{ width: "100%", padding: "6px 8px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 5, color: "#fff", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
                  <input value={slide.highlight} onChange={(e) => updateSlide(slide.id, "highlight", e.target.value)} placeholder="Orange text" style={{ width: "100%", padding: "6px 8px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 5, color: BRAND.accent, fontSize: 12, outline: "none", boxSizing: "border-box" }} />
                  <textarea value={slide.subtitle} onChange={(e) => updateSlide(slide.id, "subtitle", e.target.value)} rows={2} placeholder="Description" style={{ width: "100%", padding: "6px 8px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 5, color: "#fff", fontSize: 11, outline: "none", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
                  <input value={slide.image} onChange={(e) => updateSlide(slide.id, "image", e.target.value)} placeholder="Image URL (unsplash, pexels...)" style={{ width: "100%", padding: "6px 8px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 5, color: "#fff", fontSize: 11, outline: "none", boxSizing: "border-box" }} />
                  <button onClick={() => setCurrentSlide(i)} style={{ background: "rgba(232,106,44,0.15)", border: "1px solid rgba(232,106,44,0.3)", color: BRAND.accent, padding: "5px 10px", fontSize: 10, borderRadius: 5, cursor: "pointer" }}>Preview</button>
                </div>
              )}
            </div>
          ))}
          <button onClick={addSlide} style={{ width: "100%", padding: "8px", background: "rgba(232,106,44,0.12)", border: "1px dashed rgba(232,106,44,0.4)", color: BRAND.accent, fontSize: 11, fontWeight: 600, borderRadius: 6, cursor: "pointer" }}>+ Add slide</button>
        </div>
      )}

      {/* Full-width background image hero */}
      {slides.map((slide, i) => (
        <div key={slide.id} style={{ position: "absolute", inset: 0 }}>
          <img src={slide.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: currentSlide === i ? 1 : 0, transition: "opacity 1.5s ease", position: "absolute", inset: 0 }} />
        </div>
      ))}

      {/* Very light overlay — image shows through clearly */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(20,15,10,0.45) 0%, rgba(20,15,10,0.2) 50%, rgba(20,15,10,0.4) 100%)" }} />

      {/* Content centered */}
      <div style={{ maxWidth: 900, padding: "120px 24px 80px", textAlign: "center", position: "relative", zIndex: 1, margin: "0 auto" }}>
        <div style={{ display: "inline-block", padding: "8px 20px", border: "1px solid rgba(232,106,44,0.5)", borderRadius: 100, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: BRAND.accent, fontWeight: 600, marginBottom: 32, background: "rgba(0,0,0,0.2)" }}>
          Abuja's Transport & Logistics Partner
        </div>

        {slides.map((slide, i) => (
          <div key={slide.id} style={{ position: currentSlide === i ? "relative" : "absolute", opacity: currentSlide === i ? 1 : 0, transform: currentSlide === i ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.8s ease, transform 0.8s ease", pointerEvents: currentSlide === i ? "auto" : "none", width: "100%", left: 0 }}>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 700, color: BRAND.white, lineHeight: 1.1, margin: "0 0 24px", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
              {slide.title}<br /><span style={{ color: BRAND.accent }}>{slide.highlight}</span>
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: "rgba(255,255,255,0.9)", maxWidth: 580, margin: "0 auto 0", textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>{slide.subtitle}</p>
          </div>
        ))}

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: 48 }}>
          <button onClick={() => setPage("services")} style={{ background: BRAND.accent, color: "#fff", border: "none", padding: "16px 36px", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: 6, cursor: "pointer", transition: "all 0.3s" }} onMouseOver={(e) => (e.target.style.background = BRAND.accentHover)} onMouseOut={(e) => (e.target.style.background = BRAND.accent)}>Our Services</button>
          <button onClick={() => setPage("contact")} style={{ background: "rgba(0,0,0,0.2)", color: BRAND.white, border: "1px solid rgba(255,255,255,0.4)", padding: "16px 36px", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: 6, cursor: "pointer", transition: "all 0.3s" }} onMouseOver={(e) => { e.target.style.borderColor = BRAND.accent; e.target.style.color = BRAND.accent; }} onMouseOut={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.4)"; e.target.style.color = BRAND.white; }}>Get in Touch</button>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 48 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} style={{ width: currentSlide === i ? 32 : 10, height: 10, borderRadius: 100, border: "none", background: currentSlide === i ? BRAND.accent : "rgba(255,255,255,0.35)", cursor: "pointer", transition: "all 0.4s ease", padding: 0 }} />
          ))}
        </div>

        <div style={{ position: "absolute", bottom: 16, right: 20, background: "rgba(0,0,0,0.35)", borderRadius: 100, padding: "3px 10px", fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>{currentSlide + 1} / {slides.length}</div>
      </div>
    </section>
  );
}
function About() {
  return (
    <section style={{ background: BRAND.surface, padding: "100px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: BRAND.accent,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Who We Are
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              color: BRAND.primary,
              fontWeight: 700,
              margin: 0,
            }}
          >
            Built for Nigerian Logistics
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
          <div
            style={{
              background: BRAND.white,
              borderRadius: 12,
              padding: 40,
              borderLeft: `4px solid ${BRAND.accent}`,
            }}
          >
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 22,
                color: BRAND.primary,
                marginTop: 0,
              }}
            >
              Our Story
            </h3>
            <p style={{ color: BRAND.grey, lineHeight: 1.8, fontSize: 15 }}>
              SIMA Logistics was founded in 2015 and is headquartered in Abuja, Nigeria. We provide fourth-party logistics (4PL) services, transport consultancy, and freight management solutions tailored to the unique challenges of Nigerian commerce.
            </p>
            <p style={{ color: BRAND.grey, lineHeight: 1.8, fontSize: 15 }}>
              We are building NACOS Exchange — a digital freight and delivery marketplace — bridging the gap between traditional logistics operations and modern, technology-driven supply chain solutions.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              {
                title: "Our Mission",
                text: "To make logistics accessible, transparent, and reliable for businesses of every size across the FCT and Nigeria.",
              },
              {
                title: "Our Vision",
                text: "To become Abuja's most trusted logistics partner, setting the standard for professionalism and innovation in Nigerian transport.",
              },
              {
                title: "Our Approach",
                text: "We combine deep local knowledge of Abuja's geography and business landscape with modern logistics practices and emerging digital tools.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: BRAND.white,
                  borderRadius: 12,
                  padding: "28px 32px",
                  flex: 1,
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: `rgba(232,168,56,0.1)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    color: BRAND.accent,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <h4 style={{ margin: "0 0 6px", color: BRAND.primary, fontSize: 16, fontWeight: 700 }}>
                    {item.title}
                  </h4>
                  <p style={{ margin: 0, color: BRAND.grey, fontSize: 14, lineHeight: 1.7 }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      icon: "🚛",
      title: "Local Haulage & Delivery",
      desc: "Reliable pickup and delivery services across Abuja for businesses and individuals. From market goods and construction materials to furniture and event equipment.",
      features: ["Same-day delivery", "Multiple vehicle types", "Real-time tracking"],
    },
    {
      icon: "📦",
      title: "Last-Mile Logistics",
      desc: "Connecting businesses with their customers through efficient final-mile delivery solutions. Perfect for e-commerce, restaurants, retailers, and caterers.",
      features: ["Food & perishables", "E-commerce fulfilment", "Scheduled deliveries"],
    },
    {
      icon: "🏗️",
      title: "Construction & Industrial Moving",
      desc: "Specialised transport for construction materials, industrial equipment, and bulk supplies across project sites in the FCT.",
      features: ["Heavy load capability", "Site-to-site transport", "Material handling"],
    },
    {
      icon: "🎪",
      title: "Event & Entertainment Logistics",
      desc: "End-to-end logistics support for events, conferences, and entertainment productions. We move staging, sound, decor, and supplies so you can focus on the event.",
      features: ["Setup & breakdown support", "Timed deliveries", "Equipment handling"],
    },
    {
      icon: "📋",
      title: "Logistics Consultancy",
      desc: "Strategic advice on supply chain optimisation, route planning, fleet management, and logistics technology adoption for businesses operating in Nigeria.",
      features: ["Supply chain audit", "Cost reduction strategies", "Digital transformation"],
    },
    {
      icon: "🌍",
      title: "Freight Management",
      desc: "As a 4PL provider, we manage and coordinate your entire logistics operation — from carrier selection and route optimisation to compliance and documentation.",
      features: ["Multi-carrier management", "Customs support", "End-to-end visibility"],
    },
  ];

  return (
    <section style={{ background: BRAND.white, padding: "100px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: BRAND.accent,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            What We Do
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              color: BRAND.primary,
              fontWeight: 700,
              margin: "0 0 16px",
            }}
          >
            Services
          </h2>
          <p style={{ color: BRAND.grey, fontSize: 16, maxWidth: 550, margin: "0 auto", lineHeight: 1.7 }}>
            From everyday local deliveries to complex freight management, we provide end-to-end logistics solutions for Abuja and beyond.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {services.map((s, i) => (
            <div
              key={i}
              style={{
                border: `1px solid rgba(11,29,58,0.08)`,
                borderRadius: 12,
                padding: 36,
                transition: "all 0.3s",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = BRAND.accent;
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(232,168,56,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "rgba(11,29,58,0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>{s.icon}</div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 20,
                  color: BRAND.primary,
                  margin: "0 0 12px",
                }}
              >
                {s.title}
              </h3>
              <p style={{ color: BRAND.grey, fontSize: 14, lineHeight: 1.7, margin: "0 0 20px" }}>{s.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {s.features.map((f, j) => (
                  <span
                    key={j}
                    style={{
                      fontSize: 11,
                      padding: "5px 12px",
                      background: `rgba(232,168,56,0.08)`,
                      color: BRAND.accent,
                      borderRadius: 100,
                      fontWeight: 600,
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogPage({ articles, generating, onGenerate, onDelete, adminMode, setAdminMode, newsItems, newsLoading }) {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filter, setFilter] = useState("All");
  const [adminInput, setAdminInput] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const ADMIN_CODE = "sima2026"; // Change this to your own password

  const categories = ["All", ...Object.keys(CATEGORY_COLORS)];
  const filtered = filter === "All" ? articles : articles.filter((a) => a.category === filter);

  if (selectedArticle) {
    return (
      <section style={{ background: BRAND.surface, padding: "120px 24px 80px", minHeight: "100vh" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <button
            onClick={() => setSelectedArticle(null)}
            style={{
              background: "none",
              border: "none",
              color: BRAND.accent,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: 32,
              padding: 0,
            }}
          >
            ← Back to Blog
          </button>

          <span
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: CATEGORY_COLORS[selectedArticle.category] || BRAND.accent,
              marginBottom: 12,
            }}
          >
            {selectedArticle.category}
          </span>

          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(28px, 4vw, 40px)",
              color: BRAND.primary,
              lineHeight: 1.2,
              margin: "0 0 16px",
            }}
          >
            {selectedArticle.title}
          </h1>

          <div
            style={{
              display: "flex",
              gap: 16,
              color: BRAND.grey,
              fontSize: 13,
              marginBottom: 24,
              paddingBottom: 24,
              borderBottom: `1px solid rgba(11,29,58,0.08)`,
            }}
          >
            <span>{selectedArticle.date}</span>
            <span>·</span>
            <span>{selectedArticle.readTime}</span>
          </div>

          {selectedArticle.image && (
            <div style={{ marginBottom: 32, borderRadius: 10, overflow: "hidden" }}>
              <img src={selectedArticle.image} alt={selectedArticle.title} style={{ width: "100%", height: "auto", display: "block", maxHeight: 400, objectFit: "cover" }} />
            </div>
          )}

          <div
            style={{
              color: "#3A4A5C",
              fontSize: 16,
              lineHeight: 1.85,
            }}
            dangerouslySetInnerHTML={{ __html: selectedArticle.body }}
          />

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 40,
              paddingTop: 24,
              borderTop: `1px solid rgba(11,29,58,0.08)`,
              flexWrap: "wrap",
            }}
          >
            {selectedArticle.tags?.map((t, i) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  padding: "5px 14px",
                  background: BRAND.white,
                  color: BRAND.grey,
                  borderRadius: 100,
                  border: `1px solid rgba(11,29,58,0.1)`,
                }}
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ background: BRAND.surface, padding: "120px 24px 80px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: BRAND.accent,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Insights & Updates
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              color: BRAND.primary,
              fontWeight: 700,
              margin: "0 0 16px",
            }}
          >
            The SIMA Blog
          </h2>
          <p style={{ color: BRAND.grey, fontSize: 16, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
            News, analysis, and insights on transport, freight, and logistics across Nigeria and Africa.
          </p>
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                background: filter === c ? BRAND.primary : BRAND.white,
                color: filter === c ? BRAND.white : BRAND.grey,
                border: `1px solid ${filter === c ? BRAND.primary : "rgba(11,29,58,0.1)"}`,
                padding: "8px 18px",
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 100,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Admin panel — only visible to you */}
        {adminMode ? (
          <div style={{ textAlign: "center", marginBottom: 40, padding: "20px", background: BRAND.white, borderRadius: 12, border: `2px solid ${BRAND.accent}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.accent, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
              Admin Panel
            </div>
            <button
              onClick={onGenerate}
              disabled={generating}
              style={{
                background: generating ? BRAND.grey : `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.accentHover})`,
                color: generating ? BRAND.white : BRAND.primary,
                border: "none",
                padding: "12px 28px",
                fontSize: 13,
                fontWeight: 700,
                borderRadius: 8,
                cursor: generating ? "wait" : "pointer",
                letterSpacing: "0.04em",
                transition: "all 0.3s",
                marginRight: 12,
              }}
            >
              {generating ? "✍️ Generating..." : "✨ Generate New Article"}
            </button>
            <button
              onClick={() => setAdminMode(false)}
              style={{
                background: "transparent",
                color: BRAND.grey,
                border: `1px solid ${BRAND.greyLight}`,
                padding: "12px 20px",
                fontSize: 12,
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Exit Admin
            </button>
          </div>
        ) : (
          <div style={{ textAlign: "right", marginBottom: 20 }}>
            {showAdminLogin ? (
              <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                <input
                  type="password"
                  placeholder="Admin code"
                  value={adminInput}
                  onChange={(e) => setAdminInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && adminInput === ADMIN_CODE) {
                      setAdminMode(true);
                      setShowAdminLogin(false);
                      setAdminInput("");
                    }
                  }}
                  style={{
                    padding: "8px 12px",
                    border: `1px solid rgba(11,29,58,0.12)`,
                    borderRadius: 6,
                    fontSize: 13,
                    outline: "none",
                    width: 140,
                  }}
                />
                <button
                  onClick={() => {
                    if (adminInput === ADMIN_CODE) {
                      setAdminMode(true);
                      setShowAdminLogin(false);
                      setAdminInput("");
                    }
                  }}
                  style={{
                    background: BRAND.primary,
                    color: BRAND.white,
                    border: "none",
                    padding: "8px 16px",
                    fontSize: 12,
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Go
                </button>
                <button
                  onClick={() => { setShowAdminLogin(false); setAdminInput(""); }}
                  style={{ background: "none", border: "none", color: BRAND.grey, cursor: "pointer", fontSize: 12 }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <span
                onClick={() => setShowAdminLogin(true)}
                style={{ fontSize: 11, color: BRAND.greyLight, cursor: "pointer", opacity: 0.4 }}
              >
                ·
              </span>
            )}
          </div>
        )}

        {/* Articles grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {filtered.map((article) => (
            <article
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              style={{
                background: BRAND.white,
                borderRadius: 12,
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s",
                border: `1px solid rgba(11,29,58,0.05)`,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(11,29,58,0.08)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {article.image ? (
                <div style={{ height: 180, backgroundImage: `url(${article.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              ) : (
                <div style={{ height: 6, background: CATEGORY_COLORS[article.category] || BRAND.accent }} />
              )}
              <div style={{ padding: "28px 28px 24px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: CATEGORY_COLORS[article.category] || BRAND.accent,
                    }}
                  >
                    {article.category}
                  </span>
                  <span style={{ fontSize: 11, color: BRAND.greyLight }}>{article.readTime}</span>
                </div>

                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 19,
                    color: BRAND.primary,
                    lineHeight: 1.3,
                    margin: "0 0 10px",
                  }}
                >
                  {article.title}
                </h3>

                <p style={{ color: BRAND.grey, fontSize: 13, lineHeight: 1.65, margin: "0 0 16px" }}>
                  {article.excerpt}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: BRAND.greyLight }}>{article.date}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {adminMode && (
                      <span
                        onClick={(e) => { e.stopPropagation(); onDelete(article.id); }}
                        style={{ fontSize: 11, color: "#E74C3C", fontWeight: 600, cursor: "pointer" }}
                      >
                        Delete
                      </span>
                    )}
                    <span style={{ fontSize: 12, color: BRAND.accent, fontWeight: 600 }}>Read →</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Industry News Feed */}
        {newsItems.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: BRAND.accent, fontWeight: 700, marginBottom: 8 }}>Live Feed</div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, color: BRAND.primary, margin: 0 }}>Industry News</h3>
              </div>
              <div style={{ fontSize: 11, color: BRAND.greyLight }}>Auto-updated from industry sources</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
              {newsItems.map((item) => (
                <a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", background: BRAND.white, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(30,30,30,0.06)", transition: "all 0.3s", display: "block" }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(30,30,30,0.06)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  {item.image && (
                    <div style={{ height: 140, backgroundImage: `url(${item.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                  )}
                  <div style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: BRAND.accent, letterSpacing: "0.08em", textTransform: "uppercase" }}>{item.source}</span>
                      <span style={{ fontSize: 10, color: BRAND.greyLight }}>{item.date}</span>
                    </div>
                    <h4 style={{ fontSize: 15, color: BRAND.primary, lineHeight: 1.35, margin: "0 0 8px", fontWeight: 600 }}>{item.title}</h4>
                    <p style={{ fontSize: 12, color: BRAND.grey, lineHeight: 1.55, margin: 0 }}>{item.excerpt}</p>
                    <span style={{ display: "inline-block", marginTop: 10, fontSize: 11, color: BRAND.accent, fontWeight: 600 }}>Read full article ↗</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
        {newsLoading && (
          <div style={{ textAlign: "center", marginTop: 48, color: BRAND.greyLight, fontSize: 13 }}>Loading industry news...</div>
        )}
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", service: "Local Delivery & Haulage", message: "" });

  const handleSubmit = async () => {
    try {
      const body = new URLSearchParams({ "form-name": "contact", ...formData }).toString();
      await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
      setSent(true);
    } catch (e) {
      setSent(true);
    }
  };

  return (
    <section style={{ background: BRAND.surface, padding: "120px 24px 80px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: BRAND.accent,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Get in Touch
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              color: BRAND.primary,
              fontWeight: 700,
              margin: "0 0 16px",
            }}
          >
            Contact Us
          </h2>
          <p style={{ color: BRAND.grey, fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
            Ready to streamline your logistics? Let's talk about how SIMA can help.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40 }}>
          {/* Contact info */}
          <div>
            <div
              style={{
                background: BRAND.primary,
                borderRadius: 12,
                padding: 40,
                color: BRAND.white,
              }}
            >
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 24,
                  margin: "0 0 28px",
                }}
              >
                SIMA Logistics
              </h3>

              {[
                { label: "Location", value: "Abuja, FCT, Nigeria" },
                { label: "Email", value: "support@simalogistics.ng" },
                { label: "Registration", value: "RC 1554528" },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: 24 }}>
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: BRAND.accent,
                      fontWeight: 700,
                      marginBottom: 6,
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", whiteSpace: "pre-line", lineHeight: 1.5 }}>
                    {item.value}
                  </div>
                </div>
              ))}

              <div
                style={{
                  marginTop: 32,
                  paddingTop: 24,
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: BRAND.accent,
                    fontWeight: 700,
                    marginBottom: 10,
                  }}
                >
                  Business Hours
                </div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
                  Monday – Friday: 8:00 AM – 6:00 PM
                  <br />
                  Saturday: 9:00 AM – 2:00 PM
                  <br />
                  Sunday: Closed
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div
            style={{
              background: BRAND.white,
              borderRadius: 12,
              padding: 40,
            }}
          >
            {sent ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 24,
                    color: BRAND.primary,
                    marginBottom: 8,
                  }}
                >
                  Message Sent
                </h3>
                <p style={{ color: BRAND.grey, fontSize: 15 }}>
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 22,
                    color: BRAND.primary,
                    margin: "0 0 28px",
                  }}
                >
                  Send a Message
                </h3>

                {[
                  { label: "Full Name", type: "text", placeholder: "Your name", field: "name" },
                  { label: "Email", type: "email", placeholder: "your@email.com", field: "email" },
                  { label: "Phone", type: "tel", placeholder: "+234...", field: "phone" },
                ].map((f, i) => (
                  <div key={i} style={{ marginBottom: 20 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: BRAND.primary,
                        marginBottom: 8,
                      }}
                    >
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      name={f.field}
                      placeholder={f.placeholder}
                      value={formData[f.field]}
                      onChange={(e) => setFormData({ ...formData, [f.field]: e.target.value })}
                      required
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: `1px solid rgba(11,29,58,0.12)`,
                        borderRadius: 8,
                        fontSize: 14,
                        color: BRAND.primary,
                        outline: "none",
                        boxSizing: "border-box",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = BRAND.accent)}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(11,29,58,0.12)")}
                    />
                  </div>
                ))}

                <div style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: BRAND.primary,
                      marginBottom: 8,
                    }}
                  >
                    Service Interest
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: `1px solid rgba(11,29,58,0.12)`,
                      borderRadius: 8,
                      fontSize: 14,
                      color: BRAND.grey,
                      outline: "none",
                      boxSizing: "border-box",
                      background: BRAND.white,
                    }}
                  >
                    <option>Local Delivery & Haulage</option>
                    <option>Last-Mile Logistics</option>
                    <option>Construction & Industrial Moving</option>
                    <option>Event & Entertainment Logistics</option>
                    <option>Logistics Consultancy</option>
                    <option>Freight Management</option>
                    <option>Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: 28 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: BRAND.primary,
                      marginBottom: 8,
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    placeholder="Tell us about your logistics needs..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: `1px solid rgba(11,29,58,0.12)`,
                      borderRadius: 8,
                      fontSize: 14,
                      color: BRAND.primary,
                      outline: "none",
                      boxSizing: "border-box",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  style={{
                    width: "100%",
                    background: BRAND.accent,
                    color: BRAND.primary,
                    border: "none",
                    padding: "14px 24px",
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "background 0.3s",
                  }}
                  onMouseOver={(e) => (e.target.style.background = BRAND.accentHover)}
                  onMouseOut={(e) => (e.target.style.background = BRAND.accent)}
                >
                  Send Message
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ background: "#2C231E", padding: "60px 24px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 40,
            paddingBottom: 40,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div>
            <img src="/logo.png" alt="SIMA Logistics" style={{ height: 32, width: "auto", filter: "brightness(0) invert(1)", marginBottom: 12 }} />
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.7 }}>
              Transport and logistics consultancy headquartered in Abuja, Nigeria.
            </p>
          </div>

          <div>
            <h4
              style={{
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: BRAND.accent,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Quick Links
            </h4>
            {["Home", "About", "Services", "Blog", "Contact"].map((link) => (
              <div
                key={link}
                onClick={() => setPage(link.toLowerCase())}
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 13,
                  marginBottom: 10,
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
                onMouseOver={(e) => (e.target.style.color = BRAND.accent)}
                onMouseOut={(e) => (e.target.style.color = "rgba(255,255,255,0.5)")}
              >
                {link}
              </div>
            ))}
          </div>

          <div>
            <h4
              style={{
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: BRAND.accent,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Services
            </h4>
            {[
              "Local Haulage",
              "Last-Mile Delivery",
              "Event Logistics",
              "Freight Management",
              "Consultancy",
            ].map((s) => (
              <div
                key={s}
                style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 10 }}
              >
                {s}
              </div>
            ))}
          </div>

          <div>
            <h4
              style={{
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: BRAND.accent,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Contact
            </h4>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 10 }}>
              Abuja, FCT, Nigeria
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 10 }}>
              support@simalogistics.ng
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 24,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
            © 2026 SIMA Logistics (RC 1554528). All rights reserved.
          </div>
          <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>Abuja, FCT, Nigeria</div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// MAIN APP
// ============================================================

export default function SIMALogistics() {
  const [page, setPage] = useState("home");
  const [generating, setGenerating] = useState(false);
  const [newsItems, setNewsItems] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);

  // Load articles from localStorage, merging with seed articles
  const [articles, setArticles] = useState(() => {
    try {
      const saved = localStorage.getItem("sima_blog_articles");
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedIds = new Set(parsed.map((a) => a.id));
        const missingSeed = SEED_ARTICLES.filter((a) => !savedIds.has(a.id));
        return [...parsed, ...missingSeed].sort((a, b) => b.id - a.id || b.date?.localeCompare(a.date));
      }
    } catch (e) {}
    return SEED_ARTICLES;
  });

  // Fetch RSS news on mount
  useEffect(() => {
    async function fetchNews() {
      setNewsLoading(true);
      const feeds = [
        { url: "https://www.logupdateafrica.com/feed", name: "LogUpdate Africa" },
        { url: "https://businessday.ng/transport/feed/", name: "BusinessDay Transport" },
        { url: "https://guardian.ng/tag/logistics/feed/", name: "The Guardian Nigeria" },
        { url: "https://punchng.com/topics/business/feed/", name: "Punch Nigeria" },
      ];
      const allItems = [];

      for (const feed of feeds) {
        // Try multiple free RSS proxies
        const proxies = [
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&count=4`,
          `https://api.allorigins.win/raw?url=${encodeURIComponent(feed.url)}`,
        ];

        for (const proxyUrl of proxies) {
          try {
            const res = await fetch(proxyUrl);
            if (!res.ok) continue;
            const text = await res.text();

            // Try JSON parse first (rss2json returns JSON)
            try {
              const data = JSON.parse(text);
              if (data.status === "ok" && data.items) {
                data.items.forEach((item) => {
                  allItems.push({
                    id: "news-" + allItems.length + "-" + Math.random().toString(36).slice(2),
                    title: item.title,
                    excerpt: item.description ? item.description.replace(/<[^>]*>/g, "").slice(0, 180) + "..." : "",
                    link: item.link,
                    source: feed.name,
                    date: item.pubDate ? item.pubDate.split(" ")[0] : new Date().toISOString().split("T")[0],
                    image: item.thumbnail || item.enclosure?.link || "",
                    isNews: true,
                  });
                });
                break; // Got data from this feed, move to next feed
              }
            } catch (jsonErr) {
              // Not JSON — try parsing as XML (allorigins returns raw RSS)
              try {
                const parser = new DOMParser();
                const xml = parser.parseFromString(text, "text/xml");
                const items = xml.querySelectorAll("item");
                items.forEach((item, idx) => {
                  if (idx >= 4) return;
                  const getTag = (tag) => item.querySelector(tag)?.textContent || "";
                  const desc = getTag("description").replace(/<[^>]*>/g, "").slice(0, 180);
                  const imgMatch = (item.querySelector("enclosure")?.getAttribute("url")) || 
                    (item.innerHTML.match(/src="(https?:\/\/[^"]+\.(jpg|jpeg|png|webp))"/i) || [])[1] || "";
                  allItems.push({
                    id: "news-" + allItems.length + "-" + Math.random().toString(36).slice(2),
                    title: getTag("title"),
                    excerpt: desc ? desc + "..." : "",
                    link: getTag("link"),
                    source: feed.name,
                    date: getTag("pubDate") ? new Date(getTag("pubDate")).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
                    image: imgMatch,
                    isNews: true,
                  });
                });
                if (items.length > 0) break;
              } catch (xmlErr) {}
            }
          } catch (e) {}
        }
      }

      allItems.sort((a, b) => new Date(b.date) - new Date(a.date));
      setNewsItems(allItems.slice(0, 12));
      setNewsLoading(false);
    }
    fetchNews();
  }, []);

  // Save articles to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("sima_blog_articles", JSON.stringify(articles));
    } catch (e) {}
  }, [articles]);

  const [blogAdminMode, setBlogAdminMode] = useState(false);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDeleteArticle = useCallback((id) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    const topic = BLOG_TOPICS[Math.floor(Math.random() * BLOG_TOPICS.length)];
    const result = await generateBlogArticle(topic);
    if (result) {
      const newArticle = {
        ...result,
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
      };
      setArticles((prev) => [newArticle, ...prev]);
    }
    setGenerating(false);
  }, []);

  return (
    <div
      style={{
        fontFamily:
          "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: BRAND.primary,
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <NavBar currentPage={page} setPage={handlePageChange} />

      {page === "home" && (
        <>
          <Hero setPage={handlePageChange} />
          <About />
          <Services />
          {/* CTA Banner */}
          <section
            style={{
              background: "linear-gradient(135deg, #3B2F2A, #2C231E)",
              padding: "80px 24px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(24px, 3.5vw, 36px)",
                color: BRAND.white,
                fontWeight: 700,
                margin: "0 0 16px",
              }}
            >
              NACOS Exchange — <span style={{ color: BRAND.accent }}>Coming Soon</span>
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 16,
                maxWidth: 520,
                margin: "0 auto 32px",
                lineHeight: 1.7,
              }}
            >
              Our digital freight and delivery marketplace connecting shippers with verified
              drivers across Abuja. Post a load, get instant quotes, track in real time.
            </p>
            <a
              href="https://nacos.ng"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: BRAND.accent,
                color: "#fff",
                border: "none",
                padding: "14px 32px",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                borderRadius: 6,
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Register Your Interest →
            </a>
          </section>
        </>
      )}

      {page === "about" && (
        <div style={{ paddingTop: 80 }}>
          <About />
        </div>
      )}

      {page === "services" && (
        <div style={{ paddingTop: 80 }}>
          <Services />
        </div>
      )}

      {page === "blog" && (
        <BlogPage articles={articles} generating={generating} onGenerate={handleGenerate} onDelete={handleDeleteArticle} adminMode={blogAdminMode} setAdminMode={setBlogAdminMode} newsItems={newsItems} newsLoading={newsLoading} />
      )}

      {page === "contact" && <Contact />}

      <Footer setPage={handlePageChange} />
    </div>
  );
}
