import { NavItem } from "@/types/nav"

interface DocsConfig {
  mainNav: NavItem[]
  sidebarNav: NavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Github",
      href: "https://github.com/huynth1801",
      external: true,
    },
  ],
  sidebarNav: [
    {
      title: "Products",
      href: "/products",
    },
    {
      title: "Blog",
      href: "/blog",
    },
    {
      title: "Orders",
      href: "/profile/orders",
    },
    {
      title: "Payments",
      href: "/profile/payments",
    },
    {
      title: "Contact",
      href: "/contact",
    },
    {
      title: "About",
      href: "/about",
    },
  ],
}
