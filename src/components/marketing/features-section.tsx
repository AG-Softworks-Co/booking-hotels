"use client";

import { motion } from "framer-motion";
import { 
  Hotel, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Shield 
} from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Calendar,
    title: "Reservation Management",
    description: "Complete system for handling reservations, check-ins, and check-outs."
  },
  {
    icon: Hotel,
    title: "Room Control",
    description: "Manage the status and availability of all your rooms."
  },
  {
    icon: CreditCard,
    title: "Payment Processing",
    description: "Process payments and manage billing efficiently."
  },
  {
    icon: BarChart3,
    title: "Detailed Reports",
    description: "Analyze your hotel's performance with detailed reports."
  },
  {
    icon: Shield,
    title: "Advanced Security",
    description: "Data protection and secure access for your business."
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">
            Key Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your hotel efficiently
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                <feature.icon className="w-12 h-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}