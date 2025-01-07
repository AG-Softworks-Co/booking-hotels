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
    title: "Gestión de Reservas",
    description: "Sistema completo para manejar reservaciones, check-ins y check-outs."
  },
  {
    icon: Hotel,
    title: "Control de Habitaciones",
    description: "Administra el estado y disponibilidad de todas tus habitaciones."
  },
  {
    icon: CreditCard,
    title: "Gestión de Pagos",
    description: "Procesa pagos y gestiona facturación de manera eficiente."
  },
  {
    icon: BarChart3,
    title: "Reportes Detallados",
    description: "Analiza el rendimiento de tu hotel con reportes detallados."
  },
  {
    icon: Shield,
    title: "Seguridad Avanzada",
    description: "Protección de datos y acceso seguro para tu negocio."
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
            Características Principales
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Todo lo que necesitas para gestionar tu hotel de manera eficiente
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