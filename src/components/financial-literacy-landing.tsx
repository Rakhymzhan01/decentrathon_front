'use client'

import { use, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardContent, Card } from "@/components/ui/card"
import { BookOpen, DollarSign, TrendingUp, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from 'axios';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock function to simulate backend interaction
// const mockAuthRequest = (email: string, password: string, isLogin: boolean) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (email && password) {
//         resolve({ success: true, message: isLogin ? "Login successful" : "Registration successful" })
//       } else {
//         reject({ success: false, message: "Invalid email or password" })
//       }
//     }, 1000)
//   })
// }

export function FinancialLiteracyLanding() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const router = useRouter();

  const handleSubmit = async (isLogin: boolean) => {
    setMessage(""); // Очистка сообщения перед отправкой
    try {
      const username = 'test'
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}` + endpoint, {
        username,
        email,
        password,
      });
  
      setMessage(response.data.message);
  
      if (response.data.success) {
        setEmail(""); // Очистка поля email
        setPassword(""); // Очистка поля password
      }
      router.push("/survey")
    } catch (error: unknown) { // Используем unknown вместо any
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message || "An error occurred");
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  }  
  

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <DollarSign className="h-6 w-6" />
          <span className="sr-only">FinLit Academy</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
        <div className="ml-4 flex gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Log In</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Authentication</DialogTitle>
                <DialogDescription>Log in or create a new account</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(true); }}>
                    <div className="grid gap-4 py-4">
                      <Input
                        id="email"
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Input
                        id="password"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full">Log In</Button>
                  </form>
                </TabsContent>
                <TabsContent value="register">
                  <form onSubmit={(e) => { e.preventDefault(); handleSubmit(false); }}>
                    <div className="grid gap-4 py-4">
                      <Input
                        id="email"
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Input
                        id="password"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full">Register</Button>
                  </form>
                </TabsContent>
              </Tabs>
              {message && <p className="mt-4 text-center text-sm text-gray-500">{message}</p>}
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Register</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create an Account</DialogTitle>
                <DialogDescription>Sign up for FinLit Academy</DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(false); }}>
                <div className="grid gap-4 py-4">
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    id="password"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">Register</Button>
              </form>
              {message && <p className="mt-4 text-center text-sm text-gray-500">{message}</p>}
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex justify-center items-center text-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Master Your Finances with FinLit Academy
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Learn essential financial skills, make informed decisions, and secure your financial future.
                </p>
              </div>
              <div className="space-x-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Get Started</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Get Started with FinLit Academy</DialogTitle>
                      <DialogDescription>Log in or create a new account to begin your financial journey</DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="login">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                      </TabsList>
                      <TabsContent value="login">
                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(true); }}>
                          <div className="grid gap-4 py-4">
                            <Input
                              id="email"
                              placeholder="Email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                              id="password"
                              placeholder="Password"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <Button type="submit" className="w-full">Log In</Button>
                        </form>
                      </TabsContent>
                      <TabsContent value="register">
                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(false); }}>
                          <div className="grid gap-4 py-4">
                            <Input
                              id="email"
                              placeholder="Email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                              id="password"
                              placeholder="Password"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <Button type="submit" className="w-full">Register</Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                    {message && <p className="mt-4 text-center text-sm text-gray-500">{message}</p>}
                  </DialogContent>
                </Dialog>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Why Choose FinLit Academy?</h2>
            <div className="grid gap-6 items-center md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <BookOpen className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold text-center">Comprehensive Curriculum</h3>
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                    From budgeting to investing, we cover all aspects of personal finance.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <Users className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold text-center">Expert Instructors</h3>
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                    Learn from certified financial advisors and industry professionals.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <TrendingUp className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold text-center">Practical Skills</h3>
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                    Gain real-world skills you can apply to your personal finances immediately.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <DollarSign className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold text-center">Financial Freedom</h3>
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                    Take control of your finances and work towards your financial goals.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Start Your Financial Journey Today</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join thousands of students who have transformed their financial lives with FinLit Academy.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1" placeholder="Enter your email" type="email" />
                  <Button type="submit">Subscribe</Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Get our free newsletter and stay up to date with the latest financial tips and tricks.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 FinLit Academy. All rights reserved.</p>
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
  )
}