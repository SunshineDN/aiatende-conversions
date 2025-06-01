import BaseRepository from "./BaseRepository.js";
import prisma from "../prisma-client.js";
export default class MarketingTrackingRepository extends BaseRepository {
  constructor() {
    super(prisma.marketing_tracking);
  }

  async updateByClientId(gclientid, data) {
    // return await this.model.update(data, { where: { gclientid } });
    return await this.model.update({
      where: {
        gclientid,
      },
      data,
    });
  }

  async findOrCreateTracking(gclientid, hash, data) {
    return await this.findOrCreate({
      where: {
        hash_gclientid: { gclientid, hash }
      },
      update: { updated_at: new Date(), ...data },
      create: { gclientid, hash, created_at: new Date(), updated_at: new Date(), ...data },
    });
  }
}