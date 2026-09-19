export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  body: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "custom-software-vs-off-the-shelf",
    title: "Why Custom Software Beats Off-the-Shelf Tools (Sometimes)",
    excerpt:
      "Off-the-shelf software is faster to start with, but it isn't always cheaper in the long run. Here's how we help clients decide.",
    category: "Strategy",
    date: "2026-06-02",
    readTime: "5 min read",
    body: [
      "Most teams don't start out wanting custom software. They start with a spreadsheet, then a SaaS tool, then three SaaS tools stitched together with a workaround someone built on a weekend. That's a completely reasonable way to get started — off-the-shelf tools exist because most problems aren't unique.",
      "The decision point usually isn't \"custom vs. off-the-shelf\" in the abstract. It's whether the workaround you've built is starting to cost more, in time and errors, than a proper solution would. If your team spends real hours every week re-entering the same data between tools, or your process has grown so specific that no off-the-shelf product fits it without heavy customization, that's usually the signal.",
      "A useful test we walk clients through: list the last three times a tool limitation forced a manual workaround. If that list is short, stick with what you have. If it's long and growing, it's worth scoping what a purpose-built tool would actually cost to build and maintain — because the answer is often less than people expect, and the payoff compounds every month you're not fighting the tool.",
    ],
  },
  {
    slug: "signs-you-need-a-ux-audit",
    title: "5 Signs Your Product Needs a UI/UX Audit",
    excerpt:
      "A UX audit isn't just for products that are visibly broken. Here are the quieter signals that it's time for one.",
    category: "Design",
    date: "2026-05-18",
    readTime: "4 min read",
    body: [
      "Teams usually ask for a UX audit after something goes wrong — a support ticket spike, a drop in conversion, a new hire asking \"wait, why does it work like this?\" But by the time it's visibly broken, it's often been quietly costing you for a while.",
      "A few earlier signals worth watching for: your support team answers the same \"how do I...\" question every week; new users need a walkthrough call before they can do anything useful; internal teams have started keeping their own cheat sheets to work around the interface; and every new feature seems to need its own explanation, rather than fitting into patterns users already know.",
      "None of these mean the product is bad. They usually mean it grew feature-by-feature without anyone stepping back to look at the whole experience. An audit isn't a redesign — it's a structured look at where the friction actually is, so you can fix the highest-impact problems first instead of guessing.",
    ],
  },
  {
    slug: "how-we-approach-client-onboarding",
    title: "How We Approach Client Onboarding",
    excerpt:
      "The first two weeks of a project set the tone for everything after. Here's what that looks like on our end.",
    category: "Process",
    date: "2026-04-30",
    readTime: "4 min read",
    body: [
      "A lot of project problems trace back to the first two weeks, not the last two. If scope, communication, and expectations aren't set clearly at the start, every phase after inherits that ambiguity.",
      "So our onboarding is deliberately unglamorous: a kickoff call to understand the actual business problem (not just the feature list), a short discovery phase to map the workflows involved, and a written scope document both sides sign off on before any code gets written. It's slower on day one and faster every day after.",
      "We also set the communication cadence up front — who updates whom, how often, and through what channel — so neither side is guessing whether \"no news\" means \"on track\" or \"something's wrong.\" It's a small thing, but it's the difference between a client who trusts the process and one who's refreshing their email.",
    ],
  },
  {
    slug: "native-vs-cross-platform-mobile",
    title: "Choosing Between Native and Cross-Platform Mobile Development",
    excerpt:
      "There's no universally right answer here — only the right answer for your team, timeline, and what the app actually needs to do.",
    category: "Engineering",
    date: "2026-04-09",
    readTime: "6 min read",
    body: [
      "This question comes up on almost every mobile project, and the honest answer is: it depends on what the app needs to do, not on which approach is \"better\" in general.",
      "Cross-platform frameworks get you to both iOS and Android faster with one codebase, and for most business apps — content, forms, dashboards, standard workflows — that's the right tradeoff. Native development earns its cost when the app leans heavily on platform-specific capabilities: deep hardware integration, best-in-class performance for something graphics- or compute-heavy, or UI patterns that need to feel exactly native to each platform.",
      "In practice, we ask clients three questions before recommending either path: how quickly do you need to be on both platforms, is there a performance-critical feature at the center of the app, and how likely is the team to need platform-specific capabilities in the next year or two. The answers usually make the decision obvious.",
    ],
  },
  {
    slug: "what-makes-a-software-partner-worth-keeping",
    title: "What Makes a Software Partner Worth Keeping",
    excerpt:
      "Anyone can ship version one. The partners worth keeping are the ones who make version two, three, and four easier.",
    category: "Partnership",
    date: "2026-03-21",
    readTime: "3 min read",
    body: [
      "It's not hard to find a team that can ship a first version of a product. The harder question is what happens after launch — when priorities shift, something breaks at an inconvenient time, or the roadmap changes because the business found something that actually works.",
      "The partners worth keeping are the ones who write code assuming someone else (maybe a future version of themselves) will need to change it later; who tell you when a request is a bad idea instead of just building it; and who treat a bug report as useful information, not an inconvenience.",
      "If you're evaluating a software partner, ask less about their past projects and more about how they handle the messy middle: a change of scope mid-project, a production issue at 6pm, a request they think is wrong. The answers there tell you more than any portfolio.",
    ],
  },
  {
    slug: "api-integrations-for-growing-teams",
    title: "A Practical Guide to API Integrations for Growing Teams",
    excerpt:
      "Most growing companies eventually need their tools to talk to each other. Here's how to think about that without over-building.",
    category: "Engineering",
    date: "2026-02-27",
    readTime: "5 min read",
    body: [
      "Every growing team hits the same wall eventually: the CRM doesn't talk to the billing system, the billing system doesn't talk to support, and someone is manually copying data between all three. Integrations fix this, but it's easy to either under-invest (brittle scripts that break silently) or over-invest (a full integration platform for three connections).",
      "The right scope usually depends on how many systems need to talk to each other and how often that's likely to change. A couple of stable, well-defined integrations are often best built directly and simply. Once you're maintaining five or more, or the set of connected tools changes often, it's worth centralizing that logic so you're not re-solving the same authentication and error-handling problems each time.",
      "Whatever the scope, the two things worth getting right from day one are error visibility (you should know immediately when a sync fails, not three weeks later when someone notices bad data) and idempotency (re-running a sync shouldn't create duplicates). Those two habits prevent almost every integration headache we've seen.",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
