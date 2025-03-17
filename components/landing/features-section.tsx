import { MessageSquare, Shield, Palette, BarChart4, Users, PieChart } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Everything You Need in One Place</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Sliich provides a comprehensive set of features to enhance your anonymous messaging experience.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary p-2 text-primary-foreground">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Anonymous Messaging</h3>
            <p className="text-center text-muted-foreground">
              Send and receive anonymous messages with enhanced privacy controls.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary p-2 text-primary-foreground">
              <PieChart className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Interactive Polls</h3>
            <p className="text-center text-muted-foreground">
              Create polls and surveys to gather opinions from your audience.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary p-2 text-primary-foreground">
              <Palette className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Customizable Themes</h3>
            <p className="text-center text-muted-foreground">
              Personalize your profile with a variety of themes and styles.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary p-2 text-primary-foreground">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Enhanced Security</h3>
            <p className="text-center text-muted-foreground">
              Advanced privacy settings and two-factor authentication to keep your account secure.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary p-2 text-primary-foreground">
              <BarChart4 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Analytics & Insights</h3>
            <p className="text-center text-muted-foreground">
              Get detailed analytics on your profile engagement and message trends.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-primary p-2 text-primary-foreground">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Social Integration</h3>
            <p className="text-center text-muted-foreground">
              Connect your social media accounts for a seamless experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

