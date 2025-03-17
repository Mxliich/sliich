import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Express Yourself Anonymously with Sliich
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Share anonymous messages, create polls, and connect with friends in a sleek, modern interface. Sliich is
                the next generation of anonymous messaging platforms.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/features">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last">
            <Image
              src="/placeholder.svg?height=550&width=850"
              alt="Sliich App Screenshot"
              width={850}
              height={550}
              className="rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

