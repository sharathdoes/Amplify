import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import "./this.css";

const reviews =[
  {
    name: "TechCrunch",
    username: "@techcrunch",
    body: "Tech jobs are expected to see significant growth in 2024, with high demand for AI specialists and developers.",
    img: "https://avatar.vercel.sh/techcrunch"
  },
  {
    name: "Forbes",
    username: "@forbes",
    body: "Remote jobs continue to increase as companies embrace hybrid working models in 2024.",
    img: "https://avatar.vercel.sh/forbes"
  },
  {
    name: "Business Insider",
    username: "@businessinsider",
    body: "AI is changing the way companies hire, offering quicker and more efficient candidate screenings.",
    img: "https://avatar.vercel.sh/businessinsider"
  },
  {
    name: "Wired",
    username: "@wired",
    body: "As digital threats rise, the demand for cybersecurity professionals has surged, with competitive salaries in 2024.",
    img: "https://avatar.vercel.sh/wired"
  },
  {
    name: "NYTimes",
    username: "@nytimes",
    body: "Data science remains one of the fastest-growing fields, with strong opportunities across industries.",
    img: "https://avatar.vercel.sh/nytimes"
  },
  {
    name: "BBC News",
    username: "@bbcnews",
    body: "Environmental tech jobs are on the rise, with more companies focusing on sustainability and renewable energy.",
    img: "https://avatar.vercel.sh/bbcnews"
  },
  {
    name: "CNN",
    username: "@cnn",
    body: "The healthcare sector is expected to add millions of jobs as demand for medical services grows.",
    img: "https://avatar.vercel.sh/cnn"
  },
  {
    name: "The Wall Street Journal",
    username: "@wsj",
    body: "FinTech companies are expanding, with a particular focus on blockchain and digital payment services.",
    img: "https://avatar.vercel.sh/wsj"
  },
  {
    name: "Reuters",
    username: "@reuters",
    body: "AI and automation are transforming manufacturing, creating new jobs in advanced production technologies.",
    img: "https://avatar.vercel.sh/reuters"
  },
  {
    name: "AdAge",
    username: "@adage",
    body: "Marketing is embracing AI for targeted advertising, with companies seeking tech-savvy marketers in 2024.",
    img: "https://avatar.vercel.sh/adage"
  },
  {
    name: "LinkedIn News",
    username: "@linkedinnews",
    body: "Upskilling is the key to success in 2024 as companies seek professionals with updated skills.",
    img: "https://avatar.vercel.sh/linkedin"
  },
  {
    name: "Bloomberg",
    username: "@bloomberg",
    body: "Top companies are investing in AI research, creating thousands of job opportunities in AI development.",
    img: "https://avatar.vercel.sh/bloomberg"
  },
  {
    name: "Financial Times",
    username: "@ft",
    body: "Financial firms are hiring data analysts to optimize decision-making processes in 2024.",
    img: "https://avatar.vercel.sh/ft"
  },
  {
    name: "Mashable",
    username: "@mashable",
    body: "Startups in the tech sector are thriving, with many offering lucrative job opportunities for young professionals.",
    img: "https://avatar.vercel.sh/mashable"
  },
  {
    name: "TechRadar",
    username: "@techradar",
    body: "The demand for cloud computing experts is growing, with major firms transitioning to cloud-based solutions.",
    img: "https://avatar.vercel.sh/techradar"
  }
]


const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

const ReviewCard = ({ name, username, body }) => {
  return (
    <figure
      className={cn(
        "relative  w-[21.875rem] h-28 cursor-pointer overflow-hidden rounded-xl border p-4 mx-2",
        "border-gray-950/[.1] bg-white hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50 dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex items-center gap-3">
        <div>
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

const useCircularQueue = (arr) => {
  const [queue, setQueue] = useState([...arr]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQueue((prev) => [...prev.slice(1), prev[0]]);
    }, 3000); // Change every 3 seconds, adjust as needed
    return () => clearInterval(interval);
  }, []);

  return queue;
};

export function AnalyzeAnswer() {
  const firstRowQueue = useCircularQueue(firstRow);
  const secondRowQueue = useCircularQueue(secondRow);

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg mt-36 bg-gray-50">
      {/* First row moving left to right */}
      <div className="marquee-reverse relative w-full overflow-hidden whitespace-nowrap flex mb-8">
        <div className="track flex flex-row w-max animate-marquee">
          {firstRowQueue.concat(firstRowQueue).map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>
      </div>

      {/* Second row moving left to right, slightly behind */}
      <div className="marquee relative w-full overflow-hidden whitespace-nowrap flex mb-8">
        <div className="track flex flex-row w-max animate-marquee second-row">
          {secondRowQueue.concat(secondRowQueue).map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>
      </div>

      {/* Gradient for visual effects */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l"></div>
    </div>
  );
}

export default AnalyzeAnswer;
