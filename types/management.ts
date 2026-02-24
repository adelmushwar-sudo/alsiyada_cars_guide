/**
 * أنواع البيانات المشتركة لنظام إدارة البيانات الأساسية
 */

export interface Brand {
  id: string;
  name: string;
  order: number;
  createdAt: Date;
}

export interface Model {
  id: string;
  name: string;
  brandId: string;
  order: number;
  createdAt: Date;
}

export interface Trim {
  id: string;
  name: string;
  modelId: string;
  order: number;
  createdAt: Date;
}

export interface ExteriorColor {
  id: string;
  name: string;
  hexCode: string;
  order: number;
  createdAt: Date;
}

export interface InteriorColor {
  id: string;
  name: string;
  hexCode: string;
  order: number;
  createdAt: Date;
}

export interface RegionalSpec {
  id: string;
  name: string;
  order: number;
  createdAt: Date;
}

export interface ManagementSection {
  id: "brands" | "models" | "trims" | "exterior" | "interior" | "regional";
  title: string;
  icon: string;
  description: string;
  count: number;
  parentId?: string; // للأقسام التابعة
}

export interface CRUDItem {
  id: string;
  name: string;
  order: number;
  createdAt: Date;
  hexCode?: string; // للألوان فقط
  parentId?: string; // للموديلات والفئات
}
