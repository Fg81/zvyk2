import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin users table
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Articles table
export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Site statistics table
export const siteStats = pgTable("site_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").defaultNow(),
  visitors: integer("visitors").default(0),
  pageviews: integer("pageviews").default(0),
  calculations: integer("calculations").default(0),
});

// Advertisement blocks table
export const adBlocks = pgTable("ad_blocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  content: text("content").notNull(),
  position: text("position").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const articlesRelations = relations(articles, ({ many }) => ({
  // No relations needed for now
}));

// Insert schemas
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSiteStatsSchema = createInsertSchema(siteStats).omit({
  id: true,
  date: true,
});

export const insertAdBlockSchema = createInsertSchema(adBlocks).omit({
  id: true,
  createdAt: true,
});

// Audio equipment categories
export const headUnits = pgTable("head_units", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  powerOutput: integer("power_output").notNull(), // Watts
  features: text("features").array(),
  price: integer("price"), // Price in rubles
  imageUrl: text("image_url"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const speakers = pgTable("speakers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  type: text("type").notNull(), // coaxial, component, midrange, tweeter
  size: integer("size").notNull(), // Size in mm (130, 165, etc)
  powerRms: integer("power_rms").notNull(), // RMS power in watts
  powerMax: integer("power_max").notNull(), // Max power in watts
  impedance: integer("impedance").notNull(), // Impedance in ohms
  frequencyResponse: text("frequency_response"), // e.g., "35Hz-20kHz"
  sensitivity: integer("sensitivity"), // dB/W/m
  price: integer("price"),
  imageUrl: text("image_url"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const amplifiers = pgTable("amplifiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  channels: integer("channels").notNull(), // Number of channels
  powerPerChannel: integer("power_per_channel").notNull(), // Watts per channel at 4 ohms
  powerBridged: integer("power_bridged"), // Bridged power
  minImpedance: integer("min_impedance").notNull(), // Minimum impedance
  features: text("features").array(),
  price: integer("price"),
  imageUrl: text("image_url"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subwoofers = pgTable("subwoofers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  size: integer("size").notNull(), // Size in inches (8, 10, 12, 15, etc)
  powerRms: integer("power_rms").notNull(),
  powerMax: integer("power_max").notNull(),
  impedance: integer("impedance").notNull(),
  frequencyResponse: text("frequency_response"),
  sensitivity: integer("sensitivity"),
  mountingDepth: integer("mounting_depth"), // mm
  price: integer("price"),
  imageUrl: text("image_url"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Car audio configurations
export const audioConfigurations = pgTable("audio_configurations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  carBodyType: text("car_body_type").notNull(), // sedan, hatchback, coupe, SUV, etc
  headUnitId: varchar("head_unit_id").references(() => headUnits.id),
  // Custom head unit for advanced mode
  customHeadUnit: text("custom_head_unit"),
  carPower: integer("car_power").notNull(), // Car electrical system power (12V = 12, 24V = 24)
  advancedMode: boolean("advanced_mode").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const configurationSpeakers = pgTable("configuration_speakers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  configurationId: varchar("configuration_id").references(() => audioConfigurations.id, { onDelete: "cascade" }).notNull(),
  speakerId: varchar("speaker_id").references(() => speakers.id),
  customSpeaker: text("custom_speaker"), // For advanced mode
  position: text("position").notNull(), // front_left, front_right, rear_left, rear_right
  quantity: integer("quantity").default(1),
});

export const configurationAmplifiers = pgTable("configuration_amplifiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  configurationId: varchar("configuration_id").references(() => audioConfigurations.id, { onDelete: "cascade" }).notNull(),
  amplifierId: varchar("amplifier_id").references(() => amplifiers.id),
  customAmplifier: text("custom_amplifier"), // For advanced mode
  powersChannels: text("powers_channels").array(), // Which channels/speakers this amp powers
  bridgedMode: boolean("bridged_mode").default(false),
});

export const configurationSubwoofers = pgTable("configuration_subwoofers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  configurationId: varchar("configuration_id").references(() => audioConfigurations.id, { onDelete: "cascade" }).notNull(),
  subwooferId: varchar("subwoofer_id").references(() => subwoofers.id),
  customSubwoofer: text("custom_subwoofer"), // For advanced mode
  quantity: integer("quantity").default(1),
  boxType: text("box_type"), // sealed, ported, bandpass
});

// Insert schemas for new tables
export const insertHeadUnitSchema = createInsertSchema(headUnits).omit({
  id: true,
  createdAt: true,
});

export const insertSpeakerSchema = createInsertSchema(speakers).omit({
  id: true,
  createdAt: true,
});

export const insertAmplifierSchema = createInsertSchema(amplifiers).omit({
  id: true,
  createdAt: true,
});

export const insertSubwooferSchema = createInsertSchema(subwoofers).omit({
  id: true,
  createdAt: true,
});

export const insertAudioConfigurationSchema = createInsertSchema(audioConfigurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConfigurationSpeakerSchema = createInsertSchema(configurationSpeakers).omit({
  id: true,
});

export const insertConfigurationAmplifierSchema = createInsertSchema(configurationAmplifiers).omit({
  id: true,
});

export const insertConfigurationSubwooferSchema = createInsertSchema(configurationSubwoofers).omit({
  id: true,
});

// Types
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type SiteStats = typeof siteStats.$inferSelect;
export type InsertSiteStats = z.infer<typeof insertSiteStatsSchema>;
export type AdBlock = typeof adBlocks.$inferSelect;
export type InsertAdBlock = z.infer<typeof insertAdBlockSchema>;

// Audio equipment types
export type HeadUnit = typeof headUnits.$inferSelect;
export type InsertHeadUnit = z.infer<typeof insertHeadUnitSchema>;
export type Speaker = typeof speakers.$inferSelect;
export type InsertSpeaker = z.infer<typeof insertSpeakerSchema>;
export type Amplifier = typeof amplifiers.$inferSelect;
export type InsertAmplifier = z.infer<typeof insertAmplifierSchema>;
export type Subwoofer = typeof subwoofers.$inferSelect;
export type InsertSubwoofer = z.infer<typeof insertSubwooferSchema>;
export type AudioConfiguration = typeof audioConfigurations.$inferSelect;
export type InsertAudioConfiguration = z.infer<typeof insertAudioConfigurationSchema>;
export type ConfigurationSpeaker = typeof configurationSpeakers.$inferSelect;
export type InsertConfigurationSpeaker = z.infer<typeof insertConfigurationSpeakerSchema>;
export type ConfigurationAmplifier = typeof configurationAmplifiers.$inferSelect;
export type InsertConfigurationAmplifier = z.infer<typeof insertConfigurationAmplifierSchema>;
export type ConfigurationSubwoofer = typeof configurationSubwoofers.$inferSelect;
export type InsertConfigurationSubwoofer = z.infer<typeof insertConfigurationSubwooferSchema>;
