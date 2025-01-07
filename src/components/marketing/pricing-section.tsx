"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const plans = [
  {
    name: "Basic",
    price: "29",
    description: "Perfect for small hotels",
    features: [
      "Up to 20 rooms",
      "Basic reservation management",
      "Monthly reports",
      "Email support"
    ]
  },
  {
    name: "Professional",
    price: "79",
    description: "For growing hotels",
    features: [
      "Up to 50 rooms",
      "Advanced reservation management",
      "Weekly reports",
      "Priority support",
      "Channel integration"
    ]
  },
  {
    name: "Enterprise",
    price: "199",
    description: "For hotel chains",
    features: [
      "Unlimited rooms",
      "Multi-hotel system",
      "Real-time reports",
      "24/7 support",
      "Custom API",
      "Custom configuration"
    ]
  }
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">
            Plans and Pricing
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that best fits your hotel's needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  <div className="text-4xl font-bold mb-4">
                    ${plan.price}<span className="text-lg">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="w-5 h-5 text-primary mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={index === 1 ? "default" : "outline"}>
                  Get Started
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}