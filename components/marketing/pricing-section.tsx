"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const plans = [
  {
    name: "Básico",
    price: "29",
    description: "Perfecto para hoteles pequeños",
    features: [
      "Hasta 20 habitaciones",
      "Gestión de reservas básica",
      "Reportes mensuales",
      "Soporte por email"
    ]
  },
  {
    name: "Profesional",
    price: "79",
    description: "Para hoteles en crecimiento",
    features: [
      "Hasta 50 habitaciones",
      "Gestión de reservas avanzada",
      "Reportes semanales",
      "Soporte prioritario",
      "Integración con canales de venta"
    ]
  },
  {
    name: "Empresarial",
    price: "199",
    description: "Para cadenas hoteleras",
    features: [
      "Habitaciones ilimitadas",
      "Sistema multi-hotel",
      "Reportes en tiempo real",
      "Soporte 24/7",
      "API personalizada",
      "Configuración personalizada"
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
            Planes y Precios
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a las necesidades de tu hotel
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
                    ${plan.price}<span className="text-lg">/mes</span>
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
                  Comenzar Ahora
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}