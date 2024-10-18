import { Button } from "../components/ui/button";

import { Newspaper, TrendingUp, Globe, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Newspaper className="h-6 w-6" />
          <span className="sr-only">NewsApp</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#testimonials"
          >
            Testimonials
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#pricing"
          >
            Pricing
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-100 max-h-screen flex items-center">
          <div className="container px-4 md:px-6 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Stay Informed with Samachar
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Get the latest news from around the world, personalized for
                  you. Fast, reliable, and always up-to-date.
                </p>
              </div>
              <div className="space-x-4">
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="bg-black text-white hover:bg-white hover:text-black hover:border-black"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="outline"
                    className="hover:bg-gray-600 hover:text-white"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-3 text-center">
                <TrendingUp className="h-10 w-10" />
                <h3 className="text-xl font-bold">Trending News</h3>
                <p className="text-sm text-gray-500">
                  Stay on top of the most discussed topics
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <Globe className="h-10 w-10" />
                <h3 className="text-xl font-bold">Global Coverage</h3>
                <p className="text-sm text-gray-500">
                  News from every corner of the world
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <User className="h-10 w-10" />
                <h3 className="text-xl font-bold">Personalized Feed</h3>
                <p className="text-sm text-gray-500">
                  News tailored to your interests
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="testimonials"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 "
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              What Our Users Say
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-3 text-center">
                <img
                  alt="User"
                  className="rounded-full"
                  height="60"
                  src="/placeholder.svg?height=60&width=60"
                  style={{
                    aspectRatio: "60/60",
                    objectFit: "cover",
                  }}
                  width="60"
                />
                <p className="text-sm text-gray-500">
                  "NewsApp has become my go-to source for staying informed.
                  Highly recommended!"
                </p>
                <p className="font-semibold">- Sarah K.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <img
                  alt="User"
                  className="rounded-full"
                  height="60"
                  src="/placeholder.svg?height=60&width=60"
                  style={{
                    aspectRatio: "60/60",
                    objectFit: "cover",
                  }}
                  width="60"
                />
                <p className="text-sm text-gray-500 ">
                  "I love how I can customize my news feed. It's like having a
                  personal news curator."
                </p>
                <p className="font-semibold">- Mike T.</p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <img
                  alt="User"
                  className="rounded-full"
                  height="60"
                  src="/placeholder.svg?height=60&width=60"
                  style={{
                    aspectRatio: "60/60",
                    objectFit: "cover",
                  }}
                  width="60"
                />
                <p className="text-sm text-gray-500 ">
                  "The global coverage is impressive. I feel more connected to
                  world events now."
                </p>
                <p className="font-semibold">- Emily R.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Choose Your Plan
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-center mb-4">Basic</h3>
                <p className="text-center text-gray-500 mb-4">
                  Perfect for casual readers
                </p>
                <p className="text-4xl font-bold text-center mb-6">$0</p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <svg
                      className=" text-green-500 mr-2"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Access to basic news feed
                  </li>
                  <li className="flex items-center">
                    <svg
                      className=" text-green-500 mr-2"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Limited personalization
                  </li>
                </ul>
                <Button className="w-full justify-center">Choose Basic</Button>
              </div>
              <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-center mb-4">Pro</h3>
                <p className="text-center text-gray-500 mb-4">
                  For the news enthusiast
                </p>
                <p className="text-4xl font-bold text-center mb-6">$9.99</p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <svg
                      className=" text-green-500 mr-2"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Full access to all news categories
                  </li>
                  <li className="flex items-center">
                    <svg
                      className=" text-green-500 mr-2"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Advanced personalization
                  </li>
                  <li className="flex items-center">
                    <svg
                      className=" text-green-500 mr-2"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Ad-free experience
                  </li>
                </ul>
                <Button className="w-full">Choose Pro</Button>
              </div>
              <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-center mb-4">
                  Enterprise
                </h3>
                <p className="text-center text-gray-500 mb-4">
                  For organizations
                </p>
                <p className="text-4xl font-bold text-center mb-6">Custom</p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <svg
                      className=" text-green-500 mr-2"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    All Pro features
                  </li>
                  <li className="flex items-center">
                    <svg
                      className=" text-green-500 mr-2"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    API access
                  </li>
                  <li className="flex items-center">
                    <svg
                      className=" text-green-500 mr-2"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Dedicated support
                  </li>
                </ul>
                <Button className="w-full">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">
          © 2024 NewsApp. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
