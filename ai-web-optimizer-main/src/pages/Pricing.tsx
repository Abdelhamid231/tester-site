import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Check, X, Zap, Cpu } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const plans = [
  {
    name: "Starter",
    description: "Basic AI analysis for individuals",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { name: "5 AI analyses per day", included: true },
      { name: "Initial AI Analysis model", included: true },
      { name: "Basic performance metrics", included: true },
      { name: "1 project", included: true },
      { name: "Test history (7 days)", included: true },
      { name: "Fast UI Test", included: false },
      { name: "Deep Security Test", included: false },
      { name: "Enterprise Pro Test", included: false },
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    description: "Deep security & fast testing",
    monthlyPrice: 29,
    yearlyPrice: 23,
    features: [
      { name: "Unlimited AI analyses", included: true },
      { name: "Fast UI Test model", included: true },
      { name: "Deep Security Test model", included: true },
      { name: "Advanced performance metrics", included: true },
      { name: "10 projects", included: true },
      { name: "Test history (unlimited)", included: true },
      { name: "Priority support", included: true },
      { name: "Enterprise Pro Test", included: false },
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "Professional QA automation",
    monthlyPrice: 99,
    yearlyPrice: 79,
    features: [
      { name: "Everything in Pro", included: true },
      { name: "Enterprise Pro QA models", included: true },
      { name: "Professional Workflow testing", included: true },
      { name: "Bug Report generation", included: true },
      { name: "Unlimited projects", included: true },
      { name: "24/7 dedicated support", included: true },
      { name: "Full API access", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  {
    question: "How does the AI analysis work?",
    answer: "Our AI-powered analysis uses advanced language models to evaluate your website's code structure, security configurations, accessibility features, and SEO optimization. The AI processes your URL in real-time and provides actionable insights based on industry best practices.",
  },
  {
    question: "What happens after my free trial ends?",
    answer: "After your 14-day free trial, you can choose to upgrade to a paid plan or continue with the free Starter plan. The Starter plan includes 5 AI analyses per day, which is great for personal projects.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period, and you won't be charged again.",
  },
  {
    question: "Do you store my website data?",
    answer: "We only store the analysis results and scores for your reference. We never store your actual website content or sensitive data. All analyses are processed in real-time and discarded after generating results.",
  },
  {
    question: "What types of websites can I analyze?",
    answer: "You can analyze any publicly accessible website. Our AI can handle various types of sites including static pages, SPAs, e-commerce sites, blogs, and web applications.",
  },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 hex-grid opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-mono mb-6">
              <Cpu className="w-4 h-4" />
              <span>PRICING</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              <span className="text-foreground">SIMPLE </span>
              <span className="text-gradient-cyber">PRICING</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 font-sans">
              Start free. Upgrade when you need more power.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-mono ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
                MONTHLY
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-primary"
              />
              <span className={`text-sm font-mono ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
                YEARLY
              </span>
              {isYearly && (
                <Badge className="bg-success/20 text-success border-success/30 font-mono">
                  SAVE 20%
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative cyber-card ${plan.popular ? "border-primary shadow-neon-cyan scale-105" : ""
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 font-display">
                      RECOMMENDED
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-display font-bold text-foreground mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground font-sans text-sm">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-display font-bold text-primary">
                        ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-muted-foreground font-mono">/mo</span>
                    </div>
                    {isYearly && plan.monthlyPrice > 0 && (
                      <p className="text-sm text-muted-foreground mt-2 font-mono">
                        Billed ${plan.yearlyPrice * 12}/year
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-success flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground/50 flex-shrink-0" />
                        )}
                        <span className={`text-sm font-sans ${feature.included ? "text-foreground" : "text-muted-foreground/50"}`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link to={plan.name === "Enterprise" ? "#contact" : "/signup"}>
                    <Button
                      className={`w-full font-display tracking-wider ${plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon-cyan"
                        : "bg-muted text-foreground hover:bg-muted/80 border border-primary/20"
                        }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 border-t border-primary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary font-mono text-sm mb-4">// FAQ</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              <span className="text-foreground">COMMON </span>
              <span className="text-gradient-cyber">QUESTIONS</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="cyber-card rounded-lg px-6 border-primary/20"
                >
                  <AccordionTrigger className="text-left hover:no-underline font-display text-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground font-sans">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 hex-grid opacity-20" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              <span className="text-foreground">START </span>
              <span className="text-gradient-cyber">TESTING NOW</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 font-sans">
              No credit card required. Start with 5 free AI analyses per day.
            </p>
            <Link to="/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon-cyan font-display tracking-wider text-lg px-10 py-6">
                <Zap className="w-5 h-5 mr-2" />
                GET STARTED FREE
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
