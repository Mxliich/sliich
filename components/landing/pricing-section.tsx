import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export function PricingSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Pricing</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Simple, Transparent Pricing</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the plan that's right for you and start connecting with your audience today.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-col space-y-1.5">
              <CardTitle className="text-xl">Free</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="mt-4 flex items-baseline text-5xl font-bold">
                $0
                <span className="ml-1 text-sm font-normal text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <ul className="grid gap-2.5">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Basic anonymous messaging</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Standard profile customization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Up to 3 active polls</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Basic analytics</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/signup">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="border-primary">
            <CardHeader className="flex flex-col space-y-1.5 bg-primary text-primary-foreground">
              <div className="px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground/80 -mt-6 self-start rounded-full bg-primary-foreground/20">
                Popular
              </div>
              <CardTitle className="text-xl">Pro</CardTitle>
              <CardDescription className="text-primary-foreground/90">For creators and influencers</CardDescription>
              <div className="mt-4 flex items-baseline text-5xl font-bold">
                $9.99
                <span className="ml-1 text-sm font-normal text-primary-foreground/90">/month</span>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <ul className="grid gap-2.5">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Advanced anonymous messaging</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Full profile customization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Unlimited active polls</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Detailed analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Priority support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/signup?plan=pro">Get Pro</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-col space-y-1.5">
              <CardTitle className="text-xl">Business</CardTitle>
              <CardDescription>For teams and businesses</CardDescription>
              <div className="mt-4 flex items-baseline text-5xl font-bold">
                $29.99
                <span className="ml-1 text-sm font-normal text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <ul className="grid gap-2.5">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Advanced security features</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>API access</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Dedicated support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant="outline">
                <Link href="/signup?plan=business">Contact Sales</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}

