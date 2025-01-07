import { PaymentFrequency, LoanPaymentSchedule } from '../types';

const PAYMENTS_PER_YEAR = {
  weekly: 52,
  biweekly: 26,
  monthly: 12,
  quarterly: 4
};

export const calculateLoanDetails = (
  principal: number,
  annualInterestRate: number,
  termMonths: number,
  frequency: PaymentFrequency,
  startDate: Date
) => {
  const periodsPerYear = PAYMENTS_PER_YEAR[frequency];
  // Convert annual interest rate to periodic rate
  const periodicRate = (annualInterestRate / 100) / periodsPerYear;
  const totalPeriods = Math.ceil(termMonths * (periodsPerYear / 12));
  
  // Calculate payment amount using the periodic interest rate
  const paymentAmount = principal * 
    (periodicRate * Math.pow(1 + periodicRate, totalPeriods)) / 
    (Math.pow(1 + periodicRate, totalPeriods) - 1);

  // Generate payment schedule
  let remainingBalance = principal;
  const schedule: LoanPaymentSchedule[] = [];
  let currentDate = new Date(startDate);

  for (let i = 0; i < totalPeriods; i++) {
    const interest = remainingBalance * periodicRate;
    const principalPayment = paymentAmount - interest;
    remainingBalance = Math.max(0, remainingBalance - principalPayment);

    schedule.push({
      dueDate: currentDate.toISOString(),
      amount: paymentAmount,
      principal: principalPayment,
      interest: interest,
      remainingBalance: remainingBalance,
      status: 'pending'
    });

    // Calculate next payment date based on frequency
    const nextDate = new Date(currentDate);
    switch (frequency) {
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'biweekly':
        nextDate.setDate(nextDate.getDate() + 14);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
    }
    currentDate = nextDate;
  }

  const totalAmount = paymentAmount * totalPeriods;
  const totalInterest = totalAmount - principal;

  return {
    paymentAmount,
    totalPeriods,
    totalAmount,
    totalInterest,
    schedule,
    effectiveRate: (Math.pow(1 + periodicRate, periodsPerYear) - 1) * 100 // Annual effective rate
  };
};