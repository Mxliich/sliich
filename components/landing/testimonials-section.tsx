import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Testimonials</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">What Our Users Say</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Don't just take our word for it. Here's what people are saying about Sliich.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage alt="User" src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">Jane Doe</h3>
                  <p className="text-sm text-muted-foreground">@janedoe</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                "Sliich has completely transformed how I interact with my followers. The interface is beautiful and the
                features are exactly what I needed!"
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage alt="User" src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">John Smith</h3>
                  <p className="text-sm text-muted-foreground">@johnsmith</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                "The polling feature is a game-changer. I can now easily gather feedback from my audience in a fun and
                interactive way."
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage alt="User" src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>AL</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">Alex Lee</h3>
                  <p className="text-sm text-muted-foreground">@alexlee</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                "I switched from ngl.link to Sliich and haven't looked back. The customization options and security
                features are top-notch!"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

