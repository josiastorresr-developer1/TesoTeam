import type {
  User,
  Child,
  ChildUpdate,
  Volunteer,
  Donor,
  Donation,
  Expense,
  FinancialGoal,
  NewsPost,
  Notification,
  Role,
  ChildStatus,
  VolunteerStatus,
  DonorType,
  DonationMethod,
  GoalPeriod,
  NotificationType,
} from "@prisma/client";

// Re-exportar enums para usar en toda la app
export type {
  Role,
  ChildStatus,
  VolunteerStatus,
  DonorType,
  DonationMethod,
  GoalPeriod,
  NotificationType,
};

// Tipos base
export type { User, Child, ChildUpdate, Volunteer, Donor, Donation, Expense, FinancialGoal, NewsPost, Notification };

// Tipos compuestos para queries con relaciones
export type ChildWithTutor = Child & {
  tutor: Pick<User, "id" | "name" | "email"> | null;
};

export type ChildWithUpdates = Child & {
  updates: ChildUpdate[];
  tutor: Pick<User, "id" | "name" | "email"> | null;
};

export type DonationWithDonor = Donation & {
  donor: Donor;
  registeredBy: Pick<User, "id" | "name">;
};

export type DonorWithDonations = Donor & {
  donations: Donation[];
};

// Resumen financiero para el dashboard
export interface FinancialSummary {
  totalDonado: number;
  totalGastado: number;
  balance: number;
  meta: number | null;
  porcentajeMeta: number | null;
}

// Resumen del dashboard admin
export interface DashboardSummary {
  totalNinosActivos: number;
  totalNinosPendientes: number;
  totalVoluntariosAprobados: number;
  solicitudesPendientes: number;
  resumenFinanciero: FinancialSummary;
}
