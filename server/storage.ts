import { 
  adminUsers, 
  articles, 
  siteStats, 
  adBlocks,
  headUnits,
  speakers,
  amplifiers,
  subwoofers,
  audioConfigurations,
  configurationSpeakers,
  configurationAmplifiers,
  configurationSubwoofers,
  type AdminUser, 
  type InsertAdminUser,
  type Article, 
  type InsertArticle,
  type SiteStats,
  type InsertSiteStats,
  type AdBlock,
  type InsertAdBlock,
  type HeadUnit,
  type InsertHeadUnit,
  type Speaker,
  type InsertSpeaker,
  type Amplifier,
  type InsertAmplifier,
  type Subwoofer,
  type InsertSubwoofer,
  type AudioConfiguration,
  type InsertAudioConfiguration,
  type ConfigurationSpeaker,
  type InsertConfigurationSpeaker,
  type ConfigurationAmplifier,
  type InsertConfigurationAmplifier,
  type ConfigurationSubwoofer,
  type InsertConfigurationSubwoofer
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Admin users
  getAdminByEmail(email: string): Promise<AdminUser | undefined>;
  createAdmin(admin: InsertAdminUser): Promise<AdminUser>;
  
  // Articles
  getAllArticles(published?: boolean): Promise<Article[]>;
  getArticleById(id: string): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article>;
  deleteArticle(id: string): Promise<void>;
  getLatestArticles(limit: number): Promise<Article[]>;
  
  // Site statistics
  getTodayStats(): Promise<SiteStats | undefined>;
  updateStats(stats: InsertSiteStats): Promise<SiteStats>;
  
  // Ad blocks
  getAdBlocks(active?: boolean): Promise<AdBlock[]>;
  createAdBlock(adBlock: InsertAdBlock): Promise<AdBlock>;
  updateAdBlock(id: string, adBlock: Partial<InsertAdBlock>): Promise<AdBlock>;
  deleteAdBlock(id: string): Promise<void>;
  
  // Audio equipment
  getAllHeadUnits(active?: boolean): Promise<HeadUnit[]>;
  getHeadUnitById(id: string): Promise<HeadUnit | undefined>;
  createHeadUnit(headUnit: InsertHeadUnit): Promise<HeadUnit>;
  updateHeadUnit(id: string, headUnit: Partial<InsertHeadUnit>): Promise<HeadUnit>;
  deleteHeadUnit(id: string): Promise<void>;
  
  getAllSpeakers(active?: boolean): Promise<Speaker[]>;
  getSpeakerById(id: string): Promise<Speaker | undefined>;
  createSpeaker(speaker: InsertSpeaker): Promise<Speaker>;
  updateSpeaker(id: string, speaker: Partial<InsertSpeaker>): Promise<Speaker>;
  deleteSpeaker(id: string): Promise<void>;
  
  getAllAmplifiers(active?: boolean): Promise<Amplifier[]>;
  getAmplifierById(id: string): Promise<Amplifier | undefined>;
  createAmplifier(amplifier: InsertAmplifier): Promise<Amplifier>;
  updateAmplifier(id: string, amplifier: Partial<InsertAmplifier>): Promise<Amplifier>;
  deleteAmplifier(id: string): Promise<void>;
  
  getAllSubwoofers(active?: boolean): Promise<Subwoofer[]>;
  getSubwooferById(id: string): Promise<Subwoofer | undefined>;
  createSubwoofer(subwoofer: InsertSubwoofer): Promise<Subwoofer>;
  updateSubwoofer(id: string, subwoofer: Partial<InsertSubwoofer>): Promise<Subwoofer>;
  deleteSubwoofer(id: string): Promise<void>;
  
  // Audio configurations
  getAllConfigurations(): Promise<AudioConfiguration[]>;
  getConfigurationById(id: string): Promise<AudioConfiguration | undefined>;
  createConfiguration(config: InsertAudioConfiguration): Promise<AudioConfiguration>;
  updateConfiguration(id: string, config: Partial<InsertAudioConfiguration>): Promise<AudioConfiguration>;
  deleteConfiguration(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Admin users
  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return admin || undefined;
  }

  async createAdmin(adminData: InsertAdminUser): Promise<AdminUser> {
    const [admin] = await db
      .insert(adminUsers)
      .values(adminData)
      .returning();
    return admin;
  }

  // Articles
  async getAllArticles(published?: boolean): Promise<Article[]> {
    const query = db.select().from(articles);
    if (published !== undefined) {
      return await query.where(eq(articles.published, published)).orderBy(desc(articles.createdAt));
    }
    return await query.orderBy(desc(articles.createdAt));
  }

  async getArticleById(id: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article || undefined;
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.slug, slug));
    return article || undefined;
  }

  async createArticle(articleData: InsertArticle): Promise<Article> {
    const [article] = await db
      .insert(articles)
      .values({
        ...articleData,
        updatedAt: new Date(),
      })
      .returning();
    return article;
  }

  async updateArticle(id: string, articleData: Partial<InsertArticle>): Promise<Article> {
    const [article] = await db
      .update(articles)
      .set({
        ...articleData,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id))
      .returning();
    return article;
  }

  async deleteArticle(id: string): Promise<void> {
    await db.delete(articles).where(eq(articles.id, id));
  }

  async getLatestArticles(limit: number): Promise<Article[]> {
    return await db
      .select()
      .from(articles)
      .where(eq(articles.published, true))
      .orderBy(desc(articles.createdAt))
      .limit(limit);
  }

  // Site statistics
  async getTodayStats(): Promise<SiteStats | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [stats] = await db
      .select()
      .from(siteStats)
      .where(eq(siteStats.date, today));
    return stats || undefined;
  }

  async updateStats(statsData: InsertSiteStats): Promise<SiteStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingStats = await this.getTodayStats();
    
    if (existingStats) {
      const [updatedStats] = await db
        .update(siteStats)
        .set({
          visitors: (existingStats.visitors || 0) + (statsData.visitors || 0),
          pageviews: (existingStats.pageviews || 0) + (statsData.pageviews || 0),
          calculations: (existingStats.calculations || 0) + (statsData.calculations || 0),
        })
        .where(eq(siteStats.date, today))
        .returning();
      return updatedStats;
    } else {
      const [newStats] = await db
        .insert(siteStats)
        .values({
          ...statsData,
          date: today,
        })
        .returning();
      return newStats;
    }
  }

  // Ad blocks
  async getAdBlocks(active?: boolean): Promise<AdBlock[]> {
    const query = db.select().from(adBlocks);
    if (active !== undefined) {
      return await query.where(eq(adBlocks.active, active));
    }
    return await query;
  }

  async createAdBlock(adBlockData: InsertAdBlock): Promise<AdBlock> {
    const [adBlock] = await db
      .insert(adBlocks)
      .values(adBlockData)
      .returning();
    return adBlock;
  }

  async updateAdBlock(id: string, adBlockData: Partial<InsertAdBlock>): Promise<AdBlock> {
    const [adBlock] = await db
      .update(adBlocks)
      .set(adBlockData)
      .where(eq(adBlocks.id, id))
      .returning();
    return adBlock;
  }

  async deleteAdBlock(id: string): Promise<void> {
    await db.delete(adBlocks).where(eq(adBlocks.id, id));
  }

  // Head Units
  async getAllHeadUnits(active?: boolean): Promise<HeadUnit[]> {
    const query = db.select().from(headUnits);
    if (active !== undefined) {
      return await query.where(eq(headUnits.active, active)).orderBy(desc(headUnits.createdAt));
    }
    return await query.orderBy(desc(headUnits.createdAt));
  }

  async getHeadUnitById(id: string): Promise<HeadUnit | undefined> {
    const [headUnit] = await db.select().from(headUnits).where(eq(headUnits.id, id));
    return headUnit || undefined;
  }

  async createHeadUnit(headUnitData: InsertHeadUnit): Promise<HeadUnit> {
    const [headUnit] = await db
      .insert(headUnits)
      .values(headUnitData)
      .returning();
    return headUnit;
  }

  async updateHeadUnit(id: string, headUnitData: Partial<InsertHeadUnit>): Promise<HeadUnit> {
    const [headUnit] = await db
      .update(headUnits)
      .set(headUnitData)
      .where(eq(headUnits.id, id))
      .returning();
    return headUnit;
  }

  async deleteHeadUnit(id: string): Promise<void> {
    await db.delete(headUnits).where(eq(headUnits.id, id));
  }

  // Speakers
  async getAllSpeakers(active?: boolean): Promise<Speaker[]> {
    const query = db.select().from(speakers);
    if (active !== undefined) {
      return await query.where(eq(speakers.active, active)).orderBy(desc(speakers.createdAt));
    }
    return await query.orderBy(desc(speakers.createdAt));
  }

  async getSpeakerById(id: string): Promise<Speaker | undefined> {
    const [speaker] = await db.select().from(speakers).where(eq(speakers.id, id));
    return speaker || undefined;
  }

  async createSpeaker(speakerData: InsertSpeaker): Promise<Speaker> {
    const [speaker] = await db
      .insert(speakers)
      .values(speakerData)
      .returning();
    return speaker;
  }

  async updateSpeaker(id: string, speakerData: Partial<InsertSpeaker>): Promise<Speaker> {
    const [speaker] = await db
      .update(speakers)
      .set(speakerData)
      .where(eq(speakers.id, id))
      .returning();
    return speaker;
  }

  async deleteSpeaker(id: string): Promise<void> {
    await db.delete(speakers).where(eq(speakers.id, id));
  }

  // Amplifiers
  async getAllAmplifiers(active?: boolean): Promise<Amplifier[]> {
    const query = db.select().from(amplifiers);
    if (active !== undefined) {
      return await query.where(eq(amplifiers.active, active)).orderBy(desc(amplifiers.createdAt));
    }
    return await query.orderBy(desc(amplifiers.createdAt));
  }

  async getAmplifierById(id: string): Promise<Amplifier | undefined> {
    const [amplifier] = await db.select().from(amplifiers).where(eq(amplifiers.id, id));
    return amplifier || undefined;
  }

  async createAmplifier(amplifierData: InsertAmplifier): Promise<Amplifier> {
    const [amplifier] = await db
      .insert(amplifiers)
      .values(amplifierData)
      .returning();
    return amplifier;
  }

  async updateAmplifier(id: string, amplifierData: Partial<InsertAmplifier>): Promise<Amplifier> {
    const [amplifier] = await db
      .update(amplifiers)
      .set(amplifierData)
      .where(eq(amplifiers.id, id))
      .returning();
    return amplifier;
  }

  async deleteAmplifier(id: string): Promise<void> {
    await db.delete(amplifiers).where(eq(amplifiers.id, id));
  }

  // Subwoofers
  async getAllSubwoofers(active?: boolean): Promise<Subwoofer[]> {
    const query = db.select().from(subwoofers);
    if (active !== undefined) {
      return await query.where(eq(subwoofers.active, active)).orderBy(desc(subwoofers.createdAt));
    }
    return await query.orderBy(desc(subwoofers.createdAt));
  }

  async getSubwooferById(id: string): Promise<Subwoofer | undefined> {
    const [subwoofer] = await db.select().from(subwoofers).where(eq(subwoofers.id, id));
    return subwoofer || undefined;
  }

  async createSubwoofer(subwooferData: InsertSubwoofer): Promise<Subwoofer> {
    const [subwoofer] = await db
      .insert(subwoofers)
      .values(subwooferData)
      .returning();
    return subwoofer;
  }

  async updateSubwoofer(id: string, subwooferData: Partial<InsertSubwoofer>): Promise<Subwoofer> {
    const [subwoofer] = await db
      .update(subwoofers)
      .set(subwooferData)
      .where(eq(subwoofers.id, id))
      .returning();
    return subwoofer;
  }

  async deleteSubwoofer(id: string): Promise<void> {
    await db.delete(subwoofers).where(eq(subwoofers.id, id));
  }

  // Audio Configurations
  async getAllConfigurations(): Promise<AudioConfiguration[]> {
    return await db.select().from(audioConfigurations).orderBy(desc(audioConfigurations.createdAt));
  }

  async getConfigurationById(id: string): Promise<AudioConfiguration | undefined> {
    const [configuration] = await db.select().from(audioConfigurations).where(eq(audioConfigurations.id, id));
    return configuration || undefined;
  }

  async createConfiguration(configData: InsertAudioConfiguration): Promise<AudioConfiguration> {
    const [configuration] = await db
      .insert(audioConfigurations)
      .values({
        ...configData,
        updatedAt: new Date(),
      })
      .returning();
    return configuration;
  }

  async updateConfiguration(id: string, configData: Partial<InsertAudioConfiguration>): Promise<AudioConfiguration> {
    const [configuration] = await db
      .update(audioConfigurations)
      .set({
        ...configData,
        updatedAt: new Date(),
      })
      .where(eq(audioConfigurations.id, id))
      .returning();
    return configuration;
  }

  async deleteConfiguration(id: string): Promise<void> {
    await db.delete(audioConfigurations).where(eq(audioConfigurations.id, id));
  }
}

export const storage = new DatabaseStorage();
