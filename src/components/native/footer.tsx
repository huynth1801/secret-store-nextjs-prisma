import { Separator } from "./separator"
import config from "@/config/site"
import { GithubIcon, Mail } from "lucide-react"
import Link from "next/link"

const data = [
  {
    label: "LEGAL",
    links: [
      {
        label: "Privacy policy",
        url: "/privacy",
      },
      {
        label: "Term & Conditions",
        url: "/terms",
      },
    ],
  },
  {
    label: "RESOURCES",
    links: [
      {
        label: "Blog",
        url: "/blog",
      },
      {
        label: "About",
        url: "/about",
      },
      {
        label: "Contact",
        url: "/contact",
      },
    ],
  },
  {
    label: "SUPPORT",
    links: [
      {
        label: "Telegram",
        url: "/telegram",
      },
      {
        label: "FAQ",
        url: "/faq",
      },
    ],
  },
]

export default function FooterPage() {
  return (
    <footer className="w-full">
      <Separator className="my-12" />
      <div className="flex justify-between px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem]">
        <TradeMark />
        <TotalLinks />
      </div>
      <Separator className="mt-8 mb-6" />
      <Socials />
    </footer>
  )
}

const TradeMark = () => {
  return (
    <div className="mb-6 hidden md:mb-0 md:block">
      <span className="flex flex-col">
        <h2 className="whitespace-nowrap text-sm font-semibold uppercase">
          {config.name}
        </h2>
        <span className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          © {new Date().getFullYear()} {config.name}™ . All Rights Reserved.
        </span>
      </span>
    </div>
  )
}

const TotalLinks = () => {
  return (
    <div className="text-end justify-evenly grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
      {data.map(({ label, links }) => (
        <div key={label}>
          <h2 className="mb-3 text-sm uppercase">{label}</h2>
          <ul className="block space-y-1">
            {links.map(({ label, url }) => (
              <li key={label}>
                <Link
                  href={url}
                  className="text-sm transition duration-300 text-muted-foreground hover:text-foreground"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

const Socials = () => {
  return (
    <div className="mb-6 flex justify-center space-x-6 text-muted-foreground">
      <a href="https://github.com/huynth1801" target="_blank">
        <GithubIcon className="h-4 w-4" />
        <span className="sr-only">GitHub account</span>
      </a>
      <a href="mailto:huuhuy1801@gmail.com">
        <Mail className="h-4 w-4" />
        <span className="sr-only">GitHub account</span>
      </a>
    </div>
  )
}
