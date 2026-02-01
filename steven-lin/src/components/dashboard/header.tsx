"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

/* ---------------------------------------------
 * Logo
 * -------------------------------------------- */
const Logo = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg
      aria-label="Logo"
      role="img"
      fill="none"
      height="1em"
      viewBox="0 0 324 323"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="currentColor" height="323" rx="161.5" width="323" x="0.5" />
      <circle
        cx="162"
        cy="161.5"
        fill="white"
        r="60"
        className="dark:fill-black"
      />
    </svg>
  )
}

/* ---------------------------------------------
 * Hamburger Icon
 * -------------------------------------------- */
const HamburgerIcon = ({
  className,
  ...props
}: React.SVGAttributes<SVGElement>) => (
  <svg
    aria-label="Menu"
    className={cn("pointer-events-none", className)}
    fill="none"
    height={16}
    role="img"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width={16}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
      d="M4 12L20 12"
    />
    <path
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
      d="M4 12H20"
    />
    <path
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
      d="M4 12H20"
    />
  </svg>
)

/* ---------------------------------------------
 * Types
 * -------------------------------------------- */
export interface NavbarNavLink {
  href: string
  label: string
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  navigationLinks?: NavbarNavLink[]
}

/* ---------------------------------------------
 * Navigation Links
 * -------------------------------------------- */
const defaultNavigationLinks: NavbarNavLink[] = [
  { href: "/home", label: "Home" },
  { href: "/work", label: "Work Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About Me" },
]

/* ---------------------------------------------
 * Navbar
 * -------------------------------------------- */
export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ className, navigationLinks = defaultNavigationLinks, ...props }, ref) => {
    const pathname = usePathname()
    const [isMobile, setIsMobile] = useState(false)
    const containerRef = useRef<HTMLElement>(null)

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          setIsMobile(containerRef.current.offsetWidth < 768)
        }
      }

      checkWidth()

      const resizeObserver = new ResizeObserver(checkWidth)
      containerRef.current && resizeObserver.observe(containerRef.current)

      return () => resizeObserver.disconnect()
    }, [])

    const combinedRef = React.useCallback(
      (node: HTMLElement | null) => {
        containerRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      },
      [ref],
    )

    const isLinkActive = (href: string) => {
      if (href === "/home") return pathname === "/home"
      return pathname.startsWith(href)
    }

    return (
      <header
        ref={combinedRef}
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 [&_*]:no-underline",
          className,
        )}
        {...props}
      >
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Mobile Menu */}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="group h-9 w-9"
                  >
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>

                <PopoverContent align="start" className="w-48 p-2">
                  <NavigationMenu>
                    <NavigationMenuList className="flex-col gap-1">
                      {navigationLinks.map(link => {
                        const active = isLinkActive(link.href)

                        return (
                          <NavigationMenuItem key={link.href}>
                            <Link
                              href={link.href}
                              className={cn(
                                "flex w-full rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                active
                                  ? "bg-accent text-accent-foreground"
                                  : "text-foreground/80 hover:bg-accent hover:text-accent-foreground",
                              )}
                            >
                              {link.label}
                            </Link>
                          </NavigationMenuItem>
                        )
                      })}
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}

            {/* Brand */}
            <Link
              href="/home"
              className="hidden text-xl font-bold sm:inline-block"
            >
              Steven Lin
            </Link>

            {/* Desktop Menu */}
            {!isMobile && (
              <NavigationMenu>
                <NavigationMenuList className="gap-1">
                  {navigationLinks.map(link => {
                    const active = isLinkActive(link.href)

                    return (
                      <NavigationMenuItem key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            "inline-flex h-9 items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                            active
                              ? "bg-accent text-accent-foreground"
                              : "text-foreground/80 hover:bg-accent hover:text-foreground",
                          )}
                        >
                          {link.label}
                        </Link>
                      </NavigationMenuItem>
                    )
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>
        </div>
      </header>
    )
  },
)

Navbar.displayName = "Navbar"

/* ---------------------------------------------
 * Demo
 * -------------------------------------------- */
export function Demo() {
  return (
    <div className="fixed inset-0">
      <Navbar />
    </div>
  )
}

export { Logo, HamburgerIcon }
